'use server';

/**
 * Media Library Server Actions
 * Upload and delete media files
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createMedia(data: {
  filename: string;
  url: string;
  type: string;
  size: number;
  mimeType: string;
  alt?: string;
  caption?: string;
}) {
  await requireAuth();

  await prisma.media.create({ data });

  revalidatePath('/admin/media');
}

export async function updateMediaDetails(id: string, formData: FormData) {
  await requireAuth();

  await prisma.media.update({
    where: { id },
    data: {
      alt: (formData.get('alt') as string) || null,
      caption: (formData.get('caption') as string) || null,
    },
  });

  revalidatePath('/admin/media');
}

export async function deleteMedia(id: string) {
  await requireAuth();

  await prisma.media.delete({
    where: { id },
  });

  revalidatePath('/admin/media');
}
