'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TransportForm from '@/components/forms/TransportForm';
import { apiClient } from '@/src/services/api';
import { Transport } from '@/src/types';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader } from 'lucide-react';

export default function EditTransportPage() {
  const router = useRouter();
  const params = useParams();
  const transportId = params.id as string;

  const [transport, setTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const data = await apiClient.getTransport(transportId);
        setTransport(data);
      } catch (error: any) {
        toast.error('Failed to load transport');
        router.push('/admin/transport');
      } finally {
        setLoading(false);
      }
    };

    fetchTransport();
  }, [transportId, router]);

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.updateTransport(transportId, {
        ...data,
        image: data.imagePreview,
      });
      toast.success('Transport updated successfully!');
      router.push('/admin/transport');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update transport';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!transport) {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Transport</h1>
          <p className="text-gray-600 mt-1">Update vehicle information</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <TransportForm
          transport={transport}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/transport')}
        />
      </div>
    </div>
  );
}
