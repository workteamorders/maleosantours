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
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('luxury')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop"
                                    alt="Luxury Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('luxuryDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('boutique')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"
                                    alt="Boutique Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('boutiqueDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('beach')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop"
                                    alt="Beach Resort"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('beachDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('budget')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop"
                                    alt="Budget Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('budgetDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('family')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"
                                    alt="Family Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('familyDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="font-serif text-2xl">{t('business')}</h3>
                                <span className="text-sm text-gray-500">⭐⭐⭐⭐</span>
                            </div>
                            <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"
                                    alt="Business Hotel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    {t('businessDesc')}
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
