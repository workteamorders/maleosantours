/**
 * Info Travel Admin Page
 * Full CRUD list with Table / Preview toggle
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, ImageIcon, Video } from 'lucide-react';
import { DeleteButton, TogglePublishedButton } from './ActionButtons';
import PreviewToggle from '@/components/admin/PreviewToggle';

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

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

function isLocalVideo(url: string): boolean {
  return url.startsWith('/uploads/') || url.startsWith('/videos/');
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    if (url.includes('youtube.com/embed/')) return url;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  } catch { return url; }
}

export default async function InfoTravelAdminPage() {
  const items = await getInfoTravels();

  /* ── TABLE VIEW ── */
  const tableView = (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konten</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
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
              const images = parseImages(item.images);
              const firstImage = images[0] || null;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {firstImage ? (
                        <img src={firstImage} alt={item.titleEn} className="w-16 h-16 rounded object-cover" />
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
                        <ImageIcon className="w-4 h-4" /> {images.length}
                      </span>
                      {item.videoUrl && (
                        <span className="flex items-center gap-1 text-purple-600">
                          <Video className="w-4 h-4" /> 1
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.published ? 'Diterbitkan' : 'Draf'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <Link href={`/admin/info-travel/${item.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4 mr-1" /> Ubah
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
  );

  /* ── PREVIEW VIEW (matches public info-travel page articles) ── */
  const previewView = (
    <div className="space-y-16">
      {items.map((item) => {
        const images = parseImages(item.images);

        return (
          <article
            key={item.id}
            className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
              !item.published ? 'opacity-60 ring-2 ring-orange-200' : ''
            }`}
          >
            {/* Status badge */}
            {!item.published && (
              <div className="bg-orange-50 text-orange-700 text-xs font-medium text-center py-1">
                Draf (Belum diterbitkan)
              </div>
            )}

            <div className="p-8">
              {/* Title */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-3xl">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.titleId || item.titleEn}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {categoryLabels[item.category] || item.category}
                  </span>
                  {item.featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ★ Unggulan
                    </span>
                  )}
                </div>
              </div>

              {/* Images Grid (matches public page) */}
              {images.length > 0 && (
                <div className={`mb-6 ${
                  images.length === 1
                    ? 'grid grid-cols-1'
                    : images.length === 2
                    ? 'grid grid-cols-2 gap-4'
                    : 'grid grid-cols-2 md:grid-cols-3 gap-4'
                }`}>
                  {images.map((imgUrl, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`relative rounded-lg overflow-hidden ${
                        images.length === 1 ? 'h-80' : 'h-52'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${item.titleEn} ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Video (matches public page) */}
              {item.videoUrl && (
                <div className="mb-6">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                    {isLocalVideo(item.videoUrl) ? (
                      <video
                        src={item.videoUrl}
                        controls
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={getYouTubeEmbedUrl(item.videoUrl) || item.videoUrl}
                        title={item.titleEn}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Text Content (matches public page) */}
              <div className="prose prose-lg max-w-none text-gray-700">
                {(item.descId || item.descEn).split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center justify-end gap-4 px-8 py-3 border-t border-gray-100 bg-gray-50/50">
              <Link href={`/admin/info-travel/${item.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm">
                <Edit className="w-4 h-4 mr-1" /> Ubah
              </Link>
              <TogglePublishedButton id={item.id} published={item.published} />
              <DeleteButton id={item.id} name={item.titleEn} />
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Info Travel</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola informasi travel - gambar, video, dan konten teks ({items.length} total)</p>
        </div>
        <Link
          href="/admin/info-travel/new"
          className="flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Info Travel
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 md:p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Belum ada konten info travel.</p>
          <Link
            href="/admin/info-travel/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Info Travel Pertama
          </Link>
        </div>
      ) : (
        <PreviewToggle tableView={tableView} previewView={previewView} />
      )}
    </div>
  );
}
