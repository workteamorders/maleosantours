'use server';

import { authenticateAdmin } from '@/lib/auth';

export async function loginAction(email: string, password: string) {
  const result = await authenticateAdmin(email, password);
  return result;
}
