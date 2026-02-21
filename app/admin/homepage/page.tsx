import { prisma } from '@/lib/prisma';
import HomepageManager from './HomepageManager';
import { seedHomepageDefaults } from './actions';

export default async function HomepagePage() {
  // Seed defaults if empty
  await seedHomepageDefaults();

  const items = await prisma.homepageItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Kelola Beranda
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola foto dan konten yang tampil di halaman utama website.
        </p>
      </div>

      <HomepageManager initialItems={JSON.parse(JSON.stringify(items))} />
    </div>
  );
}
