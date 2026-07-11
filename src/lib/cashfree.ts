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
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}
