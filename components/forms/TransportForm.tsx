'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Transport as TransportType } from '@/src/types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const transportSchema = z.object({
  name: z.string().min(3, 'Transport name is required'),
  type: z.enum(['car', 'bus', 'van', 'motorcycle']),
  description: z.string().min(10, 'Description is required'),
  capacity: z.coerce.number().positive('Capacity must be positive'),
  licensePlate: z.string().min(3, 'License plate is required'),
  inclusions: z.string().optional(),
  features: z.string().optional(),
  driverName: z.string().min(3, 'Driver name is required'),
  driverPhone: z.string().min(10, 'Driver phone is required'),
  pricePerDay: z.coerce.number().positive('Price must be positive'),
  currency: z.string().default('IDR'),
  available: z.boolean().default(true),
});

type TransportFormData = z.infer<typeof transportSchema>;

interface TransportFormProps {
  transport?: TransportType;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function TransportForm({
  transport,
  onSubmit,
  onCancel,
  loading = false,
}: TransportFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(transport?.image ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: transport ? {
      name: transport.name,
      type: transport.type,
      description: transport.description,
      capacity: transport.capacity,
      licensePlate: transport.licensePlate,
      inclusions: transport.inclusions?.join(', '),
      features: transport.features?.join(', '),
      driverName: transport.driverName,
      driverPhone: transport.driverPhone,
      pricePerDay: transport.pricePerDay,
      currency: transport.currency,
      available: transport.available,
    } : {
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

  const onFormSubmit = async (data: TransportFormData) => {
    if (!imagePreview && !transport?.image) {
      toast.error('Please upload a vehicle image');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        inclusions: data.inclusions ? data.inclusions.split(',').map(i => i.trim()) : [],
        features: data.features ? data.features.split(',').map(f => f.trim()) : [],
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
          Vehicle Image
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
          preview={imagePreview}
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Name
        </label>
        <input
          type="text"
          placeholder="e.g., Toyota Avanza"
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
          placeholder="Enter detailed description of the vehicle and service"
          rows={4}
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Inclusions and Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inclusions (comma separated)
          </label>
          <input
            type="text"
            placeholder="Driver, Fuel, Tax"
            {...register('inclusions')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (comma separated)
          </label>
          <input
            type="text"
            placeholder="AC, WiFi, Audio System"
            {...register('features')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Type and Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="van">Van</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('capacity')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
          )}
        </div>
      </div>

      {/* License Plate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          License Plate
        </label>
        <input
          type="text"
          placeholder="e.g., AB 1234 CD"
          {...register('licensePlate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.licensePlate && (
          <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>
        )}
      </div>

      {/* Driver Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver Name
          </label>
          <input
            type="text"
            placeholder="Enter driver name"
            {...register('driverName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.driverName && (
            <p className="text-red-500 text-sm mt-1">{errors.driverName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver Phone
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register('driverPhone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.driverPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.driverPhone.message}</p>
          )}
        </div>
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Per Day
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('pricePerDay')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.pricePerDay && (
            <p className="text-red-500 text-sm mt-1">{errors.pricePerDay.message}</p>
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
            transport ? 'Update Transport' : 'Create Transport'
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
