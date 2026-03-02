'use client';

/**
 * Hotel Form
 * Handles creation and editing with multi-language support
 * Supports: image upload, video upload, auto-translate, facilities
 */

import { useState, useRef } from 'react';
import { createHotel, updateHotel } from './actions';
import { Save, ImageIcon, Video, X, Upload, Loader2, Languages, Plus } from 'lucide-react';

interface HotelFormProps {
  hotel?: any;
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

export default function HotelAdminForm({ hotel }: HotelFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('id');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const isEdit = !!hotel;

  // Translated content state
  const [nameId, setNameId] = useState(hotel?.nameId || '');
  const [nameEn, setNameEn] = useState(hotel?.nameEn || '');
  const [nameZh, setNameZh] = useState(hotel?.nameZh || '');
  const [nameZhCn, setNameZhCn] = useState(hotel?.nameZhCn || '');

  const [descId, setDescId] = useState(hotel?.descId || '');
  const [descEn, setDescEn] = useState(hotel?.descEn || '');
  const [descZh, setDescZh] = useState(hotel?.descZh || '');
  const [descZhCn, setDescZhCn] = useState(hotel?.descZhCn || '');

  // Image & video state
  const [mainImage, setMainImage] = useState<string>(hotel?.mainImage || '');
  const [images, setImages] = useState<string[]>(() => {
    if (hotel?.images) {
      try {
        const parsed = JSON.parse(hotel.images);
        return parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [videoUrl, setVideoUrl] = useState<string>(hotel?.videoUrl || '');
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Facilities state
  const [facilities, setFacilities] = useState<string[]>(() => {
    if (hotel?.facilities) {
      try {
        return JSON.parse(hotel.facilities);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newFacility, setNewFacility] = useState('');

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function addFacility() {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  }

  function removeFacility(index: number) {
    setFacilities(facilities.filter((_, i) => i !== index));
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
        const t = await translateText(nameId);
        setNameEn(t['en'] || nameId);
        setNameZh(t['zh-CN'] || nameId);
        setNameZhCn(t['zh-TW'] || nameId);
      }
      if (descId.trim()) {
        const t = await translateText(descId);
        setDescEn(t['en'] || descId);
        setDescZh(t['zh-CN'] || descId);
        setDescZhCn(t['zh-TW'] || descId);
      }
    } catch (err: any) {
      setUploadError('Gagal menerjemahkan: ' + (err.message || ''));
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
    images.forEach((url, i) => formData.set(`image_${i}`, url.trim()));

    // Set facilities
    formData.set('facilities', JSON.stringify(facilities));

    // Set translated content
    formData.set('nameId', nameId);
    formData.set('nameEn', nameEn);
    formData.set('nameZh', nameZh);
    formData.set('nameZhCn', nameZhCn);
    formData.set('descId', descId);
    formData.set('descEn', descEn);
    formData.set('descZh', descZh);
    formData.set('descZhCn', descZhCn);

    // Auto-translate if not yet translated
    if (!nameEn && nameId.trim()) {
      try {
        const t = await translateText(nameId);
        formData.set('nameEn', t['en'] || nameId);
        formData.set('nameZh', t['zh-CN'] || nameId);
        formData.set('nameZhCn', t['zh-TW'] || nameId);
      } catch { }
    }
    if (!descEn && descId.trim()) {
      try {
        const t = await translateText(descId);
        formData.set('descEn', t['en'] || descId);
        formData.set('descZh', t['zh-CN'] || descId);
        formData.set('descZhCn', t['zh-TW'] || descId);
      } catch { }
    }

    try {
      if (isEdit) {
        await updateHotel(hotel.id, formData);
      } else {
        await createHotel(formData);
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
      console.error('Error saving hotel:', error);
      alert('Gagal menyimpan hotel');
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
    { value: 'luxury', label: 'Luxury (Mewah)' },
    { value: 'boutique', label: 'Boutique' },
    { value: 'beach', label: 'Beach Resort' },
    { value: 'budget', label: 'Budget (Ekonomis)' },
    { value: 'family', label: 'Family' },
    { value: 'business', label: 'Business' },
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Hotel *</label>
          <select
            name="category"
            defaultValue={hotel?.category || 'luxury'}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bintang *</label>
          <select
            name="stars"
            defaultValue={hotel?.stars || 5}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>{'⭐'.repeat(s)} ({s} Bintang)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi *</label>
          <input
            type="text"
            name="location"
            defaultValue={hotel?.location || ''}
            required
            placeholder="Manado, Sulawesi Utara"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kisaran Harga <span className="text-gray-400">(opsional)</span>
          </label>
          <select
            name="priceRange"
            defaultValue={hotel?.priceRange || ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tidak ditampilkan</option>
            <option value="$">$ (Budget)</option>
            <option value="$$">$$ (Menengah)</option>
            <option value="$$$">$$$ (Premium)</option>
            <option value="$$$$">$$$$ (Mewah)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Booking <span className="text-gray-400">(opsional)</span>
          </label>
          <input
            type="url"
            name="bookingUrl"
            defaultValue={hotel?.bookingUrl || ''}
            placeholder="https://booking.com/hotel/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
          <input
            type="number"
            name="order"
            defaultValue={hotel?.order || 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fasilitas</h3>
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {facilities.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {f}
                <button type="button" onClick={() => removeFacility(i)} className="text-blue-600 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFacility(); } }}
            placeholder="WiFi, Kolam Renang, Gym, Restoran..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addFacility}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Tekan Enter atau klik Tambah untuk menambahkan fasilitas</p>
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

      {/* ===== MAIN IMAGE ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar Utama *
        </h3>
        {mainImage ? (
          <div className="relative inline-block group">
            <img src={mainImage} alt="Main" className="w-64 h-48 rounded-lg object-cover border border-gray-200" />
            <button type="button" onClick={() => setMainImage('')}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div onClick={() => !uploadingMain && mainImageInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${uploadingMain ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}>
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
        <input ref={mainImageInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
      </div>

      {/* ===== ADDITIONAL IMAGES ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar Tambahan
        </h3>
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 rounded-lg object-cover border border-gray-200" />
                <button type="button" onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</span>
              </div>
            ))}
          </div>
        )}
        <div onClick={() => !uploadingImages && imagesInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadingImages ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}>
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
        <input ref={imagesInputRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
      </div>

      {/* ===== VIDEO ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2" />
          Video <span className="text-gray-400 text-sm ml-2">(opsional, maks 10MB)</span>
        </h3>
        {videoUrl ? (
          <div className="relative inline-block">
            <video src={videoUrl} controls className="w-80 rounded-lg border border-gray-200" preload="metadata" />
            <button type="button" onClick={removeVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-sm hover:bg-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div onClick={() => !uploadingVideo && videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${uploadingVideo ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}>
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
        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
      </div>

      {/* Multi-language Content */}
      {activeTab === 'id' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">🇮🇩 Konten Indonesia (Utama)</h3>
            <button type="button" onClick={handleTranslate} disabled={translating}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm">
              {translating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
              {translating ? 'Menerjemahkan...' : 'Terjemahkan Otomatis'}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Hotel (Indonesia) *</label>
            <input type="text" name="nameId" value={nameId} onChange={(e) => setNameId(e.target.value)} onBlur={handleNameIdBlur} required
              placeholder="Hotel Manado Bay"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi (Indonesia) *</label>
            <textarea name="descId" value={descId} onChange={(e) => setDescId(e.target.value)} required rows={6}
              placeholder="Hotel mewah dengan pemandangan laut yang menakjubkan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'en' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇬🇧 English Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name (English) *</label>
            <input type="text" name="nameEn" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required
              placeholder="Manado Bay Hotel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) *</label>
            <textarea name="descEn" value={descEn} onChange={(e) => setDescEn(e.target.value)} required rows={6}
              placeholder="Luxury hotel with stunning ocean views..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'zh' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇨🇳 中文内容 (简体)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">酒店名称 (中文简体) *</label>
            <input type="text" name="nameZh" value={nameZh} onChange={(e) => setNameZh(e.target.value)} required
              placeholder="美娜多湾酒店"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述 (中文简体) *</label>
            <textarea name="descZh" value={descZh} onChange={(e) => setDescZh(e.target.value)} required rows={6}
              placeholder="豪华酒店，拥有壮丽的海景..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'zh-cn' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇹🇼 中文內容 (繁體)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">酒店名稱 (中文繁體) *</label>
            <input type="text" name="nameZhCn" value={nameZhCn} onChange={(e) => setNameZhCn(e.target.value)} required
              placeholder="美娜多灣酒店"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述 (中文繁體) *</label>
            <textarea name="descZhCn" value={descZhCn} onChange={(e) => setDescZhCn(e.target.value)} required rows={6}
              placeholder="豪華酒店，擁有壯麗的海景..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Opsi</h3>
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input type="checkbox" name="active" defaultChecked={hotel?.active ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Aktif (tampil di website)</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="featured" defaultChecked={hotel?.featured ?? false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Unggulan (featured)</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 border-t pt-6">
        <button type="submit" disabled={loading}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Menyimpan...' : isEdit ? 'Perbarui Hotel' : 'Buat Hotel'}
        </button>
      </div>
    </form>
  );
}
