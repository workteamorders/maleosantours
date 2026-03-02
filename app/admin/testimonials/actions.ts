'use server';

/**
 * Testimonials Server Actions
 * CRUD operations for testimonials
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTestimonial(formData: FormData) {
  await requireAuth();

  const data = {
    customerName: formData.get('customerName') as string,
    country: formData.get('country') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    reviewId: formData.get('reviewId') as string,
    reviewEn: formData.get('reviewEn') as string,
    reviewZh: (formData.get('reviewZh') as string) || null,
    reviewZhCn: (formData.get('reviewZhCn') as string) || null,
    photo: (formData.get('photo') as string) || null,
    tourPackageId: (formData.get('tourPackageId') as string) || null,
    order: parseInt(formData.get('order') as string) || 0,
    approved: formData.get('approved') === 'on',
    featured: formData.get('featured') === 'on',
  };

  await prisma.testimonial.create({ data });

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimoni');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAuth();

  const data = {
    customerName: formData.get('customerName') as string,
    country: formData.get('country') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    reviewId: formData.get('reviewId') as string,
    reviewEn: formData.get('reviewEn') as string,
    reviewZh: (formData.get('reviewZh') as string) || null,
    reviewZhCn: (formData.get('reviewZhCn') as string) || null,
    photo: (formData.get('photo') as string) || null,
    tourPackageId: (formData.get('tourPackageId') as string) || null,
    order: parseInt(formData.get('order') as string) || 0,
    approved: formData.get('approved') === 'on',
    featured: formData.get('featured') === 'on',
  };

  await prisma.testimonial.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimoni');
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
  await requireAuth();

  await prisma.testimonial.delete({
    where: { id },
  });

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimoni');
}

export async function toggleTestimonialApproved(id: string, approved: boolean) {
  await requireAuth();

  await prisma.testimonial.update({
    where: { id },
    data: { approved },
  });

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimoni');
}
