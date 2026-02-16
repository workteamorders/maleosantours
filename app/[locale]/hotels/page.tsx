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
import { Hotel } from '@/src/types';

export default function HotelsPage() {
    const t = useTranslations('hotels');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await apiClient.getHotels();
                if (data && data.length > 0) {
                    setHotels(data);
                }
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    // Helper to render stars
    const renderStars = (rating: number = 5) => {
        return '⭐'.repeat(Math.max(1, Math.min(5, rating)));
    };

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10 pb-20">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=600&fit=crop"
                        alt="Luxury Hotel"
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
                                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                                    <div className="bg-gray-200 h-4 w-full rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <div key={hotel.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={hotel.thumbnail || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop"}
                                                alt={hotel.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-2xl mb-3 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                                                {hotel.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <span className="text-sm text-gray-400">{renderStars(hotel.rating)}</span>
                                                <span className="font-sans font-bold text-gray-900">
                                                    {hotel.currency} {hotel.pricePerNight.toLocaleString()}
                                                    <span className="text-xs font-normal text-gray-500"> /night</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback to original mock if no data
                                <>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative h-48">
                                            <Image
                                                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop"
                                                alt="Luxury Hotel"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-2xl mb-4">{t('luxury')}</h3>
                                            <p className="text-gray-600 mb-4">
                                                {t('luxuryDesc')}
                                            </p>
                                            <span className="text-sm text-gray-500">⭐⭐⭐⭐⭐</span>
                                        </div>
                                    </div>
                                    {/* ... existing mock items can be kept or removed once verified ... */}
                                </>
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
                                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"
                                    alt="Boutique Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('boutique')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('boutiqueDesc')}
                                </p>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop"
                                    alt="Beach Resort"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('beach')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('beachDesc')}
                                </p>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop"
                                    alt="Budget Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('budget')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('budgetDesc')}
                                </p>
                                <span className="text-sm text-gray-500">⭐⭐⭐</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"
                                    alt="Family Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('family')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('familyDesc')}
                                </p>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                        </div>

                        <div className="border border-gray-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"
                                    alt="Business Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('business')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('businessDesc')}
                                </p>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
