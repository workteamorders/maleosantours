'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HotelForm from '@/components/forms/HotelForm';
import { apiClient } from '@/src/services/api';
import { Hotel } from '@/src/types';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader } from 'lucide-react';

export default function EditHotelPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await apiClient.getHotel(hotelId);
        setHotel(data);
      } catch (error: any) {
        toast.error('Failed to load hotel');
        router.push('/admin/hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, router]);

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.updateHotel(hotelId, {
        ...data,
        thumbnail: data.imagePreview,
      });
      toast.success('Hotel updated successfully!');
      router.push('/admin/hotels');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update hotel';
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

  if (!hotel) {
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>
          <p className="text-gray-600 mt-1">Update hotel information</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <HotelForm
          hotel={hotel}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/hotels')}
        />
      </div>
    </div>
  );
}
