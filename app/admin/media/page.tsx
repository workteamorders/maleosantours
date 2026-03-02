/**
 * Media Library - Admin
 * Upload, view, and manage media files
 */

import { prisma } from '@/lib/prisma';
import { ImageIcon } from 'lucide-react';
import MediaGallery from './MediaGallery';

async function getMedia() {
  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function MediaAdminPage() {
  const media = await getMedia();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ImageIcon className="w-8 h-8 mr-3" />
          Pustaka Media
        </h1>
        <p className="text-gray-600 mt-1">Upload dan kelola gambar serta video ({media.length} file)</p>
      </div>

      {/* Client Gallery Component */}
      <div className="bg-white rounded-lg shadow p-6">
        <MediaGallery items={media} />
      </div>
    </div>
  );
}
