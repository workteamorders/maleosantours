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

  // Collect images from form data
  const imageUrls: string[] = [];
  for (let i = 0; i < 50; i++) {
    const img = formData.get(`image_${i}`) as string;
    if (img && img.trim()) imageUrls.push(img.trim());
    else if (i > 0 && !img) break;
  }
  const mainImage = formData.get('mainImage') as string;
  if (mainImage && !imageUrls.includes(mainImage)) {
    imageUrls.unshift(mainImage);
  }

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
    durationEn: formData.get('durationEn') as string || null,
    durationZh: formData.get('durationZh') as string || null,
    durationZhCn: formData.get('durationZhCn') as string || null,
    type: formData.get('type') as string,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: formData.get('priceUnit') as string || null,
    priceUnitEn: formData.get('priceUnitEn') as string || null,
    priceUnitZh: formData.get('priceUnitZh') as string || null,
    priceUnitZhCn: formData.get('priceUnitZhCn') as string || null,
    mainImage,
    videoUrl: (formData.get('videoUrl') as string) || null,
    images: JSON.stringify(imageUrls),
    itineraryId: (formData.get('itineraryId') as string) || null,
    itineraryEn: (formData.get('itineraryEn') as string) || null,
    itineraryZh: (formData.get('itineraryZh') as string) || null,
    itineraryZhCn: (formData.get('itineraryZhCn') as string) || null,
    priceTiers: (formData.get('priceTiers') as string) || null,
    includedId: (formData.get('includedId') as string) || null,
    includedEn: (formData.get('includedEn') as string) || null,
    includedZh: (formData.get('includedZh') as string) || null,
    includedZhCn: (formData.get('includedZhCn') as string) || null,
    excludedId: (formData.get('excludedId') as string) || null,
    excludedEn: (formData.get('excludedEn') as string) || null,
    excludedZh: (formData.get('excludedZh') as string) || null,
    excludedZhCn: (formData.get('excludedZhCn') as string) || null,
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

  // Collect images from form data
  const imageUrls: string[] = [];
  for (let i = 0; i < 50; i++) {
    const img = formData.get(`image_${i}`) as string;
    if (img && img.trim()) imageUrls.push(img.trim());
    else if (i > 0 && !img) break;
  }
  const mainImage = formData.get('mainImage') as string;
  if (mainImage && !imageUrls.includes(mainImage)) {
    imageUrls.unshift(mainImage);
  }

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
    durationEn: formData.get('durationEn') as string || null,
    durationZh: formData.get('durationZh') as string || null,
    durationZhCn: formData.get('durationZhCn') as string || null,
    type: formData.get('type') as string,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: formData.get('priceUnit') as string || null,
    priceUnitEn: formData.get('priceUnitEn') as string || null,
    priceUnitZh: formData.get('priceUnitZh') as string || null,
    priceUnitZhCn: formData.get('priceUnitZhCn') as string || null,
    mainImage,
    videoUrl: (formData.get('videoUrl') as string) || null,
    images: JSON.stringify(imageUrls),
    itineraryId: (formData.get('itineraryId') as string) || null,
    itineraryEn: (formData.get('itineraryEn') as string) || null,
    itineraryZh: (formData.get('itineraryZh') as string) || null,
    itineraryZhCn: (formData.get('itineraryZhCn') as string) || null,
    priceTiers: (formData.get('priceTiers') as string) || null,
    includedId: (formData.get('includedId') as string) || null,
    includedEn: (formData.get('includedEn') as string) || null,
    includedZh: (formData.get('includedZh') as string) || null,
    includedZhCn: (formData.get('includedZhCn') as string) || null,
    excludedId: (formData.get('excludedId') as string) || null,
    excludedEn: (formData.get('excludedEn') as string) || null,
    excludedZh: (formData.get('excludedZh') as string) || null,
    excludedZhCn: (formData.get('excludedZhCn') as string) || null,
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
