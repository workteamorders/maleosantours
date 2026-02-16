'use client';

import { useRouter } from 'next/navigation';
import TransportForm from '@/components/forms/TransportForm';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function CreateTransportPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.createTransport({
        ...data,
        image: data.imagePreview,
      });
      toast.success('Transport created successfully!');
      router.push('/admin/transport');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create transport';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-2xl mr-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Transport</h1>
          <p className="text-gray-600 mt-1">Add a new vehicle to the fleet</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <TransportForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/transport')}
        />
      </div>
    </div>
  );
}
