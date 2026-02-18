/**
 * Edit Tour Package - Admin
 */

import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TourPackageForm from '../TourPackageForm';
import { notFound } from 'next/navigation';

async function getTourPackage(id: string) {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { id },
  });

  if (!tourPackage) {
    notFound();
  }

  return tourPackage;
}

export default async function EditTourPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tourPackage = await getTourPackage(id);

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Tour Package</h1>
          <p className="text-gray-600 mt-1">{tourPackage.nameEn}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TourPackageForm tourPackage={tourPackage} />
      </div>
    </div>
  );
}
