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
          <h1 className="text-3xl font-bold text-gray-900">Transportasi</h1>
          <p className="text-gray-600 mt-1">Kelola opsi transportasi</p>
        </div>
        <Link
          href="/admin/transport/new"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Transportasi
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">
          Modul manajemen transportasi. Implementasi mengikuti pola yang sama seperti Paket Tur.
        </p>
      </div>
    </div>
  );
}
