'use server';

/**
 * Tour Packages Server Actions
 * CRUD operations for tour packages
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createTourPackage(formData: FormData) {
  await requireAuth();

  const nameEn = formData.get('nameEn') as string;
  const slug = generateSlug(nameEn);

  const data = {
    slug,
    nameId: formData.get('nameId') as string,
    nameEn,
    nameZh: formData.get('nameZh') as string,
    nameZhCn: formData.get('nameZhCn') as string,
    descId: formData.get('descId') as string,
    descEn: formData.get('descEn') as string,
    descZh: formData.get('descZh') as string,
    descZhCn: formData.get('descZhCn') as string,
    duration: formData.get('duration') as string,
    type: formData.get('type') as string,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: formData.get('priceUnit') as string || null,
    mainImage: formData.get('mainImage') as string,
    images: JSON.stringify([formData.get('mainImage')]),
    featured: formData.get('featured') === 'on',
    active: formData.get('active') === 'on',
  };

  const tourPackage = await prisma.tourPackage.create({ data });

  revalidatePath('/admin/tour-packages');
  revalidatePath('/paket-tour');
  redirect('/admin/tour-packages');
}

export async function updateTourPackage(id: string, formData: FormData) {
  await requireAuth();

  const nameEn = formData.get('nameEn') as string;
  const slug = generateSlug(nameEn);

  const data = {
    slug,
    nameId: formData.get('nameId') as string,
    nameEn,
    nameZh: formData.get('nameZh') as string,
    nameZhCn: formData.get('nameZhCn') as string,
    descId: formData.get('descId') as string,
    descEn: formData.get('descEn') as string,
    descZh: formData.get('descZh') as string,
    descZhCn: formData.get('descZhCn') as string,
    duration: formData.get('duration') as string,
    type: formData.get('type') as string,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: formData.get('priceUnit') as string || null,
    mainImage: formData.get('mainImage') as string,
    images: JSON.stringify([formData.get('mainImage')]),
    featured: formData.get('featured') === 'on',
    active: formData.get('active') === 'on',
  };

  await prisma.tourPackage.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/tour-packages');
  revalidatePath('/paket-tour');
  redirect('/admin/tour-packages');
}

export async function deleteTourPackage(id: string) {
  await requireAuth();

  await prisma.tourPackage.delete({
    where: { id },
  });

  revalidatePath('/admin/tour-packages');
  revalidatePath('/paket-tour');
}

export async function toggleTourPackageActive(id: string, active: boolean) {
  await requireAuth();

  await prisma.tourPackage.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/tour-packages');
  revalidatePath('/paket-tour');
}
