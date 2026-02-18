'use server';

/**
 * Login Server Actions
 */

import { authenticateAdmin } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const result = await authenticateAdmin(email, password);

  return result;
}
