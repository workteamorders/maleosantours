'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Transport } from '@/src/types';

export default function TransportPage() {
  const router = useRouter();
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getTransports(page, 10);
        setTransports(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load transports');
      } finally {
        setLoading(false);
      }
    };

    fetchTransports();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transport?')) return;

    try {
      await apiClient.deleteTransport(id);
      toast.success('Transport deleted successfully!');
      setTransports(transports.filter(t => t.id !== id));
    } catch (error: any) {
      toast.error('Failed to delete transport');
    }
  };

  const columns: Column<Transport>[] = [
    {
      header: 'Vehicle Name',
      accessor: 'name',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (value) => `${value} seats`,
    },
    {
      header: 'Driver',
      accessor: 'driverName',
    },
    {
      header: 'Price/Day',
      accessor: 'pricePerDay',
      render: (value, row) => `${row.currency} ${value}`,
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
          <h1 className="text-3xl font-bold text-gray-900">Transport</h1>
          <p className="text-gray-600 mt-1">Manage transportation services</p>
        </div>
        <Link
          href="/admin/transport/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Add Transport
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={transports}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/transport/${row.id}/edit`}
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
