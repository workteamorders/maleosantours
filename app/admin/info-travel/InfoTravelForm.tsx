'use client';

/**
 * Info Travel Form
 * Handles creation and editing with multi-language support
 * Supports: image upload (multiple), video upload (1, max 10MB), text content
 */

import { useState, useRef } from 'react';
import { createInfoTravel, updateInfoTravel } from './actions';
import { Save, Plus, Trash2, ImageIcon, Video, FileText, Upload, Loader2, X, Languages } from 'lucide-react';

interface InfoTravelFormProps {
  infoTravel?: any;
}

async function uploadFile(file: File, type: 'image' | 'video'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Upload gagal');
  }

  return data.url;
}

async function translateText(text: string): Promise<Record<string, string>> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLangs: ['en', 'zh-CN', 'zh-TW'] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjemahan gagal');
  return data.translations;
}

export default function InfoTravelForm({ infoTravel }: InfoTravelFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('id');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);

  // Translated content state (controlled)
  const [titleId, setTitleId] = useState(infoTravel?.titleId || '');
  const [titleEn, setTitleEn] = useState(infoTravel?.titleEn || '');
  const [titleZh, setTitleZh] = useState(infoTravel?.titleZh || '');
  const [titleZhCn, setTitleZhCn] = useState(infoTravel?.titleZhCn || '');

  const [descId, setDescId] = useState(infoTravel?.descId || '');
  const [descEn, setDescEn] = useState(infoTravel?.descEn || '');
  const [descZh, setDescZh] = useState(infoTravel?.descZh || '');
  const [descZhCn, setDescZhCn] = useState(infoTravel?.descZhCn || '');
  const [images, setImages] = useState<string[]>(() => {
    if (infoTravel?.images) {
      try {
        const parsed = JSON.parse(infoTravel.images);
        return parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [videoUrl, setVideoUrl] = useState<string>(infoTravel?.videoUrl || '');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!infoTravel;

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setUploadError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], 'image');
        newUrls.push(url);
      }
      setImages([...images, ...newUrls]);
    } catch (err: any) {
      setUploadError(err.message || 'Upload gambar gagal');
    } finally {
      setUploadingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Video terlalu besar. Maksimal 10MB');
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setUploadingVideo(true);
    setUploadError(null);

    try {
      const url = await uploadFile(file, 'video');
      setVideoUrl(url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload video gagal');
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  }

  function removeVideo() {
    setVideoUrl('');
  }

  async function handleTranslate() {
    if (!titleId.trim() && !descId.trim()) {
      alert('Isi judul dan konten dalam Bahasa Indonesia terlebih dahulu');
      return;
    }

    setTranslating(true);
    setUploadError(null);

    try {
      // Translate title
      if (titleId.trim()) {
        const titleTranslations = await translateText(titleId);
        setTitleEn(titleTranslations['en'] || titleId);
        setTitleZh(titleTranslations['zh-CN'] || titleId);
        setTitleZhCn(titleTranslations['zh-TW'] || titleId);
      }

      // Translate description
      if (descId.trim()) {
        const descTranslations = await translateText(descId);
        setDescEn(descTranslations['en'] || descId);
        setDescZh(descTranslations['zh-CN'] || descId);
        setDescZhCn(descTranslations['zh-TW'] || descId);
      }

      setTranslated(true);
    } catch (err: any) {
      setUploadError('Gagal menerjemahkan: ' + (err.message || 'Kesalahan tidak diketahui'));
    } finally {
      setTranslating(false);
    }
  }

  // Auto translate title on blur if others are empty
  async function handleTitleIdBlur() {
    if (titleId.trim() && !titleEn) {
      try {
        const t = await translateText(titleId);
        setTitleEn(t['en'] || '');
        setTitleZh(t['zh-CN'] || '');
        setTitleZhCn(t['zh-TW'] || '');
      } catch (err) {
        console.error('Auto-translate blur failed:', err);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Remove old image fields and add current ones
    for (let i = 0; i < 20; i++) {
      formData.delete(`image_${i}`);
    }
    images.forEach((url, i) => {
      if (url.trim()) {
        formData.set(`image_${i}`, url.trim());
      }
    });

    // Set video URL
    formData.set('videoUrl', videoUrl);

    // Inject translated values (from controlled state)
    formData.set('titleId', titleId);
    formData.set('titleEn', titleEn);
    formData.set('titleZh', titleZh);
    formData.set('titleZhCn', titleZhCn);

    formData.set('descId', descId);
    formData.set('descEn', descEn);
    formData.set('descZh', descZh);
    formData.set('descZhCn', descZhCn);

    // Auto-translate if not yet translated and Indonesian content exists
    if (!titleEn && titleId.trim()) {
      try {
        const titleTranslations = await translateText(titleId);
        formData.set('titleEn', titleTranslations['en'] || titleId);
        formData.set('titleZh', titleTranslations['zh-CN'] || titleId);
        formData.set('titleZhCn', titleTranslations['zh-TW'] || titleId);
      } catch { /* use fallback from actions */ }
    }
    if (!descEn && descId.trim()) {
      try {
        const descTranslations = await translateText(descId);
        formData.set('descEn', descTranslations['en'] || descId);
        formData.set('descZh', descTranslations['zh-CN'] || descId);
        formData.set('descZhCn', descTranslations['zh-TW'] || descId);
      } catch { /* use fallback from actions */ }
    }

    try {
      if (isEdit) {
        await updateInfoTravel(infoTravel.id, formData);
      } else {
        await createInfoTravel(formData);
      }
    } catch (error: any) {
      // Next.js redirect() throws a special error — let it propagate
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error saving info travel:', error);
      alert('Gagal menyimpan info travel');
      setLoading(false);
    }
  }

  const tabs = [
    { key: 'id', label: '🇮🇩 Indonesia (Utama)' },
    { key: 'en', label: '🇬🇧 English' },
    { key: 'zh', label: '🇨🇳 中文 (简体)' },
    { key: 'zh-cn', label: '🇹🇼 中文 (繁體)' },
  ];

  const categories = [
    { value: 'destination', label: 'Destinasi' },
    { value: 'history', label: 'Sejarah & Budaya' },
    { value: 'transport', label: 'Transportasi' },
    { value: 'food', label: 'Makanan & Kuliner' },
    { value: 'shopping', label: 'Belanja' },
    { value: 'tips', label: 'Tips Perjalanan' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Language Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ===== BASIC SETTINGS ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Pengaturan Dasar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              name="category"
              defaultValue={infoTravel?.category || 'destination'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutan Tampil
            </label>
            <input
              type="number"
              name="order"
              defaultValue={infoTravel?.order || 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ikon (emoji/teks)
            </label>
            <input
              type="text"
              name="icon"
              defaultValue={infoTravel?.icon || ''}
              placeholder="🏖️ or 🍜"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-8 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={infoTravel?.published ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Diterbitkan</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={infoTravel?.featured ?? false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Unggulan</span>
          </label>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm">{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===== IMAGES (Upload) ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar
        </h3>

        {/* Image previews grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 rounded-lg object-cover border border-gray-200"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2212%22>Error</text></svg>'; }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div
          onClick={() => !uploadingImages && imageInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadingImages
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
        >
          {uploadingImages ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm text-blue-600 font-medium">Mengupload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Klik untuk upload gambar
              </span>
              <span className="text-xs text-gray-400">
                JPG, PNG, WebP, GIF — Maks 5MB per file
              </span>
            </div>
          )}
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        <p className="text-xs text-gray-500 mt-2">
          {images.length} gambar ditambahkan. Arahkan kursor ke gambar untuk menghapus.
        </p>
      </div>

      {/* ===== VIDEO (Upload — max 1, max 10MB) ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2" />
          Video
          <span className="ml-2 text-xs font-normal text-gray-500">(Maks 1 video, maks 10MB)</span>
        </h3>

        {videoUrl ? (
          <div className="relative group">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-64 rounded-lg border border-gray-200 bg-black"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-2">Arahkan kursor ke video untuk melihat tombol hapus</p>
          </div>
        ) : (
          <>
            <div
              onClick={() => !uploadingVideo && videoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadingVideo
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                }`}
            >
              {uploadingVideo ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  <span className="text-sm text-purple-600 font-medium">Mengupload video...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Video className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Klik untuk upload video
                  </span>
                  <span className="text-xs text-gray-400">
                    MP4, WebM, OGG — Maks 10MB
                  </span>
                </div>
              )}
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* ===== MULTI-LANGUAGE CONTENT (TEXT) ===== */}

      {/* INDONESIAN — Primary Input */}
      <div className={activeTab === 'id' ? '' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Konten Indonesia (Utama)
          </h3>
          <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            💡 Isi konten dalam Bahasa Indonesia, lalu klik tombol <strong>&quot;Terjemahkan&quot;</strong> untuk auto-translate ke bahasa lain.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul (Indonesia) *
            </label>
            <input
              type="text"
              name="titleId"
              value={titleId}
              onChange={(e) => setTitleId(e.target.value)}
              onBlur={handleTitleIdBlur}
              required
              placeholder="Sejarah & Budaya di Manado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten (Indonesia) *
            </label>
            <textarea
              name="descId"
              value={descId}
              onChange={(e) => setDescId(e.target.value)}
              required
              rows={10}
              placeholder="Tulis konten artikel di sini..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Gunakan baris kosong untuk memisahkan paragraf.
            </p>
          </div>

          {/* Translate Button */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {translating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Menerjemahkan...
              </>
            ) : (
              <>
                <Languages className="w-5 h-5 mr-2" />
                {translated ? 'Terjemahkan Ulang' : 'Terjemahkan ke Bahasa Lain'}
              </>
            )}
          </button>
          {translated && (
            <p className="text-sm text-green-600">
              ✅ Terjemahan berhasil! Cek tab lain untuk melihat &amp; mengedit hasil terjemahan.
            </p>
          )}
        </div>
      </div>

      {/* ENGLISH — Auto-translated, editable */}
      <div className={activeTab === 'en' ? '' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Konten English
            <span className="ml-2 text-xs font-normal text-gray-500">(Terjemahan otomatis, bisa diedit)</span>
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              name="titleEn"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Otomatis dari terjemahan — atau ketik manual"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten (English)
            </label>
            <textarea
              name="descEn"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              rows={10}
              placeholder="Otomatis dari terjemahan — atau ketik manual"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* CHINESE SIMPLIFIED — Auto-translated, editable */}
      <div className={activeTab === 'zh' ? '' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            中文简体内容
            <span className="ml-2 text-xs font-normal text-gray-500">(Terjemahan otomatis, bisa diedit)</span>
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 (简体中文)
            </label>
            <input
              type="text"
              name="titleZh"
              value={titleZh}
              onChange={(e) => setTitleZh(e.target.value)}
              placeholder="Otomatis dari terjemahan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 (简体中文)
            </label>
            <textarea
              name="descZh"
              value={descZh}
              onChange={(e) => setDescZh(e.target.value)}
              rows={10}
              placeholder="Otomatis dari terjemahan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* CHINESE TRADITIONAL — Auto-translated, editable */}
      <div className={activeTab === 'zh-cn' ? '' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            中文繁體內容
            <span className="ml-2 text-xs font-normal text-gray-500">(Terjemahan otomatis, bisa diedit)</span>
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              標題 (繁體中文)
            </label>
            <input
              type="text"
              name="titleZhCn"
              value={titleZhCn}
              onChange={(e) => setTitleZhCn(e.target.value)}
              placeholder="Otomatis dari terjemahan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              內容 (繁體中文)
            </label>
            <textarea
              name="descZhCn"
              value={descZhCn}
              onChange={(e) => setDescZhCn(e.target.value)}
              rows={10}
              placeholder="Otomatis dari terjemahan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* ===== SEO ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO (Opsional)</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (English)
            </label>
            <input
              type="text"
              name="metaTitleEn"
              defaultValue={infoTravel?.metaTitleEn || ''}
              placeholder="Judul SEO untuk mesin pencari"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (English)
            </label>
            <textarea
              name="metaDescEn"
              defaultValue={infoTravel?.metaDescEn || ''}
              rows={2}
              placeholder="Deskripsi SEO (disarankan 150-160 karakter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading || translating}
          className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Menyimpan...' : isEdit ? 'Update Info Travel' : 'Simpan Info Travel'}
        </button>
      </div>
    </form>
  );
}
