'use server';

/**
 * Info Travel Server Actions
 * CRUD operations for info travel content (images, video, text)
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { autoTranslateInfoTravelData } from '@/lib/autoTranslate';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createInfoTravel(formData: FormData) {
  await requireAuth();

  const titleId = (formData.get('titleId') as string) || '';
  const titleEn = (formData.get('titleEn') as string) || '';
  const slug = generateSlug(titleId || titleEn || 'untitled');

  // Collect multiple images from form
  const imageUrls: string[] = [];
  for (let i = 0; i < 20; i++) {
    const url = formData.get(`image_${i}`) as string;
    if (url && url.trim()) {
      imageUrls.push(url.trim());
    }
  }

  const data = {
    slug,
    category: (formData.get('category') as string) || 'destination',
    titleId: (formData.get('titleId') as string) || titleEn || '',
    titleEn,
    titleZh: (formData.get('titleZh') as string) || titleEn || '',
    titleZhCn: (formData.get('titleZhCn') as string) || titleEn || '',
    descId: (formData.get('descId') as string) || '',
    descEn: (formData.get('descEn') as string) || '',
    descZh: (formData.get('descZh') as string) || '',
    descZhCn: (formData.get('descZhCn') as string) || '',
    itineraryId: (formData.get('itineraryId') as string) || null,
    itineraryEn: (formData.get('itineraryEn') as string) || null,
    itineraryZh: (formData.get('itineraryZh') as string) || null,
    itineraryZhCn: (formData.get('itineraryZhCn') as string) || null,
    images: JSON.stringify(imageUrls),
    videoUrl: (formData.get('videoUrl') as string) || null,
    icon: (formData.get('icon') as string) || null,
    order: parseInt(formData.get('order') as string) || 0,
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
    metaTitleEn: (formData.get('metaTitleEn') as string) || null,
    metaDescEn: (formData.get('metaDescEn') as string) || null,
  };

  // Auto-translate any empty translated fields from Indonesian source
  await autoTranslateInfoTravelData(data);

  await prisma.infoTravel.create({ data });

  revalidatePath('/admin/info-travel');
  revalidatePath('/info-travel');
  redirect('/admin/info-travel');
}

export async function updateInfoTravel(id: string, formData: FormData) {
  await requireAuth();

  const titleId = (formData.get('titleId') as string) || '';
  const titleEn = (formData.get('titleEn') as string) || '';
  const slug = generateSlug(titleId || titleEn || 'untitled');

  // Collect multiple images from form
  const imageUrls: string[] = [];
  for (let i = 0; i < 20; i++) {
    const url = formData.get(`image_${i}`) as string;
    if (url && url.trim()) {
      imageUrls.push(url.trim());
    }
  }

  const data = {
    slug,
    category: (formData.get('category') as string) || 'destination',
    titleId: (formData.get('titleId') as string) || titleEn || '',
    titleEn,
    titleZh: (formData.get('titleZh') as string) || titleEn || '',
    titleZhCn: (formData.get('titleZhCn') as string) || titleEn || '',
    descId: (formData.get('descId') as string) || '',
    descEn: (formData.get('descEn') as string) || '',
    descZh: (formData.get('descZh') as string) || '',
    descZhCn: (formData.get('descZhCn') as string) || '',
    itineraryId: (formData.get('itineraryId') as string) || null,
    itineraryEn: (formData.get('itineraryEn') as string) || null,
    itineraryZh: (formData.get('itineraryZh') as string) || null,
    itineraryZhCn: (formData.get('itineraryZhCn') as string) || null,
    images: JSON.stringify(imageUrls),
    videoUrl: (formData.get('videoUrl') as string) || null,
    icon: (formData.get('icon') as string) || null,
    order: parseInt(formData.get('order') as string) || 0,
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
    metaTitleEn: (formData.get('metaTitleEn') as string) || null,
    metaDescEn: (formData.get('metaDescEn') as string) || null,
  };

  // Auto-translate any empty translated fields from Indonesian source
  await autoTranslateInfoTravelData(data);

  await prisma.infoTravel.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/info-travel');
  revalidatePath('/info-travel');
  redirect('/admin/info-travel');
}

export async function deleteInfoTravel(id: string) {
  await requireAuth();

  await prisma.infoTravel.delete({
    where: { id },
  });

  revalidatePath('/admin/info-travel');
  revalidatePath('/info-travel');
}

export async function toggleInfoTravelPublished(id: string, published: boolean) {
  await requireAuth();

  await prisma.infoTravel.update({
    where: { id },
    data: { published },
  });

  revalidatePath('/admin/info-travel');
  revalidatePath('/info-travel');
}
