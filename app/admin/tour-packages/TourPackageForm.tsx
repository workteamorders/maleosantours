'use client';

/**
 * Tour Package Form
 * Handles both creation and editing with multi-language support
 */

import { useState } from 'react';
import { createTourPackage, updateTourPackage } from './actions';
import { Save } from 'lucide-react';

interface TourPackageFormProps {
  tourPackage?: any;
}

export default function TourPackageForm({ tourPackage }: TourPackageFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en' | 'zh' | 'zh-cn'>('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!tourPackage;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEdit) {
        await updateTourPackage(tourPackage.id, formData);
      } else {
        await createTourPackage(formData);
      }
    } catch (error) {
      console.error('Error saving tour package:', error);
      alert('Failed to save tour package');
      setLoading(false);
    }
  }

  const tabs = [
    { key: 'en', label: 'English' },
    { key: 'id', label: 'Indonesia' },
    { key: 'zh', label: '中文 (简体)' },
    { key: 'zh-cn', label: '中文 (繁體)' },
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info (Shown in all tabs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            name="type"
            defaultValue={tourPackage?.type || 'day-tour'}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day-tour">Day Tour</option>
            <option value="multi-day">Multi-Day Tour</option>
            <option value="custom">Custom Tour</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            defaultValue={tourPackage?.duration || ''}
            required
            placeholder="e.g., 1 Day, 3D2N"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) <span className="text-gray-400">(optional)</span>
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
            Price Unit
          </label>
          <input
            type="text"
            name="priceUnit"
            defaultValue={tourPackage?.priceUnit || 'per person'}
            placeholder="per person"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image URL
          </label>
          <input
            type="url"
            name="mainImage"
            defaultValue={tourPackage?.mainImage || ''}
            required
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Use Unsplash or upload to media library</p>
        </div>
      </div>

      {/* Multi-language Content */}
      {activeTab === 'en' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">English Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name (English) *
            </label>
            <input
              type="text"
              name="nameEn"
              defaultValue={tourPackage?.nameEn || ''}
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
              defaultValue={tourPackage?.descEn || ''}
              required
              rows={6}
              placeholder="Enjoy the underwater beauty of Bunaken..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'id' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Konten Indonesia</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Paket (Indonesia) *
            </label>
            <input
              type="text"
              name="nameId"
              defaultValue={tourPackage?.nameId || ''}
              required
              placeholder="Bunaken Snorkeling Tour"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi (Indonesia) *
            </label>
            <textarea
              name="descId"
              defaultValue={tourPackage?.descId || ''}
              required
              rows={6}
              placeholder="Nikmati keindahan bawah laut Bunaken..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'zh' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">中文内容 (简体)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              套餐名称 (中文简体) *
            </label>
            <input
              type="text"
              name="nameZh"
              defaultValue={tourPackage?.nameZh || ''}
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
              defaultValue={tourPackage?.descZh || ''}
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
          <h3 className="text-lg font-semibold text-gray-900">中文內容 (繁體)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              套餐名稱 (中文繁體) *
            </label>
            <input
              type="text"
              name="nameZhCn"
              defaultValue={tourPackage?.nameZhCn || ''}
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
              defaultValue={tourPackage?.descZhCn || ''}
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
        <h3 className="text-lg font-semibold text-gray-900">Publishing Options</h3>
        
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="active"
              defaultChecked={tourPackage?.active ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active (visible on website)</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={tourPackage?.featured ?? false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
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
          {loading ? 'Saving...' : isEdit ? 'Update Package' : 'Create Package'}
        </button>
      </div>
    </form>
  );
}
