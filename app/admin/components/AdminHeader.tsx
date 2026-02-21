'use client';

/**
 * Admin Header
 * Shows logged-in admin info and logout button
 */

import { LogOut, Eye } from 'lucide-react';
import { logoutAction } from '../actions';
import Link from 'next/link';

interface AdminHeaderProps {
  admin: {
    name: string;
    email: string;
  };
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  async function handleLogout() {
    await logoutAction();
    window.location.href = '/admin/login';
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Panel Admin</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Public Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat Website
          </Link>

          {/* Admin Info */}
          <div className="flex items-center">
            <div className="text-right mr-3">
              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
