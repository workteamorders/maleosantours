/**
 * Info Travel Admin Page
 * Full CRUD list with images, video, and text content management
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, ImageIcon, Video } from 'lucide-react';
import { DeleteButton, TogglePublishedButton } from './ActionButtons';

const categoryLabels: Record<string, string> = {
  destination: 'Destinasi',
  history: 'Sejarah & Budaya',
  transport: 'Transportasi',
  food: 'Makanan & Kuliner',
  shopping: 'Belanja',
  tips: 'Tips Perjalanan',
};

async function getInfoTravels() {
  return prisma.infoTravel.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export default async function InfoTravelAdminPage() {
  const items = await getInfoTravels();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Info Travel</h1>
          <p className="text-gray-600 mt-1">Kelola informasi travel - gambar, video, dan konten teks</p>
        </div>
        <Link
          href="/admin/info-travel/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Info Travel
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konten
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Media
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
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Belum ada konten info travel. Klik &quot;Tambah Info Travel&quot; untuk membuat.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const imageCount = (() => {
                  try { return JSON.parse(item.images).length; } catch { return 0; }
                })();
                const firstImage = (() => {
                  try { return JSON.parse(item.images)[0]; } catch { return null; }
                })();

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={item.titleEn}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            {item.titleEn}
                          </div>
                          <div className="text-sm text-gray-500">{item.titleId}</div>
                          {item.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Unggulan
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          {imageCount}
                        </span>
                        {item.videoUrl && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <Video className="w-4 h-4" />
                            1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.published ? 'Diterbitkan' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-4">
                        <Link
                          href={`/admin/info-travel/${item.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Ubah
                        </Link>
                        <TogglePublishedButton id={item.id} published={item.published} />
                        <DeleteButton id={item.id} name={item.titleEn} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
