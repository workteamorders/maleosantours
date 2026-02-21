/**
 * Tour Packages List - Admin
 * Shows all tour packages with search, filter, and actions
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { DeleteButton, ToggleActiveButton } from './Actions';

async function getTourPackages() {
  const packages = await prisma.tourPackage.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: {
        select: { testimonials: true },
      },
    },
  });

  return packages;
}

export default async function TourPackagesPage() {
  const packages = await getTourPackages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paket Tur</h1>
          <p className="text-gray-600 mt-1">Kelola paket tur dan itinerari</p>
        </div>
        <Link
          href="/admin/tour-packages/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Paket Baru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Belum ada paket tur. Klik "Tambah Paket Baru" untuk membuat.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={pkg.mainImage}
                        alt={pkg.nameEn}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pkg.nameEn}</div>
                        <div className="text-sm text-gray-500">{pkg.nameId}</div>
                        {pkg.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Unggulan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{pkg.type.replace('-', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.price ? `$${pkg.price}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/tour-packages/${pkg.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Ubah
                    </Link>
                    <ToggleActiveButton id={pkg.id} active={pkg.active} />
                    <DeleteButton id={pkg.id} name={pkg.nameEn} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
