import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import Philosophy from '../../components/Philosophy';
import Destinations from '../../components/Destinations';

import Journal from '../../components/Journal';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('home', locale as Locale);
}

export default async function Home() {
  // Fetch homepage data from database
  let homepageItems: any[] = [];
  try {
    homepageItems = await prisma.homepageItem.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  // Split by section
  const heroItems = homepageItems.filter(i => i.section === 'hero');
  const destItems = homepageItems.filter(i => i.section === 'destination');
  const journalItems = homepageItems.filter(i => i.section === 'journal');

  // Map to component props
  const heroSlides = heroItems.length > 0
    ? heroItems.map(h => ({
      url: h.image,
      title: h.title || null,
      rotation: h.rotation || 0,
    }))
    : undefined;

  const destinations = destItems.length > 0
    ? destItems.map(d => ({
      title: d.title || '',
      category: d.subtitle || '',
      image: d.image,
      year: new Date(d.createdAt).getFullYear().toString(),
      rotation: d.rotation || 0,
    }))
    : undefined;

  const journals = journalItems.length > 0
    ? journalItems.map(j => ({
      title: j.title || '',
      date: j.subtitle || '',
      desc: j.desc || '',
      image: j.image,
      rotation: j.rotation || 0,
    }))
    : undefined;

  return (
    <main className="relative bg-white min-h-screen">
      <Navbar />
      <Hero heroImages={heroSlides} />
      <Philosophy />
      {/* Destinations (Horizontal Scroll) */}
      <div className="relative z-10 bg-background">
        <Destinations items={destinations} />
      </div>

      <Journal items={journals} />
      <Footer />
    </main>
  );
}

