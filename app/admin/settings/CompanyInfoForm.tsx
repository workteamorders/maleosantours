'use client';

/**
 * Company Info Settings Form
 * Editable form for phone, email, address, social media, etc.
 */

import { useState } from 'react';
import { updateCompanyInfo } from './actions';
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Loader2,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface CompanyInfoFormProps {
  companyInfo: any | null;
}

export default function CompanyInfoForm({ companyInfo }: CompanyInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState(false);

  // --- Multi-language States ---
  const [addressId, setAddressId] = useState(companyInfo?.addressId || '');
  const [addressEn, setAddressEn] = useState(companyInfo?.addressEn || '');
  const [addressZh, setAddressZh] = useState(companyInfo?.addressZh || '');
  const [addressZhCn, setAddressZhCn] = useState(companyInfo?.addressZhCn || '');

  const [philTitleId, setPhilTitleId] = useState(companyInfo?.philosophyTitleId || 'Filosofi Kami');
  const [philTitleEn, setPhilTitleEn] = useState(companyInfo?.philosophyTitleEn || 'Our Philosophy');
  const [philTitleZh, setPhilTitleZh] = useState(companyInfo?.philosophyTitleZh || '我们的理念');
  const [philTitleZhCn, setPhilTitleZhCn] = useState(companyInfo?.philosophyTitleZhCn || '我們的理念');

  const [tag1Id, setTag1Id] = useState(companyInfo?.philosophyTagline1Id || 'Kami merancang perjalanan yang selaras dengan');
  const [tag1En, setTag1En] = useState(companyInfo?.philosophyTagline1En || 'We curate journeys that breathe with the');
  const [tag1Zh, setTag1Zh] = useState(companyInfo?.philosophyTagline1Zh || '我们打造与');
  const [tag1ZhCn, setTag1ZhCn] = useState(companyInfo?.philosophyTagline1ZhCn || '我們打造與');

  const [tag2Id, setTag2Id] = useState(companyInfo?.philosophyTagline2Id || 'irama alam.');
  const [tag2En, setTag2En] = useState(companyInfo?.philosophyTagline2En || 'rhythm of nature.');
  const [tag2Zh, setTag2Zh] = useState(companyInfo?.philosophyTagline2Zh || '自然韵律共呼吸的旅程。');
  const [tag2ZhCn, setTag2ZhCn] = useState(companyInfo?.philosophyTagline2ZhCn || '自然韻律共呼吸的旅程。');

  async function translateText(text: string) {
    if (!text) return null;
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return data.translations;
    } catch (err) {
      console.error('Translation error:', err);
      return null;
    }
  }

  async function handleAutoTranslateAll() {
    setTranslating(true);
    try {
      // Translate Address
      if (addressId) {
        const trans = await translateText(addressId);
        if (trans) {
          setAddressEn(trans.en || addressId);
          setAddressZh(trans['zh-CN'] || addressId);
          setAddressZhCn(trans['zh-TW'] || addressId);
        }
      }

      // Translate Philosophy Title
      if (philTitleId) {
        const trans = await translateText(philTitleId);
        if (trans) {
          setPhilTitleEn(trans.en || philTitleId);
          setPhilTitleZh(trans['zh-CN'] || philTitleId);
          setPhilTitleZhCn(trans['zh-TW'] || philTitleId);
        }
      }

      // Translate Tagline 1
      if (tag1Id) {
        const trans = await translateText(tag1Id);
        if (trans) {
          setTag1En(trans.en || tag1Id);
          setTag1Zh(trans['zh-CN'] || tag1Id);
          setTag1ZhCn(trans['zh-TW'] || tag1Id);
        }
      }

      // Translate Tagline 2
      if (tag2Id) {
        const trans = await translateText(tag2Id);
        if (trans) {
          setTag2En(trans.en || tag2Id);
          setTag2Zh(trans['zh-CN'] || tag2Id);
          setTag2ZhCn(trans['zh-TW'] || tag2Id);
        }
      }
    } finally {
      setTranslating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);

    // Sync state to formData just in case
    formData.set('addressId', addressId);
    formData.set('addressEn', addressEn);
    formData.set('addressZh', addressZh);
    formData.set('addressZhCn', addressZhCn);

    formData.set('philosophyTitleId', philTitleId);
    formData.set('philosophyTitleEn', philTitleEn);
    formData.set('philosophyTitleZh', philTitleZh);
    formData.set('philosophyTitleZhCn', philTitleZhCn);

    formData.set('philosophyTagline1Id', tag1Id);
    formData.set('philosophyTagline1En', tag1En);
    formData.set('philosophyTagline1Zh', tag1Zh);
    formData.set('philosophyTagline1ZhCn', tag1ZhCn);

    formData.set('philosophyTagline2Id', tag2Id);
    formData.set('philosophyTagline2En', tag2En);
    formData.set('philosophyTagline2Zh', tag2Zh);
    formData.set('philosophyTagline2ZhCn', tag2ZhCn);

    try {
      await updateCompanyInfo(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- Top Action Bar --- */}
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div>
          <h4 className="font-bold text-blue-900">Auto Translate</h4>
          <p className="text-xs text-blue-700">Terjemahkan semua field Alamat & Filosofi ke English & Mandarin dalam sekejap.</p>
        </div>
        <button
          type="button"
          onClick={handleAutoTranslateAll}
          disabled={translating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all text-sm font-bold shadow-md shadow-blue-200"
        >
          {translating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
          Lakukan Auto-Translate
        </button>
      </div>

      {/* ===== CONTACT INFO ===== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-blue-600" />
          Informasi Kontak
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon *
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={companyInfo?.phone || ''}
              required
              placeholder="+62431123456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Format internasional (untuk link tel:)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tampilan Telepon
            </label>
            <input
              type="text"
              name="phoneDisplay"
              defaultValue={companyInfo?.phoneDisplay || ''}
              placeholder="(0431) 123-456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Format tampilan di website</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              defaultValue={companyInfo?.email || ''}
              required
              placeholder="info@maleosan.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              defaultValue={companyInfo?.whatsapp || ''}
              placeholder="6281234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Nomor WA tanpa + (contoh: 6281234567890)</p>
          </div>
        </div>
      </div>

      {/* ===== ADDRESS ===== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-600" />
          Alamat Multi-Bahasa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (Indonesia) *
            </label>
            <textarea
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              required
              rows={3}
              placeholder="Jl. Sam Ratulangi No. 123, Manado, Sulawesi Utara 95111"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (English)
            </label>
            <textarea
              value={addressEn}
              onChange={(e) => setAddressEn(e.target.value)}
              rows={3}
              placeholder="123 Sam Ratulangi St, Manado, North Sulawesi 95111"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (Mandarin Simplified)
            </label>
            <textarea
              value={addressZh}
              onChange={(e) => setAddressZh(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (Mandarin Traditional)
            </label>
            <textarea
              value={addressZhCn}
              onChange={(e) => setAddressZhCn(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-serif italic">
            Google Maps URL Embed
          </label>
          <input
            type="url"
            name="googleMaps"
            defaultValue={companyInfo?.googleMaps || ''}
            placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Bisa paste link sharing Google Maps (maps.app.goo.gl/...) atau URL embed. Akan dikonversi otomatis.
          </p>
        </div>
      </div>

      {/* ===== SOCIAL MEDIA ===== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-purple-600" />
          Media Sosial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              defaultValue={companyInfo?.facebook || ''}
              placeholder="https://facebook.com/maleosantravel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              defaultValue={companyInfo?.instagram || ''}
              placeholder="https://instagram.com/maleosantravel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter / X
            </label>
            <input
              type="url"
              name="twitter"
              defaultValue={companyInfo?.twitter || ''}
              placeholder="https://twitter.com/maleosantravel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="url"
              name="youtube"
              defaultValue={companyInfo?.youtube || ''}
              placeholder="https://youtube.com/@maleosantravel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ===== PHILOSOPHY ===== */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          Filosofi Kami (Multi-Language)
        </h3>

        <div className="space-y-8">
          {/* Title Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Philosophy Title</div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">INDONESIA</label>
              <input
                type="text"
                value={philTitleId}
                onChange={(e) => setPhilTitleId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">ENGLISH</label>
              <input
                type="text"
                value={philTitleEn}
                onChange={(e) => setPhilTitleEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">SIMPLIFIED CHINESE</label>
              <input
                type="text"
                value={philTitleZh}
                onChange={(e) => setPhilTitleZh(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">TRADITIONAL CHINESE</label>
              <input
                type="text"
                value={philTitleZhCn}
                onChange={(e) => setPhilTitleZhCn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tagline 1 Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-lg">
            <div className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Tagline 1 (Main)</div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">INDONESIA</label>
              <textarea
                value={tag1Id}
                onChange={(e) => setTag1Id(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">ENGLISH</label>
              <textarea
                value={tag1En}
                onChange={(e) => setTag1En(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">SIMPLIFIED CHINESE</label>
              <textarea
                value={tag1Zh}
                onChange={(e) => setTag1Zh(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">TRADITIONAL CHINESE</label>
              <textarea
                value={tag1ZhCn}
                onChange={(e) => setTag1ZhCn(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tagline 2 Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/20 p-4 rounded-lg border border-amber-100">
            <div className="md:col-span-2 text-xs font-bold text-amber-400 uppercase tracking-widest">Tagline 2 (Italic Accent)</div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">INDONESIA</label>
              <input
                type="text"
                value={tag2Id}
                onChange={(e) => setTag2Id(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-serif italic"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">ENGLISH</label>
              <input
                type="text"
                value={tag2En}
                onChange={(e) => setTag2En(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-serif italic"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">SIMPLIFIED CHINESE</label>
              <input
                type="text"
                value={tag2Zh}
                onChange={(e) => setTag2Zh(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-serif italic"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">TRADITIONAL CHINESE</label>
              <input
                type="text"
                value={tag2ZhCn}
                onChange={(e) => setTag2ZhCn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-serif italic"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-blue-900 text-sm">Smart Multi-Language Philosophy</h5>
            <p className="text-xs text-blue-700 leading-relaxed">
              Section ini akan ditampilkan sesuai bahasa yang dipilih pengunjung di website utama. Gunakan tombol "Lakukan Auto-Translate" di atas untuk mengisi semua field Mandarin & English secara otomatis berdasarkan input Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="flex items-center justify-end gap-4 pt-4 sticky bottom-4 bg-white/80 backdrop-blur shadow-2xl p-4 rounded-2xl border border-gray-100 z-10">
        {saved && (
          <span className="flex items-center text-green-600 text-sm font-bold animate-bounce">
            <CheckCircle className="w-4 h-4 mr-1" />
            Pengaturan Berhasil Disimpan!
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-10 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 font-bold tracking-widest uppercase text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Menyimpan Data...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-3" />
              Update Seluruh Pengaturan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
