/**
 * Database Setup & Seed Script
 * Run this to initialize the database with an admin user and sample data
 * Usage: npx tsx scripts/setup-db.ts
 */

import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function main() {
  console.log('🚀 Setting up database...\n');

  // 1. Create default employee admin user
  console.log('👤 Creating karyawan admin user...');
  const employeePassword = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin123!');

  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@maleosan.com' },
    update: {
      role: 'karyawan',
      active: true,
    },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@maleosan.com',
      password: employeePassword,
      name: 'Admin Karyawan',
      role: 'karyawan',
      active: true,
    },
  });
  console.log('✅ Karyawan admin created:', admin.email);

  // 2. Create default boss user
  console.log('👑 Creating boss user...');
  const bossPassword = await hashPassword(process.env.BOSS_PASSWORD || 'Boss123!');

  const boss = await prisma.admin.upsert({
    where: { email: process.env.BOSS_EMAIL || 'boss@maleosan.com' },
    update: {
      role: 'boss',
      active: true,
    },
    create: {
      email: process.env.BOSS_EMAIL || 'boss@maleosan.com',
      password: bossPassword,
      name: 'Boss',
      role: 'boss',
      active: true,
    },
  });
  console.log('✅ Boss user created:', boss.email);

  // 3. Create sample tour packages
  console.log('\n📦 Creating sample tour packages...');

  const tourPackages = [
    {
      slug: 'bunaken-snorkeling-tour',
      nameEn: 'Bunaken Snorkeling Tour',
      nameId: 'Bunaken Snorkeling Tour',
      nameZh: '布纳肯浮潜之旅',
      nameZhCn: '布納肯浮潛之旅',
      descEn: 'Enjoy the underwater beauty of Bunaken, one of the world\'s best diving spots with spectacular coral reefs.',
      descId: 'Nikmati keindahan bawah laut Bunaken, salah satu spot diving terbaik di dunia dengan terumbu karang yang spektakuler.',
      descZh: '享受布纳肯海底美景，世界最佳潜水点之一，拥有壮观的珊瑚礁。',
      descZhCn: '享受布納肯海底美景，世界最佳潛水點之一，擁有壯觀的珊瑚礁。',
      duration: '1 Day',
      type: 'day-tour',
      price: 85.00,
      priceUnit: 'per person',
      mainImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop']),
      featured: true,
      active: true,
      order: 1,
    },
    {
      slug: 'minahasa-highland-tour',
      nameEn: 'Minahasa Highland Tour',
      nameId: 'Minahasa Highland Tour',
      nameZh: '米纳哈萨高地之旅',
      nameZhCn: '米納哈薩高地之旅',
      descEn: 'Explore the beauty of Minahasa highlands with colorful lakes, ancient waruga, and stunning mountain views.',
      descId: 'Jelajahi keindahan dataran tinggi Minahasa dengan danau berwarna, waruga kuno, dan pemandangan gunung yang menakjubkan.',
      descZh: '探索米纳哈萨高地的美景，有彩色湖泊、古老石棺和壮丽山景。',
      descZhCn: '探索米納哈薩高地的美景，有彩色湖泊、古老石棺和壯麗山景。',
      duration: '1 Day',
      type: 'day-tour',
      price: 75.00,
      priceUnit: 'per person',
      mainImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop',
      images: JSON.stringify(['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop']),
      featured: true,
      active: true,
      order: 2,
    },
    {
      slug: 'likupang-beach-tour',
      nameEn: 'Likupang Beach Tour',
      nameId: 'Likupang Beach Tour',
      nameZh: '利库邦海滩之旅',
      nameZhCn: '利庫邦海灘之旅',
      descEn: 'Relax on Likupang\'s beautiful beaches with white sand and crystal clear water.',
      descId: 'Bersantai di pantai-pantai indah Likupang dengan pasir putih dan air jernih yang mempesona.',
      descZh: '在利库邦美丽的白沙海滩和清澈海水中放松。',
      descZhCn: '在利庫邦美麗的白沙海灘和清澈海水中放鬆。',
      duration: '1 Day',
      type: 'day-tour',
      price: 90.00,
      priceUnit: 'per person',
      mainImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      images: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop']),
      featured: false,
      active: true,
      order: 3,
    },
  ];

  for (const pkg of tourPackages) {
    await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg,
    });
    console.log('✅ Created:', pkg.nameEn);
  }

  // 4. Create company info
  console.log('\n🏢 Creating company information...');
  await prisma.companyInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      phone: '+62-821-xxxx-xxxx',
      phoneDisplay: '+62 821 xxxx xxxx',
      email: 'info@maleosan.com',
      addressId: 'Manado, Sulawesi Utara, Indonesia',
      addressEn: 'Manado, North Sulawesi, Indonesia',
      whatsapp: '+6282xxxxxxxxx',
      facebook: 'https://facebook.com/maleosantravel',
      instagram: 'https://instagram.com/maleosantravel',
      twitter: 'https://twitter.com/maleosantravel',
    },
  });
  console.log('✅ Company info created');

  console.log('\n✨ Database setup complete!\n');
  console.log('📝 Karyawan credentials:');
  console.log('   Email:', process.env.ADMIN_EMAIL || 'admin@maleosan.com');
  console.log('   Password:', process.env.ADMIN_PASSWORD || 'Admin123!');
  console.log('\n📝 Boss credentials:');
  console.log('   Email:', process.env.BOSS_EMAIL || 'boss@maleosan.com');
  console.log('   Password:', process.env.BOSS_PASSWORD || 'Boss123!');
  console.log('\n🌐 Access admin panel at: http://localhost:3000/admin\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
