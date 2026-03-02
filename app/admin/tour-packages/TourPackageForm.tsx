'use client';

/**
 * Tour Package Form
 * Handles both creation and editing with multi-language support
 * Supports: image upload (multiple), video upload (1, max 10MB), auto-translate
 */

import { useState, useRef } from 'react';
import { createTourPackage, updateTourPackage } from './actions';
import { Save, ImageIcon, Video, X, Upload, Loader2, Languages, Plus, Trash2 } from 'lucide-react';

interface TourPackageFormProps {
  tourPackage?: any;
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

export default function TourPackageForm({ tourPackage }: TourPackageFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('id');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const isEdit = !!tourPackage;

  // Translated content state (controlled)
  const [nameId, setNameId] = useState(tourPackage?.nameId || '');
  const [nameEn, setNameEn] = useState(tourPackage?.nameEn || '');
  const [nameZh, setNameZh] = useState(tourPackage?.nameZh || '');
  const [nameZhCn, setNameZhCn] = useState(tourPackage?.nameZhCn || '');

  const [descId, setDescId] = useState(tourPackage?.descId || '');
  const [descEn, setDescEn] = useState(tourPackage?.descEn || '');
  const [descZh, setDescZh] = useState(tourPackage?.descZh || '');
  const [descZhCn, setDescZhCn] = useState(tourPackage?.descZhCn || '');

  // Image & video state
  const [mainImage, setMainImage] = useState<string>(tourPackage?.mainImage || '');
  const [images, setImages] = useState<string[]>(() => {
    if (tourPackage?.images) {
      try {
        const parsed = JSON.parse(tourPackage.images);
        return parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [videoUrl, setVideoUrl] = useState<string>(tourPackage?.videoUrl || '');
  const [uploadingMain, setUploadingMain] = useState(false);

  // Itinerary state
  const [itinerary, setItinerary] = useState<{ time: string; activity: string }[]>(() => {
    if (tourPackage?.itineraryId) {
      try { return JSON.parse(tourPackage.itineraryId); } catch { return []; }
    }
    return [];
  });

  // Price tiers state
  const [priceTiers, setPriceTiers] = useState<{ label: string; price: string }[]>(() => {
    if (tourPackage?.priceTiers) {
      try { return JSON.parse(tourPackage.priceTiers); } catch { return []; }
    }
    return [];
  });

  // Inclusions / Exclusions state
  const [inclusions, setInclusions] = useState<string[]>(() => {
    if (tourPackage?.includedId) {
      try { return JSON.parse(tourPackage.includedId); } catch { return []; }
    }
    return [];
  });
  const [exclusions, setExclusions] = useState<string[]>(() => {
    if (tourPackage?.excludedId) {
      try { return JSON.parse(tourPackage.excludedId); } catch { return []; }
    }
    return [];
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    setUploadError(null);

    try {
      const url = await uploadFile(file, 'image');
      setMainImage(url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload gambar utama gagal');
    } finally {
      setUploadingMain(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    }
  }

  async function handleImagesUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      if (imagesInputRef.current) imagesInputRef.current.value = '';
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);
    const nameId = (formData.get('nameId') as string) || '';
    const descId = (formData.get('descId') as string) || '';

    if (!nameId.trim() && !descId.trim()) {
      alert('Isi nama dan deskripsi dalam Bahasa Indonesia terlebih dahulu');
      return;
    }

    setTranslating(true);
    setUploadError(null);

    try {
      if (nameId.trim()) {
        const titleTranslations = await translateText(nameId);
        setNameEn(titleTranslations['en'] || nameId);
        setNameZh(titleTranslations['zh-CN'] || nameId);
        setNameZhCn(titleTranslations['zh-TW'] || nameId);
      }

      if (descId.trim()) {
        const descTranslations = await translateText(descId);
        setDescEn(descTranslations['en'] || descId);
        setDescZh(descTranslations['zh-CN'] || descId);
        setDescZhCn(descTranslations['zh-TW'] || descId);
      }
    } catch (err: any) {
      setUploadError('Gagal menerjemahkan: ' + (err.message || 'Kesalahan tidak diketahui'));
    } finally {
      setTranslating(false);
    }
  }

  // Auto translate title on blur if others are empty
  async function handleNameIdBlur() {
    if (nameId.trim() && !nameEn) {
      try {
        const t = await translateText(nameId);
        setNameEn(t['en'] || '');
        setNameZh(t['zh-CN'] || '');
        setNameZhCn(t['zh-TW'] || '');
      } catch (err) {
        console.error('Auto-translate blur failed:', err);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Set image/video from state
    formData.set('mainImage', mainImage);
    formData.set('videoUrl', videoUrl);

    // Set images array
    images.forEach((url, i) => {
      formData.set(`image_${i}`, url.trim());
    });

    // Set translated content
    formData.set('nameId', nameId);
    formData.set('nameEn', nameEn);
    formData.set('nameZh', nameZh);
    formData.set('nameZhCn', nameZhCn);

    formData.set('descId', descId);
    formData.set('descEn', descEn);
    formData.set('descZh', descZh);
    formData.set('descZhCn', descZhCn);

    // Set itinerary, pricing, inclusions, exclusions as JSON
    formData.set('itineraryId', JSON.stringify(itinerary.filter(it => it.time || it.activity)));
    formData.set('priceTiers', JSON.stringify(priceTiers.filter(pt => pt.label || pt.price)));
    formData.set('includedId', JSON.stringify(inclusions.filter(Boolean)));
    formData.set('excludedId', JSON.stringify(exclusions.filter(Boolean)));

    // Auto-translate if not yet translated
    if (!nameEn && nameId.trim()) {
      try {
        const titleTranslations = await translateText(nameId);
        formData.set('nameEn', titleTranslations['en'] || nameId);
        formData.set('nameZh', titleTranslations['zh-CN'] || nameId);
        formData.set('nameZhCn', titleTranslations['zh-TW'] || nameId);
      } catch { /* fallback */ }
    }
    if (!descEn && descId.trim()) {
      try {
        const descTranslations = await translateText(descId);
        formData.set('descEn', descTranslations['en'] || descId);
        formData.set('descZh', descTranslations['zh-CN'] || descId);
        formData.set('descZhCn', descTranslations['zh-TW'] || descId);
      } catch { /* fallback */ }
    }

    try {
      if (isEdit) {
        await updateTourPackage(tourPackage.id, formData);
      } else {
        await createTourPackage(formData);
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error saving tour package:', error);
      alert('Gagal menyimpan paket tur');
      setLoading(false);
    }
  }

  const tabs = [
    { key: 'id', label: '🇮🇩 Indonesia (Utama)' },
    { key: 'en', label: '🇬🇧 English' },
    { key: 'zh', label: '🇨🇳 中文 (简体)' },
    { key: 'zh-cn', label: '🇹🇼 中文 (繁體)' },
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

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe
          </label>
          <select
            name="type"
            defaultValue={tourPackage?.type || 'day-tour'}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day-tour">Tur Harian</option>
            <option value="multi-day">Tur Multi-Hari</option>
            <option value="custom">Tur Kustom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durasi
          </label>
          <input
            type="text"
            name="duration"
            defaultValue={tourPackage?.duration || ''}
            required
            placeholder="cth: 1 Hari, 3H2M"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga (IDR / Rupiah) <span className="text-gray-400">(opsional)</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={tourPackage?.price || ''}
            placeholder="99.99"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Satuan Harga
          </label>
          <input
            type="text"
            name="priceUnit"
            defaultValue={tourPackage?.priceUnit || 'per orang'}
            placeholder="per orang"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

      {/* ===== MAIN IMAGE (Upload) ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar Utama *
        </h3>

        {mainImage ? (
          <div className="relative inline-block group">
            <img
              src={mainImage}
              alt="Main image"
              className="w-64 h-48 rounded-lg object-cover border border-gray-200"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2212%22>Error</text></svg>'; }}
            />
            <button
              type="button"
              onClick={() => setMainImage('')}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !uploadingMain && mainImageInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${uploadingMain
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
          >
            {uploadingMain ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-blue-600">Mengupload...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Klik untuk upload gambar utama</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
              </div>
            )}
          </div>
        )}

        <input
          ref={mainImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleMainImageUpload}
          className="hidden"
        />
      </div>

      {/* ===== ADDITIONAL IMAGES (Upload) ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar Tambahan
        </h3>

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

        <div
          onClick={() => !uploadingImages && imagesInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadingImages
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
        >
          {uploadingImages ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-blue-600">Mengupload gambar...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Klik untuk upload gambar tambahan</p>
              <p className="text-xs text-gray-400 mt-1">Bisa pilih beberapa file sekaligus</p>
            </div>
          )}
        </div>

        <input
          ref={imagesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesUpload}
          className="hidden"
        />
      </div>

      {/* ===== VIDEO (Upload) ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2" />
          Video <span className="text-gray-400 text-sm ml-2">(opsional, maks 10MB)</span>
        </h3>

        {videoUrl ? (
          <div className="relative inline-block">
            <video
              src={videoUrl}
              controls
              className="w-80 rounded-lg border border-gray-200"
              preload="metadata"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-sm hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !uploadingVideo && videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${uploadingVideo
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
          >
            {uploadingVideo ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-blue-600">Mengupload video...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Klik untuk upload video</p>
                <p className="text-xs text-gray-400 mt-1">MP4, WebM (maks 10MB)</p>
              </div>
            )}
          </div>
        )}

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>

      {/* ===== ITINERARY ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🗓️ Itinerary / Jadwal Perjalanan
        </h3>
        <div className="space-y-3">
          {itinerary.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={item.time}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[i] = { ...updated[i], time: e.target.value };
                  setItinerary(updated);
                }}
                placeholder="08:00"
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={item.activity}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[i] = { ...updated[i], activity: e.target.value };
                  setItinerary(updated);
                }}
                placeholder="Aktivitas / kegiatan..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setItinerary(itinerary.filter((_, idx) => idx !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItinerary([...itinerary, { time: '', activity: '' }])}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Jadwal
          </button>
        </div>
      </div>

      {/* ===== PRICE TIERS ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          💰 Tier Harga (berdasarkan jumlah pax)
        </h3>
        <div className="space-y-3">
          {priceTiers.map((tier, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={tier.label}
                onChange={(e) => {
                  const updated = [...priceTiers];
                  updated[i] = { ...updated[i], label: e.target.value };
                  setPriceTiers(updated);
                }}
                placeholder="cth: 2 Pax, 3-5 Pax"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={tier.price}
                onChange={(e) => {
                  const updated = [...priceTiers];
                  updated[i] = { ...updated[i], price: e.target.value };
                  setPriceTiers(updated);
                }}
                placeholder="cth: IDR 1.500.000 / pax"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setPriceTiers(priceTiers.filter((_, idx) => idx !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPriceTiers([...priceTiers, { label: '', price: '' }])}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Tier Harga
          </button>
        </div>
      </div>

      {/* ===== INCLUSIONS ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          ✅ Termasuk (Inclusions)
        </h3>
        <div className="space-y-3">
          {inclusions.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...inclusions];
                  updated[i] = e.target.value;
                  setInclusions(updated);
                }}
                placeholder="cth: Makan siang, Tiket masuk..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setInclusions([...inclusions, ''])}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Item
          </button>
        </div>
      </div>

      {/* ===== EXCLUSIONS ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          ❌ Tidak Termasuk (Exclusions)
        </h3>
        <div className="space-y-3">
          {exclusions.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...exclusions];
                  updated[i] = e.target.value;
                  setExclusions(updated);
                }}
                placeholder="cth: Tiket pesawat, Asuransi..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExclusions([...exclusions, ''])}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Item
          </button>
        </div>
      </div>

      {/* Multi-language Content */}
      {activeTab === 'id' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">🇮🇩 Konten Indonesia (Utama)</h3>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translating}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm"
            >
              {translating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Languages className="w-4 h-4 mr-2" />
              )}
              {translating ? 'Menerjemahkan...' : 'Terjemahkan Otomatis'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Paket (Indonesia) *
            </label>
            <input
              type="text"
              name="nameId"
              value={nameId}
              onChange={(e) => setNameId(e.target.value)}
              onBlur={handleNameIdBlur}
              required
              placeholder="Tur Snorkeling Bunaken"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi (Indonesia) *
            </label>
            <textarea
              name="descId"
              value={descId}
              onChange={(e) => setDescId(e.target.value)}
              required
              rows={6}
              placeholder="Nikmati keindahan bawah laut Bunaken..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'en' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇬🇧 English Content</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name (English) *
            </label>
            <input
              type="text"
              name="nameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
              placeholder="Bunaken Snorkeling Tour"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English) *
            </label>
            <textarea
              name="descEn"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              required
              rows={6}
              placeholder="Enjoy the underwater beauty of Bunaken..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'zh' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇨🇳 中文内容 (简体)</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              套餐名称 (中文简体) *
            </label>
            <input
              type="text"
              name="nameZh"
              value={nameZh}
              onChange={(e) => setNameZh(e.target.value)}
              required
              placeholder="布纳肯浮潜之旅"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述 (中文简体) *
            </label>
            <textarea
              name="descZh"
              value={descZh}
              onChange={(e) => setDescZh(e.target.value)}
              required
              rows={6}
              placeholder="享受布纳肯海底美景..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'zh-cn' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇹🇼 中文內容 (繁體)</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              套餐名稱 (中文繁體) *
            </label>
            <input
              type="text"
              name="nameZhCn"
              value={nameZhCn}
              onChange={(e) => setNameZhCn(e.target.value)}
              required
              placeholder="布納肯浮潛之旅"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述 (中文繁體) *
            </label>
            <textarea
              name="descZhCn"
              value={descZhCn}
              onChange={(e) => setDescZhCn(e.target.value)}
              required
              rows={6}
              placeholder="享受布納肯海底美景..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Opsi Penerbitan</h3>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="active"
              defaultChecked={tourPackage?.active ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Aktif (tampil di website)</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={tourPackage?.featured ?? false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Unggulan</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 border-t pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Menyimpan...' : isEdit ? 'Perbarui Paket' : 'Buat Paket'}
        </button>
      </div>
    </form>
  );
}
