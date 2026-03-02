/**
 * Transport List - Admin
 * Shows all transport options with Table / Preview toggle
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Eye, EyeOff, Car } from 'lucide-react';
import { DeleteButton, ToggleAvailableButton } from './TransportActions';
import PreviewToggle from '@/components/admin/PreviewToggle';

async function getTransports() {
  return prisma.transport.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

const typeLabels: Record<string, string> = {
  car: 'Mobil',
  bus: 'Bus',
  airport: 'Bandara',
  motor: 'Motor',
};

export default async function TransportAdminPage() {
  const transports = await getTransports();

  /* ── Action bar (reused in both views) ── */
  function ActionBar({ t }: { t: typeof transports[0] }) {
    return (
      <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50/50">
        <Link
          href={`/admin/transport/${t.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm"
        >
          <Edit className="w-4 h-4 mr-1" />
          Ubah
        </Link>
        <ToggleAvailableButton id={t.id} available={t.available} />
        <DeleteButton id={t.id} name={t.nameEn} />
      </div>
    );
  }

  /* ── TABLE VIEW ── */
  const tableView = (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-[800px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transports.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img src={t.mainImage} alt={t.nameEn} className="w-16 h-16 rounded object-cover" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{t.nameEn}</div>
                    <div className="text-sm text-gray-500">{t.nameId}</div>
                    {t.driverIncluded && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                        + Sopir
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{typeLabels[t.type] || t.type}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {t.capacity ? `${t.capacity} org` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {t.price ? `Rp ${t.price.toLocaleString('id-ID')}` : '-'}
                {t.priceUnit && <span className="text-gray-500 text-xs ml-1">/{t.priceUnit}</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {t.available ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Eye className="w-3 h-3 mr-1" /> Tersedia
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <EyeOff className="w-3 h-3 mr-1" /> Tidak Tersedia
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link href={`/admin/transport/${t.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4 mr-1" /> Ubah
                </Link>
                <ToggleAvailableButton id={t.id} available={t.available} />
                <DeleteButton id={t.id} name={t.nameEn} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── PREVIEW VIEW (matches public transport page) ── */
  const previewView = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {transports.map((t) => (
        <div
          key={t.id}
          className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${
            !t.available ? 'opacity-60 ring-2 ring-red-200' : ''
          }`}
        >
          {/* Status badge */}
          {!t.available && (
            <div className="bg-red-50 text-red-700 text-xs font-medium text-center py-1">
              Tidak Tersedia (Hidden dari publik)
            </div>
          )}

          {/* Name + Capacity */}
          <div className="px-8 pt-8 pb-2 flex items-center justify-between">
            <h3 className="font-serif text-3xl">{t.nameId || t.nameEn}</h3>
            {t.capacity && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {t.capacity} orang
              </span>
            )}
          </div>

          {/* Image */}
          <div className="relative h-48 mx-8 rounded-lg overflow-hidden">
            <img src={t.mainImage} alt={t.nameEn} className="w-full h-full object-cover" />
          </div>

          {/* Video */}
          {t.videoUrl && (
            <div className="px-8 pt-4">
              <video src={t.videoUrl} controls className="w-full rounded-lg" preload="metadata" />
            </div>
          )}

          {/* Description & Details */}
          <div className="p-8 pt-4">
            <p className="text-gray-600 mb-4">{t.descId || t.descEn}</p>

            {/* Includes */}
            {t.includesId && (
              <div className="mb-4">
                <ul className="space-y-1 text-gray-700">
                  {t.includesId.split(/[,\n]/).filter(Boolean).map((item, i) => (
                    <li key={i}>• {item.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price & Driver */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {t.driverIncluded && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Termasuk Sopir
                  </span>
                )}
              </div>
              {t.price && (
                <span className="text-emerald-600 font-bold text-lg">
                  Rp {t.price.toLocaleString('id-ID')}
                  {t.priceUnit && <span className="text-sm font-normal text-gray-500"> / {t.priceUnit}</span>}
                </span>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <ActionBar t={t} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transportasi</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola layanan transportasi ({transports.length} total)</p>
        </div>
        <Link
          href="/admin/transport/new"
          className="flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Transport
        </Link>
      </div>

      {transports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 md:p-12 text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Belum ada transport.</p>
          <Link
            href="/admin/transport/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Transport Pertama
          </Link>
        </div>
      ) : (
        <PreviewToggle tableView={tableView} previewView={previewView} />
      )}
    </div>
  );
}
