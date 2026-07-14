import { AdminTokenPayload } from '@/lib/admin-jwt';

export function canManageCareers(decoded: Pick<AdminTokenPayload, 'role' | 'permissions'>) {
  return decoded.role === 'super_admin' || decoded.permissions?.includes('manage_careers');
}

export function slugifyJobTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
