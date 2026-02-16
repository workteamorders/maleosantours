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
import { Transport } from '@/src/types';

export default function TransportPage() {
    const t = useTranslations('transport');
    const [transports, setTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransport = async () => {
            try {
                const data = await apiClient.getTransports();
                if (data && data.length > 0) {
                    setTransports(data);
                }
            } catch (error) {
                console.error('Failed to fetch transports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransport();
    }, []);

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10 pb-20">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop"
                        alt="Transportation"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                                    <div className="bg-gray-200 h-8 w-1/2 mb-4"></div>
                                    <div className="bg-gray-200 h-20 w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {transports.length > 0 ? (
                                transports.map((item) => (
                                    <div key={item.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={item.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop"}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                                {item.type}
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="font-serif text-3xl mb-4 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                {item.description}
                                            </p>
                                            
                                            {item.features && item.features.length > 0 && (
                                                <ul className="space-y-2 text-gray-700 mb-8 grid grid-cols-2">
                                                    {item.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                            <span className="text-sm">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                <div className="text-xs text-gray-400 uppercase tracking-widest">
                                                    {item.inclusions?.join(' • ')}
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-xs text-gray-400">Starting from</span>
                                                    <span className="font-sans font-bold text-xl">
                                                        {item.currency} {item.pricePerDay.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback mock
                                <>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative h-48">
                                            <Image
                                                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop"
                                                alt="Car Rental"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-8">
                                            <h3 className="font-serif text-3xl mb-4">{t('car')}</h3>
                                            <p className="text-gray-600 mb-6">{t('carDesc')}</p>
                                        </div>
                                    </div>
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
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop"
                                    alt="Bus"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="font-serif text-3xl mb-4">{t('bus')}</h3>
                                <p className="text-gray-600 mb-6">
                                    {t('busDesc')}
                                </p>
                                <ul className="space-y-2 text-gray-700 mb-6">
                                    <li>• AC and Audio System</li>
                                    <li>• Reclining Seats</li>
                                    <li>• Toilet</li>
                                    <li>• WiFi</li>
                                </ul>
                                <p className="text-sm text-gray-500">
                                    {t('busIncludes')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"
                                    alt="Airport Transfer"
                                    fill
                                    className="object-cover" />
                            </div>
                            <div className="p-8">
                                <h3 className="font-serif text-3xl mb-4">{t('airport')}</h3>
                                <p className="text-gray-600 mb-6">
                                    {t('airportDesc')}
                                </p>
                                <ul className="space-y-2 text-gray-700 mb-6">
                                    <li>• Sam Ratulangi Airport</li>
                                    <li>• Hotels in Manado</li>
                                    <li>• Hotels in Tomohon</li>
                                    <li>• Hotels in Bitung</li>
                                </ul>
                                <p className="text-sm text-gray-500">
                                    {t('airportIncludes')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop"
                                    alt="Motorcycle Rental"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="font-serif text-3xl mb-4">{t('motor')}</h3>
                                <p className="text-gray-600 mb-6">
                                    {t('motorDesc')}
                                </p>
                                <ul className="space-y-2 text-gray-700 mb-6">
                                    <li>• Scooter (Matic)</li>
                                    <li>• Manual</li>
                                    <li>• Standard Helmet</li>
                                    <li>• Raincoat</li>
                                </ul>
                                <p className="text-sm text-gray-500">
                                    {t('motorIncludes')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
