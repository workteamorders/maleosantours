'use client';

/**
 * AdminShell - Client wrapper that manages mobile sidebar state
 * Coordinates communication between AdminSidebar and AdminHeader
 * Hides sidebar/header on login page
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminShellProps {
  admin: { name: string; email: string; role: string };
  children: React.ReactNode;
}

export default function AdminShell({ admin, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page renders without shell chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        role={admin.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader
          admin={admin}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
