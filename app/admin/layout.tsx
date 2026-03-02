/**
 * Admin Layout
 * Wraps all /admin/* pages
 * Provides sidebar navigation and header
 * Login page is handled by proxy.ts redirect when no session cookie exists
 */

export const dynamic = 'force-dynamic';

import { getCurrentAdmin } from '@/lib/auth';
import AdminShell from './components/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If not authenticated, render without shell.
  // proxy.ts will redirect to /admin/login if no session cookie.
  // This path is only reached for the login page itself (which has cookie exemption)
  // or if DB session lookup fails temporarily.
  if (!admin) {
    return (
      <AdminShell admin={{ name: 'Admin', email: '', role: 'karyawan' }}>
        {children}
      </AdminShell>
    );
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
