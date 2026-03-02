'use client';

/**
 * Testimonial Form
 * Handles creation and editing with multi-language support
 * Supports: customer photo upload, rating, multi-lang reviews, tour package link
 */

import { useState, useRef } from 'react';
import { createTestimonial, updateTestimonial } from './actions';
import { Save, Star, User, Upload, Loader2, X, Languages } from 'lucide-react';

interface TestimonialFormProps {
  testimonial?: any;
  tourPackages?: { id: string; nameEn: string }[];
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'image');

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

export default function TestimonialForm({ testimonial, tourPackages = [] }: TestimonialFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('id');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);

  // Translated content state (controlled)
  const [reviewId, setReviewId] = useState(testimonial?.reviewId || '');
  const [reviewEn, setReviewEn] = useState(testimonial?.reviewEn || '');
  const [reviewZh, setReviewZh] = useState(testimonial?.reviewZh || '');
  const [reviewZhCn, setReviewZhCn] = useState(testimonial?.reviewZhCn || '');

  const [photo, setPhoto] = useState<string>(testimonial?.photo || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!testimonial;

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setUploadError(null);

    try {
      const url = await uploadFile(file);
      setPhoto(url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload foto gagal');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  }

  async function handleTranslate() {
    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);
    const reviewId = (formData.get('reviewId') as string) || '';

    if (!reviewId.trim()) {
      alert('Isi ulasan dalam Bahasa Indonesia terlebih dahulu');
      return;
    }

    setTranslating(true);
    setUploadError(null);

    try {
      if (reviewId.trim()) {
        const translations = await translateText(reviewId);
        setReviewEn(translations['en'] || reviewId);
        setReviewZh(translations['zh-CN'] || reviewId);
        setReviewZhCn(translations['zh-TW'] || reviewId);
      }
      setTranslated(true);
    } catch (err: any) {
      setUploadError('Gagal menerjemahkan: ' + (err.message || 'Kesalahan tidak diketahui'));
    } finally {
      setTranslating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Set photo URL
    formData.set('photo', photo);
    formData.set('rating', String(rating));

    // Inject translated values
    formData.set('reviewId', reviewId);
    formData.set('reviewEn', reviewEn);
    formData.set('reviewZh', reviewZh);
    formData.set('reviewZhCn', reviewZhCn);

    // Auto-translate if not yet translated
    if (!reviewEn && reviewId.trim()) {
      try {
        const translations = await translateText(reviewId);
        formData.set('reviewEn', translations['en'] || reviewId);
        formData.set('reviewZh', translations['zh-CN'] || reviewId);
        formData.set('reviewZhCn', translations['zh-TW'] || reviewId);
      } catch { /* fallback */ }
    }

    try {
      if (isEdit) {
        await updateTestimonial(testimonial.id, formData);
      } else {
        await createTestimonial(formData);
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error saving testimonial:', error);
      alert('Gagal menyimpan testimoni');
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

      {/* ===== CUSTOMER INFO ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Info Pelanggan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pelanggan *
            </label>
            <input
              type="text"
              name="customerName"
              defaultValue={testimonial?.customerName || ''}
              required
              placeholder="Nama lengkap pelanggan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negara / Kota *
            </label>
            <input
              type="text"
              name="country"
              defaultValue={testimonial?.country || ''}
              required
              placeholder="contoh: Jakarta, Indonesia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paket Tour (opsional)
            </label>
            <select
              name="tourPackageId"
              defaultValue={testimonial?.tourPackageId || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Tidak ada --</option>
              {tourPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                    }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-500">{rating} / 5</span>
          </div>
        </div>

        {/* Order & Flags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutan Tampil
            </label>
            <input
              type="number"
              name="order"
              defaultValue={testimonial?.order || 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="approved"
                defaultChecked={testimonial?.approved ?? true}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Disetujui</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={testimonial?.featured ?? false}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Unggulan</span>
            </label>
          </div>
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

      {/* ===== PHOTO UPLOAD ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Foto Pelanggan (opsional)
        </h3>

        {photo && (
          <div className="relative inline-block mb-4">
            <img
              src={photo}
              alt="Customer photo"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => setPhoto('')}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div
          onClick={() => !uploadingPhoto && photoInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadingPhoto
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
        >
          {uploadingPhoto ? (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Mengupload foto...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Upload className="w-8 h-8" />
              <span className="text-sm">Klik untuk upload foto pelanggan</span>
              <span className="text-xs text-gray-400">JPG, PNG</span>
            </div>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* ===== REVIEW CONTENT ===== */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ulasan</h3>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
          >
            {translating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menerjemahkan...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                {translated ? 'Terjemahkan Ulang' : 'Auto Terjemahkan'}
              </>
            )}
          </button>
        </div>

        {/* Indonesian Review */}
        <div className={activeTab === 'id' ? 'block' : 'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ulasan (Bahasa Indonesia) *
          </label>
          <textarea
            name="reviewId"
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value)}
            required
            rows={5}
            placeholder="Tulis ulasan pelanggan dalam Bahasa Indonesia..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* English Review */}
        <div className={activeTab === 'en' ? 'block' : 'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (English) *
          </label>
          <textarea
            name="reviewEn"
            value={reviewEn}
            onChange={(e) => setReviewEn(e.target.value)}
            required
            rows={5}
            placeholder="Write customer review in English..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chinese Simplified Review */}
        <div className={activeTab === 'zh' ? 'block' : 'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评价 (中文简体)
          </label>
          <textarea
            name="reviewZh"
            value={reviewZh}
            onChange={(e) => setReviewZh(e.target.value)}
            rows={5}
            placeholder="用简体中文写客户评价..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chinese Traditional Review */}
        <div className={activeTab === 'zh-cn' ? 'block' : 'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            評價 (中文繁體)
          </label>
          <textarea
            name="reviewZhCn"
            value={reviewZhCn}
            onChange={(e) => setReviewZhCn(e.target.value)}
            rows={5}
            placeholder="用繁體中文寫客戶評價..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {isEdit ? 'Simpan Perubahan' : 'Tambah Testimoni'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
