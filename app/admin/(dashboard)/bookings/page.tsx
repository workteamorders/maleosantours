'use client';

import { useState, useEffect } from 'react';
import { Filter, Download, Eye } from 'lucide-react';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Booking } from '@/src/types';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getBookings(page, 10, statusFilter);
        setBookings(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, statusFilter]);

  const columns: Column<Booking>[] = [
    {
      header: 'Booking Code',
      accessor: 'bookingCode',
    },
    {
      header: 'Customer',
      accessor: 'customerName',
    },
    {
      header: 'Package',
      accessor: 'packageName',
    },
    {
      header: 'Total Price',
      accessor: 'totalPrice',
      render: (value, row) => `${row.currency} ${value}`,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'confirmed' ? 'bg-green-50 text-green-700' :
          value === 'pending' ? 'bg-yellow-50 text-yellow-700' :
          value === 'cancelled' ? 'bg-red-50 text-red-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'paid' ? 'bg-green-50 text-green-700' :
          value === 'pending' ? 'bg-yellow-50 text-yellow-700' :
          'bg-gray-50 text-gray-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage customer bookings and reservations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        actions={(row) => (
          <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition">
            <Eye size={18} />
          </button>
        )}
      />
    </div>
  );
}
