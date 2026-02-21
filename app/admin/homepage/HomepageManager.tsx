'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, Upload, Loader2, RotateCw } from 'lucide-react';

interface HomepageItem {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  desc: string | null;
  image: string;
  link: string | null;
  rotation: number;
  order: number;
  active: boolean;
}

interface Props {
  initialItems: HomepageItem[];
}

const sectionLabels: Record<string, string> = {
  hero: '🏠 Hero Background',
  destination: '🌴 Destinations',
  journal: '📰 Journals / Activities',
};

const sectionDescriptions: Record<string, string> = {
  hero: 'Gambar latar utama yang muncul pertama kali saat membuka website.',
  destination: 'Foto-foto destinasi yang scroll horizontal di halaman beranda.',
  journal: 'Aktivitas dan kegiatan terbaru yang ditampilkan di bagian jurnal.',
};

export default function HomepageManager({ initialItems }: Props) {
  const [items, setItems] = useState<HomepageItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<HomepageItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredItems = items.filter(i => i.section === activeSection);

  async function handleUploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Upload gagal');
        return null;
      }
      return data.url;
    } catch {
      alert('Upload gagal');
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      const id = formData.get('id') as string;
      const url = id ? `/api/homepage/${id}` : '/api/homepage';
      const method = id ? 'PUT' : 'POST';

      // Use server action instead
      const section = formData.get('section') as string;
      const body = {
        section,
        title: formData.get('title') || null,
        subtitle: formData.get('subtitle') || null,
        desc: formData.get('desc') || null,
        image: formData.get('image') as string,
        link: formData.get('link') || null,
        rotation: parseInt(formData.get('rotation') as string) || 0,
        order: parseInt(formData.get('order') as string) || 0,
        active: formData.get('active') === 'on',
      };

      const res = await fetch(`/api/homepage${id ? `?id=${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // Refresh
        const allRes = await fetch('/api/homepage');
        const allItems = await allRes.json();
        setItems(allItems);
        setEditingItem(null);
        setIsCreating(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal menyimpan');
      }
    } catch {
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus item ini?')) return;

    try {
      const res = await fetch(`/api/homepage?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
      }
    } catch {
      alert('Gagal menghapus');
    }
  }

  async function handleToggleActive(item: HomepageItem) {
    try {
      const res = await fetch(`/api/homepage?id=${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      if (res.ok) {
        setItems(items.map(i => i.id === item.id ? { ...i, active: !i.active } : i));
      }
    } catch {
      alert('Gagal mengubah status');
    }
  }

  function startCreate() {
    setEditingItem(null);
    setIsCreating(true);
  }

  function startEdit(item: HomepageItem) {
    setIsCreating(false);
    setEditingItem(item);
  }

  function cancelEdit() {
    setEditingItem(null);
    setIsCreating(false);
  }

  return (
    <div>
      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {Object.entries(sectionLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setActiveSection(key); cancelEdit(); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Section Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">{sectionDescriptions[activeSection]}</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Tambah Item
        </button>
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingItem) && (
        <ItemForm
          item={editingItem}
          section={activeSection}
          onSave={handleSave}
          onCancel={cancelEdit}
          onUploadImage={handleUploadImage}
          saving={saving}
          uploading={uploading}
        />
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-lg shadow border overflow-hidden ${!item.active ? 'opacity-50' : ''}`}
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.title || 'Homepage item'}
                className="w-full h-full object-cover"
                style={{ transform: `rotate(${item.rotation || 0}deg)`, transformOrigin: 'center center' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Error'; }}
              />
              {item.title && item.section === 'hero' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-serif font-bold bg-black/40 px-4 py-2 rounded">{item.title}</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {item.active ? 'Aktif' : 'Tidak Aktif'}
                </span>
                {item.rotation > 0 && (
                  <span className="px-2 py-1 rounded bg-purple-500 text-white text-xs font-bold">
                    {item.rotation}°
                  </span>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 rounded bg-black/60 text-white text-xs">
                  Order: {item.order}
                </span>
              </div>
            </div>
            <div className="p-4">
              {item.title && <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>}
              {item.subtitle && <p className="text-sm text-gray-500 mb-1">{item.subtitle}</p>}
              {item.desc && <p className="text-xs text-gray-400 line-clamp-2">{item.desc}</p>}

              <div className="flex gap-2 mt-3 pt-3 border-t">
                <button
                  onClick={() => startEdit(item)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  <Pencil size={14} /> Ubah
                </button>
                <button
                  onClick={() => handleToggleActive(item)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  {item.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  {item.active ? 'Sembunyikan' : 'Tampilkan'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors ml-auto"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !isCreating && (
        <div className="text-center py-12 text-gray-500">
          Belum ada item di section ini. Klik "Tambah Item" untuk menambahkan.
        </div>
      )}
    </div>
  );
}

/* ========== Item Form ========== */
function ItemForm({
  item,
  section,
  onSave,
  onCancel,
  onUploadImage,
  saving,
  uploading,
}: {
  item: HomepageItem | null;
  section: string;
  onSave: (formData: FormData) => void;
  onCancel: () => void;
  onUploadImage: (file: File) => Promise<string | null>;
  saving: boolean;
  uploading: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(item?.image || '');
  const [rotation, setRotation] = useState(item?.rotation || 0);

  const fieldConfig: Record<string, { showTitle: boolean; showSubtitle: boolean; showDesc: boolean; subtitleLabel: string; titleLabel: string }> = {
    hero: { showTitle: true, showSubtitle: false, showDesc: false, subtitleLabel: '', titleLabel: 'Judul Overlay (muncul di tengah gambar)' },
    destination: { showTitle: true, showSubtitle: true, showDesc: false, subtitleLabel: 'Kategori (Island, Beach, Nature, dll)', titleLabel: 'Nama Destinasi' },
    journal: { showTitle: true, showSubtitle: true, showDesc: true, subtitleLabel: 'Tanggal (Oct 2023)', titleLabel: 'Judul Kegiatan' },
  };

  const config = fieldConfig[section] || fieldConfig.destination;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    if (url) setImageUrl(url);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      alert('Harap masukkan URL gambar atau upload gambar');
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set('image', imageUrl);
    formData.set('section', section);
    formData.set('rotation', rotation.toString());
    if (item?.id) formData.set('id', item.id);
    if (!formData.get('active')) formData.set('active', 'off');
    onSave(formData);
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {item ? 'Ubah Item' : 'Tambah Item Baru'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar *
            </label>

            {/* Preview */}
            {imageUrl && (
              <div className="mb-3 relative rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Invalid+URL'; }}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Rotation Controls */}
            {imageUrl && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotasi Gambar
                </label>
                <div className="flex items-center gap-2">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotation(deg)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        rotation === deg
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <RotateCw size={12} style={{ transform: `rotate(${deg}deg)` }} />
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2 mb-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload Gambar'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Atau paste URL gambar (https://...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {config.showTitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.titleLabel}
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={item?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {config.showSubtitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.subtitleLabel}
                </label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={item?.subtitle || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {config.showDesc && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  name="desc"
                  rows={3}
                  defaultValue={item?.desc || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urutan
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={item?.order ?? 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={item?.active ?? true}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktif</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (opsional)
              </label>
              <input
                type="text"
                name="link"
                defaultValue={item?.link || ''}
                placeholder="/paket-tour/day-tour"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || !imageUrl}
            className="flex items-center gap-2 px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
