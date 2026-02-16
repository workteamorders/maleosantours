'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PaketTourForm from '@/components/forms/PaketTourForm';
import { apiClient } from '@/src/services/api';
import { PaketTour } from '@/src/types';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader } from 'lucide-react';

export default function EditPaketTourPage() {
  const router = useRouter();
  const params = useParams();
  const paketId = params.id as string;

  const [paketTour, setPaketTour] = useState<PaketTour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaketTour = async () => {
      try {
        const data = await apiClient.getPaketTour(paketId);
        setPaketTour(data);
      } catch (error: any) {
        toast.error('Failed to load package');
        router.push('/admin/paket-tour');
      } finally {
        setLoading(false);
      }
    };

    fetchPaketTour();
  }, [paketId, router]);

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.updatePaketTour(paketId, {
        ...data,
        thumbnail: data.imagePreview,
      });
      toast.success('Package updated successfully!');
      router.push('/admin/paket-tour');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update package';
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

  if (!paketTour) {
    return null;
  }

  return (
    <div className="max-w-3xl mr-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
          <p className="text-gray-600 mt-1">Update tour package information</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <PaketTourForm
          paketTour={paketTour}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/paket-tour')}
        />
      </div>
    </div>
  );
}
