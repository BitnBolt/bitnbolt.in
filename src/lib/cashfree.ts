import crypto from 'crypto';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

export function getCashfreeClient() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Cashfree is not configured');
  }

  const env =
    process.env.CASHFREE_ENV === 'production'
      ? CFEnvironment.PRODUCTION
      : CFEnvironment.SANDBOX;

  return new Cashfree(env, clientId, clientSecret);
}

export function getCashfreeMode(): 'sandbox' | 'production' {
  return process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
}

export function getAppBaseUrl() {
  // Prefer public app URL so Cashfree notify/return URLs are reachable
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

/**
 * Verify Cashfree webhook HMAC.
 * Dashboard "Webhook Secret Key" and API Client Secret are both tried,
 * because Cashfree docs/dashboards differ on which key signs the payload.
 */
export function verifyCashfreeWebhookSignature(
  signature: string,
  rawBody: string,
  timestamp: string,
): boolean {
  if (!signature || !timestamp || !rawBody) {
    return false;
  }

  const secrets = [
    process.env.CASHFREE_WEBHOOK_SECRET,
    process.env.CASHFREE_CLIENT_SECRET,
  ].filter((value, index, arr): value is string => Boolean(value) && arr.indexOf(value) === index);

  if (secrets.length === 0) {
    throw new Error('Cashfree webhook secret is not configured');
  }

  const receivedBuf = Buffer.from(signature);

  for (const secret of secrets) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(timestamp + rawBody)
      .digest('base64');

    const expectedBuf = Buffer.from(expected);
    if (
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      return true;
    }
  }

  return false;
}
