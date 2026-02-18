/**
 * Edit Info Travel - Admin
 */

import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import InfoTravelForm from '../InfoTravelForm';
import { notFound } from 'next/navigation';

async function getInfoTravel(id: string) {
  const infoTravel = await prisma.infoTravel.findUnique({
    where: { id },
  });

  if (!infoTravel) {
    notFound();
  }

  return infoTravel;
}

export default async function EditInfoTravelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const infoTravel = await getInfoTravel(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/info-travel"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Info Travel</h1>
          <p className="text-gray-600 mt-1">{infoTravel.titleEn}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <InfoTravelForm infoTravel={infoTravel} />
      </div>
    </div>
  );
}
