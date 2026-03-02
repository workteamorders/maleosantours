/**
 * Hotels List - Admin
 * Shows all hotels with Table / Preview toggle
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Eye, EyeOff, Hotel, MapPin, ExternalLink } from 'lucide-react';
import { DeleteButton, ToggleActiveButton } from './HotelActions';
import PreviewToggle from '@/components/admin/PreviewToggle';

const categoryLabels: Record<string, string> = {
  luxury: 'Mewah',
  boutique: 'Boutique',
  beach: 'Beach Resort',
  budget: 'Ekonomis',
  family: 'Keluarga',
  business: 'Bisnis',
};

function parseJSON(str: string): any[] {
  try { return JSON.parse(str); } catch { return []; }
}

async function getHotels() {
  return prisma.hotel.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export default async function HotelsAdminPage() {
  const hotels = await getHotels();

  /* ── TABLE VIEW ── */
  const tableView = (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-[800px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bintang</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hotels.map((h) => (
            <tr key={h.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img src={h.mainImage} alt={h.nameEn} className="w-16 h-16 rounded object-cover" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{h.nameEn}</div>
                    <div className="text-sm text-gray-500">{h.nameId}</div>
                    {h.featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        Unggulan
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {categoryLabels[h.category] || h.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                {'⭐'.repeat(h.stars)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {h.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {h.active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Eye className="w-3 h-3 mr-1" /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <EyeOff className="w-3 h-3 mr-1" /> Tidak Aktif
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/hotels/${h.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4 mr-1" /> Ubah
                  </Link>
                  <ToggleActiveButton id={h.id} active={h.active} />
                  <DeleteButton id={h.id} name={h.nameEn} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── PREVIEW VIEW (matches public hotel page card design) ── */
  const previewView = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hotels.map((h) => {
        const facilities = parseJSON(h.facilities);

        return (
          <div
            key={h.id}
            className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${
              !h.active ? 'opacity-60 ring-2 ring-red-200' : ''
            }`}
          >
            {/* Status badge */}
            {!h.active && (
              <div className="bg-red-50 text-red-700 text-xs font-medium text-center py-1">
                Tidak Aktif (Hidden dari publik)
              </div>
            )}

            {/* Title + Stars */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">{h.nameId || h.nameEn}</h3>
                {h.featured && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ★ Unggulan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-yellow-500">{'⭐'.repeat(h.stars)}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {categoryLabels[h.category] || h.category}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
              <img src={h.mainImage} alt={h.nameEn} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">{h.descId || h.descEn}</p>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {h.location}
              </div>

              {/* Facilities */}
              {facilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {facilities.slice(0, 6).map((f, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {f}
                    </span>
                  ))}
                  {facilities.length > 6 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                      +{facilities.length - 6} lagi
                    </span>
                  )}
                </div>
              )}

              {/* Price Range & Booking */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {h.priceRange && (
                  <span className="text-emerald-600 font-bold text-lg">{h.priceRange}</span>
                )}
                {h.bookingUrl && (
                  <a
                    href={h.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Booking
                  </a>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <Link
                href={`/admin/hotels/${h.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm"
              >
                <Edit className="w-4 h-4 mr-1" /> Ubah
              </Link>
              <ToggleActiveButton id={h.id} active={h.active} />
              <DeleteButton id={h.id} name={h.nameEn} />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hotel</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola daftar hotel dan akomodasi ({hotels.length} total)</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Belum ada hotel.</p>
          <Link
            href="/admin/hotels/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Hotel Pertama
          </Link>
        </div>
      ) : (
        <PreviewToggle tableView={tableView} previewView={previewView} />
      )}
    </div>
  );
}
