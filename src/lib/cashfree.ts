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
 * Verify Cashfree webhook HMAC using the dashboard webhook Secret Key
 * (falls back to API client secret if webhook secret is unset).
 */
export function verifyCashfreeWebhookSignature(
  signature: string,
  rawBody: string,
  timestamp: string,
): boolean {
  if (!signature || !timestamp || !rawBody) {
    return false;
  }

  const secret =
    process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_CLIENT_SECRET;

  if (!secret) {
    throw new Error('Cashfree webhook secret is not configured');
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(timestamp + rawBody)
    .digest('base64');

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
