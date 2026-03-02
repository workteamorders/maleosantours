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
} from 'lucide-react';

interface CompanyInfoFormProps {
  companyInfo: any | null;
}

export default function CompanyInfoForm({ companyInfo }: CompanyInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);

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
          Alamat
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (Indonesia) *
            </label>
            <textarea
              name="addressId"
              defaultValue={companyInfo?.addressId || ''}
              required
              rows={3}
              placeholder="Jl. Sam Ratulangi No. 123, Manado, Sulawesi Utara 95111"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (English) *
            </label>
            <textarea
              name="addressEn"
              defaultValue={companyInfo?.addressEn || ''}
              required
              rows={3}
              placeholder="123 Sam Ratulangi St, Manado, North Sulawesi 95111"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps URL
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xiaohongshu (小红书)
            </label>
            <input
              type="url"
              name="xiaohongshu"
              defaultValue={companyInfo?.xiaohongshu || ''}
              placeholder="https://www.xiaohongshu.com/user/profile/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="flex items-center justify-end gap-4 pt-4">
        {saved && (
          <span className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
            Berhasil disimpan!
          </span>
        )}
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
              Simpan Pengaturan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
