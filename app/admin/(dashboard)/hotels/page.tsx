'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Hotel } from '@/src/types';

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getHotels(page, 10);
        setHotels(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;

    try {
      await apiClient.deleteHotel(id);
      toast.success('Hotel deleted successfully!');
      setHotels(hotels.filter(h => h.id !== id));
    } catch (error: any) {
      toast.error('Failed to delete hotel');
    }
  };

  const columns: Column<Hotel>[] = [
    {
      header: 'Hotel Name',
      accessor: 'name',
    },
    {
      header: 'City',
      accessor: 'city',
    },
    {
      header: 'Price/Night',
      accessor: 'pricePerNight',
      render: (value, row) => `${row.currency} ${value}`,
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (value) => `${value} ⭐`,
    },
    {
      header: 'Status',
      accessor: 'available',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {value ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-600 mt-1">Manage all hotel properties</p>
        </div>
        <Link
          href="/admin/hotels/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Add Hotel
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={hotels}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/hotels/${row.id}/edit`}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
              title="Edit"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
