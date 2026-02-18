/**
 * Testimonials Admin Page - Placeholder
 */

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TestimonialsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage customer reviews and ratings</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">
          Testimonials management module with approval workflow.
        </p>
      </div>
    </div>
  );
}
