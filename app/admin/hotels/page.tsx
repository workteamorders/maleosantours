/**
 * Hotels Admin Page - Placeholder
 * TODO: Implement full CRUD similar to Tour Packages
 */

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function HotelsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-600 mt-1">Manage hotel listings</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Hotel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">
          Hotels management module. Implementation follows the same pattern as Tour Packages.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Schema, actions, and forms are ready to be implemented.
        </p>
      </div>
    </div>
  );
}
