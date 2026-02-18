/**
 * Create New Tour Package - Admin
 */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TourPackageForm from '../TourPackageForm';

export default function NewTourPackagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/tour-packages"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Tour Package</h1>
          <p className="text-gray-600 mt-1">Create a new tour package with multi-language support</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TourPackageForm />
      </div>
    </div>
  );
}
