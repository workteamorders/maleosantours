'use client';

/**
 * Client-side action buttons for Hotels
 */

import { Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteHotel, toggleHotelActive } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Yakin ingin menghapus "${name}"?`)) return;

    setLoading(true);
    await deleteHotel(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}

export function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleHotelActive(id, !active);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
    >
      {active ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
      {loading ? 'Memproses...' : active ? 'Nonaktifkan' : 'Aktifkan'}
    </button>
  );
}
