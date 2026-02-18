'use server';

/**
 * Admin Global Actions
 */

import { logout } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  await logout();
  revalidatePath('/admin');
}
