import { NextRequest } from 'next/server';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageNotifications } from '@/lib/telegram-admin';
import { onNotificationLog } from '@/lib/telegram-notify';

/**
 * SSE stream for real-time notification monitoring.
 * Auth via ?token= because EventSource cannot set Authorization headers.
 */
export async function GET(request: NextRequest) {
  const token =
    extractTokenFromHeader(request.headers.get('authorization')) ||
    request.nextUrl.searchParams.get('token');

  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const decoded = verifyAdminToken(token);
  if (!decoded || !canManageNotifications(decoded)) {
    return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), {
      status: 403,
    });
  }

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('connected', { ok: true, at: new Date().toISOString() });

      const unsubscribe = onNotificationLog((log) => {
        try {
          send('notification', log);
        } catch {
          // stream closed
        }
      });

      const heartbeat = setInterval(() => {
        try {
          send('ping', { at: new Date().toISOString() });
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      cleanup = () => {
        unsubscribe();
        clearInterval(heartbeat);
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
