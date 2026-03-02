'use client';

/**
 * Media Library Client Component
 * Handles upload, display, and deletion of media files
 */

import { useState, useRef } from 'react';
import { createMedia, deleteMedia } from './actions';
import { Upload, Trash2, Image as ImageIcon, Video, File, Loader2, X, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  mimeType: string;
  alt: string | null;
  caption: string | null;
  createdAt: Date;
}

interface MediaGalleryProps {
  items: MediaItem[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaGallery({ items }: MediaGalleryProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = filter === 'all' ? items : items.filter((m) => m.type === filter);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
          setUploadError(`File "${file.name}" bukan gambar atau video`);
          continue;
        }

        if (isVideo && file.size > 10 * 1024 * 1024) {
          setUploadError(`Video "${file.name}" terlalu besar (maks 10MB)`);
          continue;
        }

        // Upload to /api/upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', isVideo ? 'video' : 'image');

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) {
          setUploadError(data.error || `Gagal upload "${file.name}"`);
          continue;
        }

        // Save to database
        await createMedia({
          filename: file.name,
          url: data.url,
          type: isVideo ? 'video' : 'image',
          size: file.size,
          mimeType: file.type,
        });
      }

      router.refresh();
    } catch (err: any) {
      setUploadError(err.message || 'Upload gagal');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!confirm(`Hapus "${filename}"?`)) return;

    setDeleting(id);
    try {
      await deleteMedia(id);
      router.refresh();
    } catch (err: any) {
      setUploadError(err.message || 'Gagal menghapus');
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          uploading
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            <p className="text-blue-600 font-medium">Mengupload file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">Klik untuk upload gambar atau video</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP, MP4, WebM (video maks 10MB)</p>
            <p className="text-xs text-gray-400 mt-1">Bisa pilih beberapa file sekaligus</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Error */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm">{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Filter:</span>
        {(['all', 'image', 'video'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'image' ? 'Gambar' : 'Video'} 
            ({f === 'all' ? items.length : items.filter((m) => m.type === f).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada media. Upload file untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
              {/* Preview */}
              <div className="relative aspect-square bg-gray-100">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Video className="w-12 h-12 text-white/60" />
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                    title="Salin URL"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-700" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.filename)}
                    disabled={deleting === item.id}
                    className="p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Hapus"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>

                {/* Type badge */}
                <div className="absolute top-1 left-1">
                  {item.type === 'image' ? (
                    <span className="bg-blue-500/80 text-white text-xs px-1.5 py-0.5 rounded">IMG</span>
                  ) : (
                    <span className="bg-purple-500/80 text-white text-xs px-1.5 py-0.5 rounded">VID</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-gray-700 font-medium truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
