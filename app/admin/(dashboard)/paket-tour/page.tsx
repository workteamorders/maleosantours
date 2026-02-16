'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import { PaketTour } from '@/src/types';

export default function PaketTourPage() {
  const router = useRouter();
  const [paketTours, setPaketTours] = useState<PaketTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPaketTours = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getPaketTours(page, 10);
        setPaketTours(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPaketTours();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await apiClient.deletePaketTour(id);
      toast.success('Package deleted successfully!');
      setPaketTours(paketTours.filter(p => p.id !== id));
    } catch (error: any) {
      toast.error('Failed to delete package');
    }
  };

  const columns: Column<PaketTour>[] = [
    {
      header: 'Package Name',
      accessor: 'name',
    },
    {
      header: 'Destination',
      accessor: 'destination',
    },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (value) => `${value} days`,
    },
    {
      header: 'Adult Price',
      accessor: 'priceAdult',
      render: (value, row) => `${row.currency} ${value}`,
    },
    {
      header: 'Min/Max Pax',
      accessor: 'minPax',
      render: (value, row) => `${value} - ${row.maxPax}`,
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
          <h1 className="text-3xl font-bold text-gray-900">Paket Tour</h1>
          <p className="text-gray-600 mt-1">Manage tour packages</p>
        </div>
        <Link
          href="/admin/paket-tour/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Add Package
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={paketTours}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/paket-tour/${row.id}/edit`}
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
