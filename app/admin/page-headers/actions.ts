'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function upsertPageHeader(pageKey: string, image: string) {
  await prisma.pageHeader.upsert({
    where: { pageKey },
    update: { image },
    create: { pageKey, image },
  });

  // Revalidate all affected public pages
  revalidatePath('/');
  revalidatePath(`/id/${pageKey}`);
  revalidatePath(`/en/${pageKey}`);
  revalidatePath(`/zh/${pageKey}`);
  revalidatePath(`/zh-CN/${pageKey}`);
}
