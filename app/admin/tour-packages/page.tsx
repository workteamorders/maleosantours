/**
 * Tour Packages List - Admin
 * Shows all tour packages with Table / Preview toggle
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { DeleteButton, ToggleActiveButton } from './TourPackageActions';
import PreviewToggle from '@/components/admin/PreviewToggle';

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

  // Separate by type for preview
  const dayTours = packages.filter((pkg) => pkg.type === 'day-tour');
  const multiDayTours = packages.filter((pkg) => pkg.type === 'multi-day' || pkg.type === 'custom');

  /* ── TABLE VIEW ── */
  const tableView = (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-[800px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packages.map((pkg) => (
            <tr key={pkg.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img src={pkg.mainImage} alt={pkg.nameEn} className="w-16 h-16 rounded object-cover" />
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {pkg.active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Eye className="w-3 h-3 mr-1" /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <EyeOff className="w-3 h-3 mr-1" /> Tidak Aktif
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link href={`/admin/tour-packages/${pkg.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4 mr-1" /> Ubah
                </Link>
                <ToggleActiveButton id={pkg.id} active={pkg.active} />
                <DeleteButton id={pkg.id} name={pkg.nameEn} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Render a single preview card (matches public paket-tour page) ── */
  function PreviewCard({ pkg }: { pkg: typeof packages[0] }) {
    return (
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${
          !pkg.active ? 'opacity-60 ring-2 ring-red-200' : ''
        }`}
      >
        {/* Status badge */}
        {!pkg.active && (
          <div className="bg-red-50 text-red-700 text-xs font-medium text-center py-1">
            Tidak Aktif (Hidden dari publik)
          </div>
        )}

        {/* Title + Featured */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h3 className="font-serif text-2xl">{pkg.nameId || pkg.nameEn}</h3>
          {pkg.featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ★ Unggulan
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
          <img src={pkg.mainImage} alt={pkg.nameEn} className="w-full h-full object-cover" />
        </div>

        {/* Video */}
        {pkg.videoUrl && (
          <div className="px-6 pt-4">
            <video src={pkg.videoUrl} controls className="w-full rounded-lg" preload="metadata" />
          </div>
        )}

        {/* Description + Duration + Price */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 line-clamp-3">{pkg.descId || pkg.descEn}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{pkg.duration}</span>
            {pkg.price && (
              <span className="text-emerald-600 font-bold text-lg">
                Rp {pkg.price.toLocaleString('id-ID')}
                {pkg.priceUnit && <span className="text-sm font-normal text-gray-500"> / {pkg.priceUnit}</span>}
              </span>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <Link
            href={`/admin/tour-packages/${pkg.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm"
          >
            <Edit className="w-4 h-4 mr-1" /> Ubah
          </Link>
          <ToggleActiveButton id={pkg.id} active={pkg.active} />
          <DeleteButton id={pkg.id} name={pkg.nameEn} />
        </div>
      </div>
    );
  }

  /* ── PREVIEW VIEW (matches public page with Day / Multi-Day sections) ── */
  const previewView = (
    <div className="space-y-12">
      {/* Day Tour Section */}
      {dayTours.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-gray-900 mb-1">Tur Harian</h2>
            <p className="text-gray-500 text-sm">Jelajahi destinasi terbaik dalam satu hari</p>
            <div className="w-16 h-1 bg-blue-500 mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {dayTours.map((pkg) => (
              <PreviewCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* Multi-Day Tour Section */}
      {multiDayTours.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-gray-900 mb-1">Tur Multi-Hari</h2>
            <p className="text-gray-500 text-sm">Paket perjalanan lengkap untuk pengalaman mendalam</p>
            <div className="w-16 h-1 bg-green-500 mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {multiDayTours.map((pkg) => (
              <PreviewCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paket Tur</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola paket tur dan itinerari ({packages.length} total)</p>
        </div>
        <Link
          href="/admin/tour-packages/new"
          className="flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Paket Baru
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 md:p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Belum ada paket tur. Klik &quot;Tambah Paket Baru&quot; untuk membuat.</p>
          <Link
            href="/admin/tour-packages/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Paket Baru
          </Link>
        </div>
      ) : (
        <PreviewToggle tableView={tableView} previewView={previewView} />
      )}
    </div>
  );
}
