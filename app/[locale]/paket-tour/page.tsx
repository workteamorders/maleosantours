import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function PaketTourPage() {
    const t = useTranslations('paketTour');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop"
                        alt="Tour Package"
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
                                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop"
                                    alt="Minahasa Highland"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl mb-4">{t('minahasa')}</h3>
                                <p className="text-gray-600 mb-4">
                                    {t('minahasaDesc')}
                                </p>
                                <span className="text-sm text-gray-500">1 Day</span>
                            </div>
                        </div>

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
