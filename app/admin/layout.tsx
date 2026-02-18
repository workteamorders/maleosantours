/**
 * Admin Layout
 * Wraps all /admin/* pages (except login)
 * Provides sidebar navigation and header
 */

import { getCurrentAdmin } from '@/lib/auth';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If not authenticated, render children without admin shell
  // (login page will render on its own, proxy.ts handles route protection)
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="lg:pl-64">
        <AdminHeader admin={admin} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
