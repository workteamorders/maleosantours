import Hero from '../../components/Hero';
import Navbar from '../../components/Navbar';
import Philosophy from '../../components/Philosophy';
import Destinations from '../../components/Destinations';
import Services from '../../components/Services';
import Journal from '../../components/Journal';
import Footer from '../../components/Footer';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch homepage data from database
  const homepageItems = await prisma.homepageItem.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });

  // Split by section
  const heroItems = homepageItems.filter(i => i.section === 'hero');
  const destItems = homepageItems.filter(i => i.section === 'destination');
  const journalItems = homepageItems.filter(i => i.section === 'journal');

  // Map to component props
  const heroImageList = heroItems.length > 0 ? heroItems.map(h => h.image) : undefined;

  const destinations = destItems.length > 0
    ? destItems.map(d => ({
        title: d.title || '',
        category: d.subtitle || '',
        image: d.image,
        year: new Date(d.createdAt).getFullYear().toString(),
      }))
    : undefined;

  const journals = journalItems.length > 0
    ? journalItems.map(j => ({
        title: j.title || '',
        date: j.subtitle || '',
        desc: j.desc || '',
        image: j.image,
      }))
    : undefined;

  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero heroImages={heroImageList} />
      <Philosophy />
      {/* Destinations (Horizontal Scroll) */}
      <div className="relative z-10 bg-background">
        <Destinations items={destinations} />
      </div>
      <Services />
      <Journal items={journals} />
      <Footer />
    </main>
  );
}
