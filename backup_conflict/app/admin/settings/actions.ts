'use server';

/**
 * Settings Server Actions
 * CRUD for CompanyInfo (single row)
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCompanyInfo() {
  const info = await prisma.companyInfo.findFirst();
  return info;
}

export async function updateCompanyInfo(formData: FormData) {
  await requireAuth();

  const data = {
    phone: (formData.get('phone') as string) || '',
    phoneDisplay: (formData.get('phoneDisplay') as string) || '',
    email: (formData.get('email') as string) || '',
    addressId: (formData.get('addressId') as string) || '',
    addressEn: (formData.get('addressEn') as string) || '',
    whatsapp: (formData.get('whatsapp') as string) || null,
    googleMaps: (formData.get('googleMaps') as string) || null,
    facebook: (formData.get('facebook') as string) || null,
    instagram: (formData.get('instagram') as string) || null,
    twitter: (formData.get('twitter') as string) || null,
    youtube: (formData.get('youtube') as string) || null,
  };

  // Check if record exists
  const existing = await prisma.companyInfo.findFirst();

  if (existing) {
    await prisma.companyInfo.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.companyInfo.create({ data });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/kontak');
}
