'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hotel as HotelType } from '@/src/types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';
import { Loader, X } from 'lucide-react';

const hotelSchema = z.object({
  name: z.string().min(3, 'Hotel name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Invalid email'),
  facilities: z.string(),
  pricePerNight: z.coerce.number().positive('Price must be positive'),
  rating: z.coerce.number().min(1).max(5).default(5),
  currency: z.string().default('IDR'),
  available: z.boolean().default(true),
});

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  hotel?: HotelType;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function HotelForm({
  hotel,
  onSubmit,
  onCancel,
  loading = false,
}: HotelFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(hotel?.thumbnail ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: hotel ? {
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      phone: hotel.phone,
      email: hotel.email,
      facilities: hotel.facilities.join(', '),
      pricePerNight: hotel.pricePerNight,
      rating: hotel.rating,
      currency: hotel.currency,
      available: hotel.available,
    } : {
      rating: 5,
      currency: 'IDR',
      available: true,
    },
  });

  const handleImageUpload = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onFormSubmit = async (data: HotelFormData) => {
    if (!imagePreview && !hotel?.thumbnail) {
      toast.error('Please upload a hotel image');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        facilities: data.facilities.split(',').map(f => f.trim()),
        image: imageFile,
        imagePreview,
      });
      reset();
      setImageFile(null);
      setImagePreview('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hotel Image
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
          preview={imagePreview}
        />
      </div>

      {/* Hotel Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hotel Name
        </label>
        <input
          type="text"
          placeholder="Enter hotel name"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          placeholder="Describe the hotel..."
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Address and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            placeholder="Enter address"
            {...register('address')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            placeholder="Enter city"
            {...register('city')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Phone and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Facilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facilities (comma separated)
        </label>
        <input
          type="text"
          placeholder="WiFi, Pool, Gym, Restaurant"
          {...register('facilities')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price, Currency and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Per Night
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('pricePerNight')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.pricePerNight && (
            <p className="text-red-500 text-sm mt-1">{errors.pricePerNight.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            {...register('currency')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (Stars)
          </label>
          <select
            {...register('rating')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Available */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="available"
          {...register('available')}
          className="w-4 h-4"
        />
        <label htmlFor="available" className="ml-3 text-sm font-medium text-gray-700">
          Available for booking
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
        >
          {isSubmitting || loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            hotel ? 'Update Hotel' : 'Create Hotel'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
