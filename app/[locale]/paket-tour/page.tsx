import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/src/services/api';
import { PaketTour } from '@/src/types';

export default function PaketTourPage() {
    const t = useTranslations('paketTour');
    const [tours, setTours] = useState<PaketTour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await apiClient.getPaketTours();
                if (data && data.length > 0) {
                    setTours(data);
                }
            } catch (error) {
                console.error('Failed to fetch tours:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10 pb-20">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop"
                        alt="Tour Package"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="font-serif text-6xl text-white tracking-tighter">{t('title')}</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl">
                        {t('description')}
                    </p>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                    <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
                                    <div className="bg-gray-200 h-4 w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.length > 0 ? (
                                tours.map((tour) => (
                                    <div key={tour.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={tour.thumbnail || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"}
                                                alt={tour.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-bold font-sans uppercase">
                                                {tour.duration} {tour.duration > 1 ? 'Days' : 'Day'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="font-serif text-2xl mb-3 group-hover:text-blue-600 transition-colors">{tour.name}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                                                {tour.description}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <div className="text-xs text-gray-400 uppercase tracking-widest">{tour.destination}</div>
                                                <div className="font-sans font-bold text-lg">
                                                    {tour.currency} {tour.priceAdult.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Original Mock Fallback
                                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop"
                                            alt="Minahasa Highland"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-2xl mb-4">{t('minahasa')}</h3>
                                        <p className="text-gray-600 mb-4">{t('minahasaDesc')}</p>
                                        <span className="text-sm text-gray-500">1 Day</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"
                                    alt="Bunaken Snorkeling"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('bunaken')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('bunakenDesc')}
                                </p>
                                <span className="text-sm text-gray-500">1 Day</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
                                    alt="Likupang Beach"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('likupang')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('likupangDesc')}
                                </p>
                                <span className="text-sm text-gray-500">1 Day</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop"
                                    alt="Manado City"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('manadoCity')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('manadoCityDesc')}
                                </p>
                                <span className="text-sm text-gray-500">Half Day</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1518182170546-07661fd94144?w=600&h=400&fit=crop"
                                    alt="Tomohon Volcano"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('tomohon')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('tomohonDesc')}
                                </p>
                                <span className="text-sm text-gray-500">1 Day</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
                                    alt="Custom Tour"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('custom')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('customDesc')}
                                </p>
                                <span className="text-sm text-gray-500">Flexible</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
