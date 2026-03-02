/**
 * Testimonials Admin Page
 * Lists all testimonials with Table / Preview toggle
 */

import Link from 'next/link';
import { Plus, Star, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { deleteTestimonial, toggleTestimonialApproved } from './actions';
import PreviewToggle from '@/components/admin/PreviewToggle';

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { tourPackage: { select: { nameEn: true } } },
  });

  /* ── TABLE VIEW ── */
  const tableView = (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-[800px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ulasan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket Tour</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {testimonials.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {t.photo ? (
                    <img src={t.photo} alt={t.customerName} className="w-10 h-10 rounded-full object-cover mr-3" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-500 font-semibold text-sm">{t.customerName.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.customerName}</div>
                    <div className="text-sm text-gray-500">{t.country}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">{t.reviewId}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{t.tourPackage?.nameEn || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <form action={async () => { 'use server'; await toggleTestimonialApproved(t.id, !t.approved); }}>
                    <button
                      type="submit"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.approved
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {t.approved ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" /> Pending</>
                      )}
                    </button>
                  </form>
                  {t.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Unggulan
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <form action={async () => { 'use server'; await deleteTestimonial(t.id); }}>
                    <button
                      type="submit"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── PREVIEW VIEW (matches public testimoni page) ── */
  const previewView = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white ${
            !t.approved ? 'opacity-60 ring-2 ring-orange-200' : ''
          }`}
        >
          {/* Status badge */}
          {!t.approved && (
            <div className="bg-orange-50 text-orange-700 text-xs font-medium text-center py-1">
              Pending (Belum disetujui)
            </div>
          )}

          {/* Photo banner */}
          {t.photo && (
            <div className="relative h-48">
              <img src={t.photo} alt={t.customerName} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content (matches public layout) */}
          <div className="p-6">
            {/* Customer info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-500 font-semibold">{t.customerName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold">{t.customerName}</h3>
                <p className="text-sm text-gray-500">{t.country}</p>
              </div>
            </div>

            {/* Review */}
            <p className="text-gray-600 italic">&ldquo;{t.reviewId}&rdquo;</p>

            {/* Rating */}
            <div className="mt-4 text-yellow-500">
              {'⭐'.repeat(t.rating)}
            </div>

            {/* Tour Package */}
            {t.tourPackage?.nameEn && (
              <p className="mt-2 text-xs text-gray-400">Paket: {t.tourPackage.nameEn}</p>
            )}

            {/* Badges */}
            <div className="flex items-center gap-2 mt-3">
              {t.featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ★ Unggulan
                </span>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <form action={async () => { 'use server'; await toggleTestimonialApproved(t.id, !t.approved); }}>
              <button
                type="submit"
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  t.approved
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                }`}
              >
                {t.approved ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" /> Setujui</>
                )}
              </button>
            </form>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/testimonials/${t.id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <form action={async () => { 'use server'; await deleteTestimonial(t.id); }}>
                <button
                  type="submit"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Testimoni</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola ulasan dan penilaian pelanggan ({testimonials.length} total)</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Testimoni
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 md:p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Belum ada testimoni.</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Testimoni Pertama
          </Link>
        </div>
      ) : (
        <PreviewToggle tableView={tableView} previewView={previewView} />
      )}
    </div>
  );
}
