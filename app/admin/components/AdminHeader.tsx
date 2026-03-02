'use client';

/**
 * Admin Header
 * Shows hamburger toggle (mobile), logged-in admin info, and logout
 * Responsive: stacks/hides elements on small screens
 */

import { LogOut, Eye, Menu } from 'lucide-react';
import { logoutAction } from '../actions';
import Link from 'next/link';

interface AdminHeaderProps {
  admin: {
    name: string;
    email: string;
    role: string;
  };
  onMenuToggle?: () => void;
}

function roleLabel(role: string) {
  return role === 'boss' ? 'Boss' : 'Karyawan';
}

export default function AdminHeader({ admin, onMenuToggle }: AdminHeaderProps) {
  async function handleLogout() {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar dari panel admin?');
    if (confirmed) {
      await logoutAction();
      window.location.href = '/admin/login';
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Hamburger (mobile) + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Buka menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Panel Admin</h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* View Public Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center px-2 md:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Lihat Website"
          >
            <Eye className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Lihat Website</span>
          </Link>

          {/* Admin Info — hidden on very small screens */}
          <div className="hidden sm:flex items-center">
            <div className="text-right mr-3">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">{admin.name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{admin.email}</p>
              <p className="text-[11px] text-blue-600 font-medium">{roleLabel(admin.role)}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Mobile: just avatar */}
          <div className="sm:hidden w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {admin.name.charAt(0).toUpperCase()}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-2 md:px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
