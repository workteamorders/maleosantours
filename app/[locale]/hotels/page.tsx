import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function HotelsPage() {
    const t = await getTranslations('hotels');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=600&fit=crop"
                        alt="Luxury Hotel"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="font-serif text-6xl text-white">{t('title')}</h1>
                    </div>
                </div>

                <div className="max-w-6xl">
                    <p className="text-xl text-gray-600 mb-12">
                        {t('description')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
