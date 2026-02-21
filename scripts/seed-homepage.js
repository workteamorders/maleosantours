import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const count = await prisma.homepageItem.count();
  if (count > 0) { console.log('Already has', count, 'items'); return; }

  const defaults = [
    { section: 'hero', title: null, subtitle: null, desc: null, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop', link: null, order: 0, active: true },
    { section: 'destination', title: 'Likupang Lihaga', subtitle: 'Island', desc: null, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2670&auto=format&fit=crop', link: null, order: 0, active: true },
    { section: 'destination', title: 'Pantai Paal', subtitle: 'Beach', desc: null, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop', link: null, order: 1, active: true },
    { section: 'destination', title: 'Bukit Savana', subtitle: 'Nature', desc: null, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2674&auto=format&fit=crop', link: null, order: 2, active: true },
    { section: 'destination', title: 'Air Terjun Tunan', subtitle: 'Waterfall', desc: null, image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2670&auto=format&fit=crop', link: null, order: 3, active: true },
    { section: 'destination', title: 'Pagoda Ekayana', subtitle: 'Culture', desc: null, image: 'https://images.unsplash.com/photo-1518182170546-0766ce6cba3b?q=80&w=2670&auto=format&fit=crop', link: null, order: 4, active: true },
    { section: 'journal', title: 'MV Carnival Luminosa', subtitle: 'Oct 8, 2023', desc: 'Luxury meets adventure. Exploring hidden gems of Manado.', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19', link: null, order: 0, active: true },
    { section: 'journal', title: 'Fam Trip Kota Kinabalu', subtitle: 'Sep 2023', desc: 'Strengthening ties with Kota Kinabalu. Direct flights and city tours.', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b', link: null, order: 1, active: true },
    { section: 'journal', title: 'Raja Ampat Study Trip', subtitle: 'Aug 2023', desc: 'A journey of learning and cultural exchange in Bitung.', image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86', link: null, order: 2, active: true },
    { section: 'journal', title: 'Bunaken Diving Experience', subtitle: 'July 2023', desc: 'Discovering the underwater paradise of Bunaken National Park.', image: 'https://images.unsplash.com/photo-1582967788606-a171f1080cae', link: null, order: 3, active: true },
  ];

  await prisma.homepageItem.createMany({ data: defaults });
  console.log('Seeded', defaults.length, 'homepage items');
}

seed().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
