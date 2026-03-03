'use client';

import { useState, useTransition } from 'react';
import { Upload, Save, RefreshCw } from 'lucide-react';
import { upsertPageHeader } from './actions';
import toast from 'react-hot-toast';

const PAGE_LABELS: Record<string, string> = {
  'info-travel': 'Info Travel',
  'paket-tour': 'Paket Tour',
  hotels: 'Hotel',
  transport: 'Transportasi',
  testimoni: 'Testimoni',
  kontak: 'Kontak',
};

interface PageHeaderCardProps {
  pageKey: string;
  currentImage: string;
}

function PageHeaderCard({ pageKey, currentImage }: PageHeaderCardProps) {
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Gunakan file gambar (JPG, PNG, WebP)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      setImageUrl(data.url);
      setPreview(data.url);
      toast.success('Gambar berhasil diupload');
    } catch (err: any) {
      toast.error(err.message || 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      await upsertPageHeader(pageKey, imageUrl);
      toast.success(`Header "${PAGE_LABELS[pageKey]}" berhasil disimpan`);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Preview */}
      <div className="relative h-48 bg-gray-100">
        {preview ? (
          <img src={preview} alt={PAGE_LABELS[pageKey]} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Belum ada gambar
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
          <span className="text-white font-serif text-xl font-bold">{PAGE_LABELS[pageKey]}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* URL Input */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            URL Gambar
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Upload button */}
        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg py-2.5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors text-sm text-gray-500">
          {uploading ? (
            <RefreshCw size={16} className="animate-spin text-amber-500" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Mengupload...' : 'Upload Gambar Baru'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={pending || uploading || !imageUrl}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          <Save size={16} />
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}

interface Props {
  headers: { pageKey: string; image: string }[];
}

export default function PageHeadersManager({ headers }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {headers.map((h) => (
        <PageHeaderCard key={h.pageKey} pageKey={h.pageKey} currentImage={h.image} />
      ))}
    </div>
  );
}
