/**
 * Settings Admin Page
 * Manage company info and site settings
 */

import { prisma } from '@/lib/prisma';
import CompanyInfoForm from './CompanyInfoForm';

export default async function SettingsAdminPage() {
  const companyInfo = await prisma.companyInfo.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Kelola informasi perusahaan dan pengaturan website</p>
      </div>

      <CompanyInfoForm companyInfo={companyInfo} />
    </div>
  );
}
