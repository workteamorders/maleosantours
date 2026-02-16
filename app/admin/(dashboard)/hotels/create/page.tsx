'use client';

import { useRouter } from 'next/navigation';
import HotelForm from '@/components/forms/HotelForm';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function CreateHotelPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // If there's an image file, you would upload it here
      // For now, we'll just pass the data
      await apiClient.createHotel({
        ...data,
        thumbnail: data.imagePreview, // In real implementation, upload to server
      });
      toast.success('Hotel created successfully!');
      router.push('/admin/hotels');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create hotel';
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Hotel</h1>
          <p className="text-gray-600 mt-1">Add a new hotel property to the system</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <HotelForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/hotels')}
        />
      </div>
    </div>
  );
}
