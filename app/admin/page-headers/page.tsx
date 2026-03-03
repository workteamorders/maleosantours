/**
 * Page Headers Admin
 * Manage the banner / header images displayed at the top of each public page.
 */

import { prisma } from '@/lib/prisma';
import PageHeadersManager from './PageHeadersManager';
import { PAGE_HEADER_DEFAULTS } from '@/lib/pageHeaders';

const PAGE_KEYS = ['info-travel', 'paket-tour', 'hotels', 'transport', 'testimoni', 'kontak'];

async function getAllPageHeaders() {
  const records = await prisma.pageHeader.findMany();
  const map: Record<string, string> = {};
  records.forEach((r) => (map[r.pageKey] = r.image));

  return PAGE_KEYS.map((key) => ({
    pageKey: key,
    image: map[key] ?? PAGE_HEADER_DEFAULTS[key] ?? '',
  }));
}

export default async function PageHeadersAdminPage() {
  const headers = await getAllPageHeaders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Header Halaman</h1>
        <p className="text-gray-600 mt-1">
          Ganti gambar banner/header yang ditampilkan di bagian atas setiap halaman publik.
        </p>
      </div>

      <PageHeadersManager headers={headers} />
    </div>
  );
}
