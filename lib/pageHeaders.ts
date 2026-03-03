/**
 * Helper: get header image for a specific page from the database.
 * Falls back to default if no record exists.
 */

import { prisma } from './prisma';

const DEFAULTS: Record<string, string> = {
  'info-travel':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop',
  'paket-tour':
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop',
  hotels:
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=600&fit=crop',
  transport:
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop',
  testimoni:
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=600&fit=crop',
  kontak:
    'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop',
};

export async function getPageHeaderImage(pageKey: string): Promise<string> {
  try {
    const record = await prisma.pageHeader.findUnique({ where: { pageKey } });
    if (record?.image) return record.image;
  } catch {
    // DB unavailable: fall back to default
  }
  return DEFAULTS[pageKey] ?? '';
}

export { DEFAULTS as PAGE_HEADER_DEFAULTS };
