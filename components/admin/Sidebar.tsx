'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Hotel,
  Car,
  Package,
  ShoppingCart,
  Image,
  Users,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  {
    label: 'Dasbor',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Hotel',
    href: '/admin/hotels',
    icon: Hotel,
  },
  {
    label: 'Transportasi',
    href: '/admin/transport',
    icon: Car,
  },
  {
    label: 'Paket Tur',
    href: '/admin/paket-tour',
    icon: Package,
  },
  {
    label: 'Pesanan',
    href: '/admin/bookings',
    icon: ShoppingCart,
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Pengguna',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Pengaturan',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white transition-transform z-50 md:z-0 md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Maleosan</h1>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
