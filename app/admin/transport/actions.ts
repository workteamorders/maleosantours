'use server';

/**
 * Transport Server Actions
 * CRUD operations for transport options
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

export async function createTransport(formData: FormData) {
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
    type: formData.get('type') as string,
    capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: (formData.get('priceUnit') as string) || null,
    includesId: (formData.get('includesId') as string) || null,
    includesEn: (formData.get('includesEn') as string) || null,
    mainImage,
    videoUrl: (formData.get('videoUrl') as string) || null,
    images: JSON.stringify(imageUrls),
    driverIncluded: formData.get('driverIncluded') === 'on',
    available: formData.get('available') === 'on',
    order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
  };

  await prisma.transport.create({ data });

  revalidatePath('/admin/transport');
  revalidatePath('/transport');
  redirect('/admin/transport');
}

export async function updateTransport(id: string, formData: FormData) {
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
    type: formData.get('type') as string,
    capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null,
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceUnit: (formData.get('priceUnit') as string) || null,
    includesId: (formData.get('includesId') as string) || null,
    includesEn: (formData.get('includesEn') as string) || null,
    mainImage,
    videoUrl: (formData.get('videoUrl') as string) || null,
    images: JSON.stringify(imageUrls),
    driverIncluded: formData.get('driverIncluded') === 'on',
    available: formData.get('available') === 'on',
    order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
  };

  await prisma.transport.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/transport');
  revalidatePath('/transport');
  redirect('/admin/transport');
}

export async function deleteTransport(id: string) {
  await requireAuth();

  await prisma.transport.delete({
    where: { id },
  });

  revalidatePath('/admin/transport');
  revalidatePath('/transport');
}

export async function toggleTransportAvailable(id: string, available: boolean) {
  await requireAuth();

  await prisma.transport.update({
    where: { id },
    data: { available },
  });

  revalidatePath('/admin/transport');
  revalidatePath('/transport');
}
