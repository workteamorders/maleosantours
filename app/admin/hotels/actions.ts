'use server';

/**
 * Hotel Server Actions
 * CRUD operations for hotel management
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

export async function createHotel(formData: FormData) {
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

  // Collect facilities from form data
  const facilitiesStr = formData.get('facilities') as string;
  let facilities: string[] = [];
  if (facilitiesStr) {
    try {
      facilities = JSON.parse(facilitiesStr);
    } catch {
      facilities = facilitiesStr.split(',').map((f) => f.trim()).filter(Boolean);
    }
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
    category: formData.get('category') as string,
    stars: formData.get('stars') ? parseInt(formData.get('stars') as string) : 3,
    location: formData.get('location') as string,
    facilities: JSON.stringify(facilities),
    mainImage,
    images: JSON.stringify(imageUrls),
    videoUrl: (formData.get('videoUrl') as string) || null,
    bookingUrl: (formData.get('bookingUrl') as string) || null,
    priceRange: (formData.get('priceRange') as string) || null,
    featured: formData.get('featured') === 'on',
    active: formData.get('active') === 'on',
    order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
  };

  await prisma.hotel.create({ data });

  revalidatePath('/admin/hotels');
  revalidatePath('/hotels');
  redirect('/admin/hotels');
}

export async function updateHotel(id: string, formData: FormData) {
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

  // Collect facilities
  const facilitiesStr = formData.get('facilities') as string;
  let facilities: string[] = [];
  if (facilitiesStr) {
    try {
      facilities = JSON.parse(facilitiesStr);
    } catch {
      facilities = facilitiesStr.split(',').map((f) => f.trim()).filter(Boolean);
    }
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
    category: formData.get('category') as string,
    stars: formData.get('stars') ? parseInt(formData.get('stars') as string) : 3,
    location: formData.get('location') as string,
    facilities: JSON.stringify(facilities),
    mainImage,
    images: JSON.stringify(imageUrls),
    videoUrl: (formData.get('videoUrl') as string) || null,
    bookingUrl: (formData.get('bookingUrl') as string) || null,
    priceRange: (formData.get('priceRange') as string) || null,
    featured: formData.get('featured') === 'on',
    active: formData.get('active') === 'on',
    order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
  };

  await prisma.hotel.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/hotels');
  revalidatePath('/hotels');
  redirect('/admin/hotels');
}

export async function deleteHotel(id: string) {
  await requireAuth();

  await prisma.hotel.delete({
    where: { id },
  });

  revalidatePath('/admin/hotels');
  revalidatePath('/hotels');
}

export async function toggleHotelActive(id: string, active: boolean) {
  await requireAuth();

  await prisma.hotel.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/hotels');
  revalidatePath('/hotels');
}
