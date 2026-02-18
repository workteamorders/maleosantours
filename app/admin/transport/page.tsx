/**
 * Transport Admin Page - Placeholder
 * TODO: Implement full CRUD similar to Tour Packages
 */

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TransportAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport</h1>
          <p className="text-gray-600 mt-1">Manage transport options</p>
        </div>
        <Link
          href="/admin/transport/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transport
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">
          Transport management module. Implementation follows the same pattern as Tour Packages.
        </p>
      </div>
    </div>
  );
}
