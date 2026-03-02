import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TestimonialForm from '../TestimonialForm';
import { prisma } from '@/lib/prisma';

export default async function NewTestimonialPage() {
  // Fetch tour packages for the dropdown
  const tourPackages = await prisma.tourPackage.findMany({
    where: { active: true },
    orderBy: { nameEn: 'asc' },
    select: { id: true, nameEn: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/testimonials" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Testimoni Baru</h1>
          <p className="text-gray-600 mt-1">Buat testimoni pelanggan baru dengan dukungan multi-bahasa</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <TestimonialForm tourPackages={tourPackages} />
      </div>
    </div>
  );
}
