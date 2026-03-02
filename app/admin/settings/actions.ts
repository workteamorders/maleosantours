'use server';

/**
 * Settings Server Actions
 * CRUD for CompanyInfo (single row)
 */

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Convert any Google Maps URL (sharing link, regular URL) to an embed URL.
 * Supports:
 * - maps.app.goo.gl short links (resolves redirect)
 * - Regular Google Maps place/search URLs
 * - Already-embed URLs (returned as-is)
 */
async function convertToMapsEmbedUrl(url: string): Promise<string> {
  if (!url || url.trim() === '') return '';

  url = url.trim();

  // Already an embed URL — use as-is
  if (url.includes('/maps/embed') || url.includes('output=embed')) {
    return url;
  }

  // Short URL — resolve redirect to get full URL
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
      });
      url = response.url;
    } catch {
      // If redirect fails, try using the short URL as a search query
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
    }
  }

  // Extract coordinates from URL like /@1.474,124.842,15z
  const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),?(\d+)?/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    const zoom = coordMatch[3] || '15';
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  }

  // Extract place name from /place/PlaceName/
  const placeMatch = url.match(/\/place\/([^\/\?@]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
  }

  // Extract search query from /maps/search/
  const searchMatch = url.match(/\/maps\/search\/([^\/\?]+)/);
  if (searchMatch) {
    const query = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  }

  // Fallback: use entire URL as search query for embed
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
}

export async function getCompanyInfo() {
  const info = await prisma.companyInfo.findFirst();
  return info;
}

export async function updateCompanyInfo(formData: FormData) {
  await requireAuth();

  // Convert Google Maps URL to embed format
  const rawMapsUrl = (formData.get('googleMaps') as string) || '';
  const embedMapsUrl = rawMapsUrl ? await convertToMapsEmbedUrl(rawMapsUrl) : null;

  const data = {
    phone: (formData.get('phone') as string) || '',
    phoneDisplay: (formData.get('phoneDisplay') as string) || '',
    email: (formData.get('email') as string) || '',
    addressId: (formData.get('addressId') as string) || '',
    addressEn: (formData.get('addressEn') as string) || '',
    addressZh: (formData.get('addressZh') as string) || '',
    addressZhCn: (formData.get('addressZhCn') as string) || '',
    whatsapp: (formData.get('whatsapp') as string) || null,
    googleMaps: embedMapsUrl,
    facebook: (formData.get('facebook') as string) || null,
    instagram: (formData.get('instagram') as string) || null,
    twitter: (formData.get('twitter') as string) || null,
    youtube: (formData.get('youtube') as string) || null,
    philosophyTitleId: (formData.get('philosophyTitleId') as string) || null,
    philosophyTitleEn: (formData.get('philosophyTitleEn') as string) || null,
    philosophyTitleZh: (formData.get('philosophyTitleZh') as string) || null,
    philosophyTitleZhCn: (formData.get('philosophyTitleZhCn') as string) || null,
    philosophyTagline1Id: (formData.get('philosophyTagline1Id') as string) || null,
    philosophyTagline1En: (formData.get('philosophyTagline1En') as string) || null,
    philosophyTagline1Zh: (formData.get('philosophyTagline1Zh') as string) || null,
    philosophyTagline1ZhCn: (formData.get('philosophyTagline1ZhCn') as string) || null,
    philosophyTagline2Id: (formData.get('philosophyTagline2Id') as string) || null,
    philosophyTagline2En: (formData.get('philosophyTagline2En') as string) || null,
    philosophyTagline2Zh: (formData.get('philosophyTagline2Zh') as string) || null,
    philosophyTagline2ZhCn: (formData.get('philosophyTagline2ZhCn') as string) || null,
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
