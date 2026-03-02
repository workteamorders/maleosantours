/**
 * Edit Transport - Admin
 */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TransportForm from '../TransportForm';

export default async function EditTransportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transport = await prisma.transport.findUnique({
    where: { id },
  });

  if (!transport) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/transport"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Transport</h1>
          <p className="text-gray-600 mt-1">{transport.nameEn}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TransportForm transport={transport} />
      </div>
    </div>
  );
}
