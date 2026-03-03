'use client';

/**
 * Admin Sidebar Navigation
 * Desktop: fixed left sidebar (always visible above lg)
 * Mobile: overlay sidebar with backdrop (toggled via hamburger in header)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Hotel,
  Car,
  MessageSquare,
  Info,
  Mail,
  Settings,
  Image as ImageIcon,
  Home,
  Users,
  X,
  LayoutTemplate,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/admin/homepage', label: 'Beranda', icon: Home },
  { href: '/admin/tour-packages', label: 'Paket Tur', icon: Package },
  { href: '/admin/hotels', label: 'Hotel', icon: Hotel },
  { href: '/admin/transport', label: 'Transportasi', icon: Car },
  { href: '/admin/info-travel', label: 'Info Travel', icon: Info },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquare },
  { href: '/admin/contact', label: 'Kontak', icon: Mail },
  { href: '/admin/media', label: 'Pustaka Media', icon: ImageIcon },
  { href: '/admin/page-headers', label: 'Header Halaman', icon: LayoutTemplate },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

interface AdminSidebarProps {
  role?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ role, isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const isBoss = role === 'boss';

  const allNavItems = isBoss
    ? [...navItems, { href: '/admin/admin-users', label: 'Manajemen Admin', icon: Users }]
    : navItems;

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Logo + Close button (mobile) */}
      <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
        <h1 className="text-xl font-serif font-bold text-white">
          Maleosan Travel
        </h1>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Admin CMS v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-gray-900">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 lg:hidden animate-slide-in-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
