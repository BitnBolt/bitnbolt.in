/** Ordered notification domains for Telegram routing & admin UI */

export const NOTIFICATION_DOMAINS = [
  {
    id: 'orders',
    label: 'Orders',
    group: 'Commerce',
    description: 'Order placed, status changes, cancellations',
  },
  {
    id: 'payments',
    label: 'Payments',
    group: 'Commerce',
    description: 'Payment success, failure, pending, refunds',
  },
  {
    id: 'shipping',
    label: 'Shipping',
    group: 'Commerce',
    description: 'Shiprocket AWB, courier, tracking updates',
  },
  {
    id: 'vendors',
    label: 'Vendors',
    group: 'Marketplace',
    description: 'Signup, approval, suspension',
  },
  {
    id: 'products',
    label: 'Products',
    group: 'Marketplace',
    description: 'Publish, suspend, pricing, stock alerts',
  },
  {
    id: 'customers',
    label: 'Customers',
    group: 'Accounts',
    description: 'Signup, profile, account activity',
  },
  {
    id: 'auth',
    label: 'Auth & OTP',
    group: 'Accounts',
    description: 'Email/SMS OTP, password reset (ops visibility)',
  },
  {
    id: 'career_applications',
    label: 'Internship Applications',
    group: 'Career',
    description: 'Internship / trainee applications & status',
  },
  {
    id: 'cap',
    label: 'CAP',
    group: 'Career',
    description: 'CAP applications & open/close toggle',
  },
  {
    id: 'service_inquiries',
    label: 'Service Inquiries',
    group: 'Leads',
    description: 'Contact, PCB, firmware quote requests',
  },
  {
    id: 'system',
    label: 'System',
    group: 'Platform',
    description: 'Server errors, failed request resolution',
  },
] as const;

export type NotificationDomainId = (typeof NOTIFICATION_DOMAINS)[number]['id'];

export const NOTIFICATION_DOMAIN_IDS = NOTIFICATION_DOMAINS.map((d) => d.id);

export function isNotificationDomain(value: string): value is NotificationDomainId {
  return (NOTIFICATION_DOMAIN_IDS as readonly string[]).includes(value);
}

export function domainLabel(id: string): string {
  return NOTIFICATION_DOMAINS.find((d) => d.id === id)?.label || id;
}
