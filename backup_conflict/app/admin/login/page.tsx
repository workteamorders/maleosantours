/**
 * Admin Login Page
 * /admin/login - Authentication entry point
 */

import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function AdminLoginPage() {
  // If already logged in, redirect to admin dashboard
  const admin = await getCurrentAdmin();
  
  if (admin) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Maleosan Travel
          </h1>
          <p className="text-gray-600">Panel Admin</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Masuk untuk melanjutkan
          </h2>
          
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500">
          Area terbatas. Hanya untuk personel yang berwenang.
        </p>
      </div>
    </div>
  );
}
