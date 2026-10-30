import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import Destinations from '../../components/Destinations';
import Journal from '../../components/Journal';
import ContactSection from '../../components/ContactSection';
import CommentsSection from '../../components/CommentsSection';
import TourPackagesClient from './paket-tour/TourPackagesClient';
import { prisma } from '@/lib/prisma';
import type { HomepageItem } from '@prisma/client';
import { getPublicTourPackages } from '@/lib/tourPackages';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';
import { translateForLocale } from '@/lib/autoTranslate';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('paket-tour', locale as Locale, { path: '' });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('paketTour');

  let homepageItems: HomepageItem[] = [];
  try {
    homepageItems = await prisma.homepageItem.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  const heroItems = homepageItems.filter(i => i.section === 'hero');
  const destItems = homepageItems.filter(i => i.section === 'destination');
  const journalItems = homepageItems.filter(i => i.section === 'journal');

  const heroSlides = heroItems.length > 0
    ? heroItems.map(h => ({
      url: h.image,
      title: h.title || null,
      rotation: h.rotation || 0,
    }))
    : undefined;

  const destinations = destItems.length > 0
    ? await Promise.all(destItems.map(async d => ({
      title: await translateForLocale(d.title || '', locale),
      category: d.subtitle || '',
      image: d.image,
      year: new Date(d.createdAt).getFullYear().toString(),
      rotation: d.rotation || 0,
    })))
    : undefined;

  const journals = journalItems.length > 0
    ? await Promise.all(journalItems.map(async j => ({
      title: await translateForLocale(j.title || '', locale),
      date: j.subtitle || '',
      desc: await translateForLocale(j.desc || '', locale),
      image: j.image,
      rotation: j.rotation || 0,
    })))
    : undefined;

  const tourPackages = await getPublicTourPackages(locale);
  const dayTours = tourPackages.filter((pkg) => pkg.type === 'day-tour');
  const multiDayTours = tourPackages.filter((pkg) => pkg.type === 'multi-day' || pkg.type === 'custom');

  return (
    <main className="relative bg-white min-h-screen">
      <Navbar />
      <Hero heroImages={heroSlides} />

      <section id="paket-tour" className="relative z-10 bg-background px-6 pt-24 pb-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl md:mb-14">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-accent-secondary">
              {t('title')}
            </p>
            <h2 className="font-serif text-4xl text-foreground md:text-6xl">{t('title')}</h2>
            <p className="mt-4 text-lg text-foreground/60">{t('description')}</p>
            <div className="mt-5 h-1 w-20 bg-accent-primary" />
          </div>

          <TourPackagesClient
            locale={locale}
            dayTours={dayTours}
            multiDayTours={multiDayTours}
          />
        </div>
      </section>

      <CommentsSection />

      <div className="relative z-10 bg-background">
        <Destinations items={destinations} />
      </div>

      <Journal items={journals} />
      <ContactSection />
      <Footer />
    </main>
  );
}
