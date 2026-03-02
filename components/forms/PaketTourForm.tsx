'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaketTour as PaketTourType } from '@/src/types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';
import { Loader, Trash2 } from 'lucide-react';

const paketTourSchema = z.object({
  name: z.string().min(3, 'Package name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce.number().positive('Duration must be positive'),
  destination: z.string().min(3, 'Destination is required'),
  priceAdult: z.coerce.number().positive('Adult price must be positive'),
  priceChild: z.coerce.number().nonnegative('Child price must be non-negative'),
  groupDiscount: z.coerce.number().nonnegative('Discount must be non-negative').max(100),
  currency: z.string().default('IDR'),
  inclusions: z.string(),
  exclusions: z.string(),
  maxPax: z.coerce.number().positive('Max pax must be positive'),
  minPax: z.coerce.number().positive('Min pax must be positive'),
  available: z.boolean().default(true),
});

type PaketTourFormData = z.infer<typeof paketTourSchema>;

interface PaketTourFormProps {
  paketTour?: PaketTourType;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function PaketTourForm({
  paketTour,
  onSubmit,
  onCancel,
  loading = false,
}: PaketTourFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(paketTour?.thumbnail ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaketTourFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(paketTourSchema) as any,
    defaultValues: paketTour ? {
      name: paketTour.name,
      description: paketTour.description,
      duration: paketTour.duration,
      destination: paketTour.destination,
      priceAdult: paketTour.priceAdult,
      priceChild: paketTour.priceChild,
      groupDiscount: paketTour.groupDiscount,
      currency: paketTour.currency,
      inclusions: paketTour.inclusions.join(', '),
      exclusions: paketTour.exclusions.join(', '),
      maxPax: paketTour.maxPax,
      minPax: paketTour.minPax,
      available: paketTour.available,
    } : {},
  });

  const handleImageUpload = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onFormSubmit = async (data: PaketTourFormData) => {
    if (!imagePreview && !paketTour?.thumbnail) {
      toast.error('Please upload a package image');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        inclusions: data.inclusions.split(',').map(i => i.trim()),
        exclusions: data.exclusions.split(',').map(e => e.trim()),
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
          Package Image
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
          preview={imagePreview}
        />
      </div>

      {/* Package Name and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Name
          </label>
          <input
            type="text"
            placeholder="Enter package name"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('duration')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination
        </label>
        <input
          type="text"
          placeholder="Enter destination"
          {...register('destination')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.destination && (
          <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          placeholder="Describe the tour package..."
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adult Price
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('priceAdult')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.priceAdult && (
            <p className="text-red-500 text-sm mt-1">{errors.priceAdult.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child Price
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('priceChild')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.priceChild && (
            <p className="text-red-500 text-sm mt-1">{errors.priceChild.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Discount (%)
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('groupDiscount')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.groupDiscount && (
            <p className="text-red-500 text-sm mt-1">{errors.groupDiscount.message}</p>
          )}
        </div>
      </div>

      {/* Currency */}
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

      {/* Inclusions and Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inclusions (comma separated)
          </label>
          <textarea
            placeholder="Accommodation, Meals, Tour Guide"
            {...register('inclusions')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exclusions (comma separated)
          </label>
          <textarea
            placeholder="Flight, Travel Insurance, Personal Items"
            {...register('exclusions')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Min & Max Pax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Pax
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('minPax')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.minPax && (
            <p className="text-red-500 text-sm mt-1">{errors.minPax.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Pax
          </label>
          <input
            type="number"
            placeholder="0"
            {...register('maxPax')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.maxPax && (
            <p className="text-red-500 text-sm mt-1">{errors.maxPax.message}</p>
          )}
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
            paketTour ? 'Update Package' : 'Create Package'
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
