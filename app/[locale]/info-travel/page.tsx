import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function InfoTravelPage() {
    const t = useTranslations('infoTravel');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop"
                        alt="Manado Beach"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="font-serif text-6xl text-white">{t('title')}</h1>
                    </div>
                </div>

                <div className="max-w-4xl">
                    <p className="text-xl text-gray-600 mb-12">
                        {t('description')}
                    </p>

                    <div className="space-y-16">
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="font-serif text-3xl mb-4">{t('destinations')}</h2>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Likupang Lihaga</li>
                                    <li>• Pantai Paal Likupang</li>
                                    <li>• Bukit Savana Likupang</li>
                                    <li>• Matahari Terbenam di Kawasan Megamas Manado</li>
                                    <li>• Air Terjun Tunan</li>
                                    <li>• Pagoda Ekayana Tomohon</li>
                                    <li>• Monumen Trikora - Bitung</li>
                                    <li>• Patung Yesus sang Penebus</li>
                                </ul>
                            </div>
                            <div className="relative h-64 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
                                    alt="Beach Destination"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative h-64 rounded-lg overflow-hidden order-2 md:order-1">
                                <Image
                                    src="https://images.unsplash.com/photo-1555412654-72a95a495858?w=600&h=400&fit=crop"
                                    alt="Culture"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="order-1 md:order-2">
                                <h2 className="font-serif text-3xl mb-4">{t('history')}</h2>
                                <p className="text-gray-700">
                                    {t('historyDesc')}
                                </p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="font-serif text-3xl mb-4">{t('transport')}</h2>
                                <p className="text-gray-700">
                                    {t('transportDesc')}
                                </p>
                            </div>
                            <div className="relative h-64 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop"
                                    alt="Transportation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative h-64 rounded-lg overflow-hidden order-2 md:order-1">
                                <Image
                                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
                                    alt="Food"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="order-1 md:order-2">
                                <h2 className="font-serif text-3xl mb-4">{t('food')}</h2>
                                <p className="text-gray-700">
                                    {t('foodDesc')}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
