/**
 * Admin Dashboard - Main Page
 * Shows overview statistics and quick access
 */

import { prisma } from '@/lib/prisma';
import { Package, Hotel, Car, MessageSquare, Mail, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const [
    tourPackagesCount,
    hotelsCount,
    transportCount,
    testimonialsCount,
    contactSubmissionsCount,
    infoTravelCount,
  ] = await Promise.all([
    prisma.tourPackage.count({ where: { active: true } }),
    prisma.hotel.count({ where: { active: true } }),
    prisma.transport.count({ where: { available: true } }),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.contactSubmission.count({ where: { status: 'new' } }),
    prisma.infoTravel.count({ where: { published: true } }),
  ]);

  return {
    tourPackagesCount,
    hotelsCount,
    transportCount,
    testimonialsCount,
    contactSubmissionsCount,
    infoTravelCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Tour Packages',
      value: stats.tourPackagesCount,
      icon: Package,
      href: '/admin/tour-packages',
      color: 'blue',
    },
    {
      title: 'Info Travel',
      value: stats.infoTravelCount,
      icon: Info,
      href: '/admin/info-travel',
      color: 'teal',
    },
    {
      title: 'Hotels',
      value: stats.hotelsCount,
      icon: Hotel,
      href: '/admin/hotels',
      color: 'green',
    },
    {
      title: 'Transport',
      value: stats.transportCount,
      icon: Car,
      href: '/admin/transport',
      color: 'purple',
    },
    {
      title: 'Testimonials',
      value: stats.testimonialsCount,
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'yellow',
    },
    {
      title: 'New Messages',
      value: stats.contactSubmissionsCount,
      icon: Mail,
      href: '/admin/contact',
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            teal: 'bg-teal-100 text-teal-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600',
          };

          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/tour-packages/new"
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            Add Tour Package
          </Link>
          <Link
            href="/admin/info-travel/new"
            className="flex items-center justify-center px-6 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Info className="w-5 h-5 mr-2" />
            Add Info Travel
          </Link>
          <Link
            href="/admin/hotels/new"
            className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Hotel className="w-5 h-5 mr-2" />
            Add Hotel
          </Link>
          <Link
            href="/admin/transport/new"
            className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Car className="w-5 h-5 mr-2" />
            Add Transport
          </Link>
          <Link
            href="/admin/contact"
            className="flex items-center justify-center px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            View Messages
          </Link>
        </div>
      </div>

      {/* Welcome Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Getting Started
        </h3>
        <p className="text-gray-700 mb-4">
          This Admin CMS allows you to manage all content on the Maleosan Travel website.
          All changes are immediately reflected on the public website.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Use the sidebar to navigate between different content types</li>
          <li>✅ All content supports multi-language (ID, EN, ZH, ZH-CN)</li>
          <li>✅ Use the "View Site" button to see your changes live</li>
          <li>✅ Remember to set items as "Published" or "Active" to show them publicly</li>
        </ul>
      </div>
    </div>
  );
}
