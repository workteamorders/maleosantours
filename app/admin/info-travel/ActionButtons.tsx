'use client';

/**
 * Client-side action buttons for Info Travel
 */

import { Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteInfoTravel, toggleInfoTravelPublished } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    await deleteInfoTravel(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function TogglePublishedButton({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleInfoTravelPublished(id, !published);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
    >
      {published ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
      {loading ? 'Updating...' : published ? 'Unpublish' : 'Publish'}
    </button>
  );
}
