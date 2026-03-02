'use client';

/**
 * Transport Form
 * Handles creation and editing with multi-language support
 * Supports: image upload, video upload, auto-translate
 */

import { useState, useRef } from 'react';
import { createTransport, updateTransport } from './actions';
import { Save, ImageIcon, Video, X, Upload, Loader2, Languages } from 'lucide-react';

interface TransportFormProps {
  transport?: any;
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

export default function TransportForm({ transport }: TransportFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('id');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const isEdit = !!transport;

  // Translated content state
  const [nameId, setNameId] = useState(transport?.nameId || '');
  const [nameEn, setNameEn] = useState(transport?.nameEn || '');
  const [nameZh, setNameZh] = useState(transport?.nameZh || '');
  const [nameZhCn, setNameZhCn] = useState(transport?.nameZhCn || '');

  const [descId, setDescId] = useState(transport?.descId || '');
  const [descEn, setDescEn] = useState(transport?.descEn || '');
  const [descZh, setDescZh] = useState(transport?.descZh || '');
  const [descZhCn, setDescZhCn] = useState(transport?.descZhCn || '');

  const [includesId, setIncludesId] = useState(transport?.includesId || '');
  const [includesEn, setIncludesEn] = useState(transport?.includesEn || '');

  // Image & video state
  const [mainImage, setMainImage] = useState<string>(transport?.mainImage || '');
  const [images, setImages] = useState<string[]>(() => {
    if (transport?.images) {
      try {
        const parsed = JSON.parse(transport.images);
        return parsed.length > 0 ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [videoUrl, setVideoUrl] = useState<string>(transport?.videoUrl || '');
  const [uploadingMain, setUploadingMain] = useState(false);
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
      if (includesId.trim()) {
        const t = await translateText(includesId);
        setIncludesEn(t['en'] || includesId);
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

    // Set translated content
    formData.set('nameId', nameId);
    formData.set('nameEn', nameEn);
    formData.set('nameZh', nameZh);
    formData.set('nameZhCn', nameZhCn);

    formData.set('descId', descId);
    formData.set('descEn', descEn);
    formData.set('descZh', descZh);
    formData.set('descZhCn', descZhCn);

    formData.set('includesId', includesId);
    formData.set('includesEn', includesEn);

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
        await updateTransport(transport.id, formData);
      } else {
        await createTransport(formData);
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
      console.error('Error saving transport:', error);
      alert('Gagal menyimpan transport');
      setLoading(false);
    }
  }

  const tabs = [
    { key: 'id', label: '🇮🇩 Indonesia (Utama)' },
    { key: 'en', label: '🇬🇧 English' },
    { key: 'zh', label: '🇨🇳 中文 (简体)' },
    { key: 'zh-cn', label: '🇹🇼 中文 (繁體)' },
  ];

  const transportTypes = [
    { value: 'car', label: 'Mobil' },
    { value: 'bus', label: 'Bus' },
    { value: 'airport', label: 'Antar-Jemput Bandara' },
    { value: 'motor', label: 'Motor' },
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kendaraan *</label>
          <select
            name="type"
            defaultValue={transport?.type || 'car'}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {transportTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kapasitas <span className="text-gray-400">(opsional)</span>
          </label>
          <input
            type="number"
            name="capacity"
            defaultValue={transport?.capacity || ''}
            placeholder="4"
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
            defaultValue={transport?.price || ''}
            placeholder="50.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Satuan Harga</label>
          <input
            type="text"
            name="priceUnit"
            defaultValue={transport?.priceUnit || 'per hari'}
            placeholder="per hari / per trip"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
          <input
            type="number"
            name="order"
            defaultValue={transport?.order || 0}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Transport (Indonesia) *</label>
            <input type="text" name="nameId" value={nameId} onChange={(e) => setNameId(e.target.value)} onBlur={handleNameIdBlur} required
              placeholder="Sewa Mobil Avanza"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi (Indonesia) *</label>
            <textarea name="descId" value={descId} onChange={(e) => setDescId(e.target.value)} required rows={6}
              placeholder="Mobil nyaman untuk perjalanan wisata..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Termasuk (Indonesia) <span className="text-gray-400">(opsional)</span></label>
            <textarea name="includesId" value={includesId} onChange={(e) => setIncludesId(e.target.value)} rows={3}
              placeholder="Sopir, BBM, AC, Air mineral"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'en' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇬🇧 English Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Name (English) *</label>
            <input type="text" name="nameEn" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required
              placeholder="Avanza Car Rental"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) *</label>
            <textarea name="descEn" value={descEn} onChange={(e) => setDescEn(e.target.value)} required rows={6}
              placeholder="Comfortable car for tour trips..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Includes (English) <span className="text-gray-400">(optional)</span></label>
            <textarea name="includesEn" value={includesEn} onChange={(e) => setIncludesEn(e.target.value)} rows={3}
              placeholder="Driver, fuel, AC, mineral water"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'zh' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇨🇳 中文内容 (简体)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">交通名称 (中文简体) *</label>
            <input type="text" name="nameZh" value={nameZh} onChange={(e) => setNameZh(e.target.value)} required
              placeholder="阿凡达租车"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述 (中文简体) *</label>
            <textarea name="descZh" value={descZh} onChange={(e) => setDescZh(e.target.value)} required rows={6}
              placeholder="舒适的旅游用车..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'zh-cn' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">🇹🇼 中文內容 (繁體)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">交通名稱 (中文繁體) *</label>
            <input type="text" name="nameZhCn" value={nameZhCn} onChange={(e) => setNameZhCn(e.target.value)} required
              placeholder="阿凡達租車"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述 (中文繁體) *</label>
            <textarea name="descZhCn" value={descZhCn} onChange={(e) => setDescZhCn(e.target.value)} required rows={6}
              placeholder="舒適的旅遊用車..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Opsi</h3>
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input type="checkbox" name="available" defaultChecked={transport?.available ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Tersedia (tampil di website)</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="driverIncluded" defaultChecked={transport?.driverIncluded ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Termasuk Sopir</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 border-t pt-6">
        <button type="submit" disabled={loading}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Menyimpan...' : isEdit ? 'Perbarui Transport' : 'Buat Transport'}
        </button>
      </div>
    </form>
  );
}
