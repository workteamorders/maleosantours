import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function TransportPage() {
    const t = useTranslations('transport');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop"
                        alt="Transportation"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="font-serif text-6x1 text-white">{t('title')}</h1>
                    </div>
                </div>

                <div className="max-w-6xl">
                    <p className="text-xl text-gray-600 mb-12">
                        {t('description')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                <p className="text-gray-600 mb-6">
                                    {t('carDesc')}
                                </p>
                                <ul className="space-y-2 text-gray-700 mb-6">
                                    <li>• Toyota Avanza</li>
                                    <li>• Toyota Innova</li>
                                    <li>• Toyota Fortuner</li>
                                    <li>• Toyota Alphard (Premium)</li>
                                </ul>
                                <p className="text-sm text-gray-500">
                                    {t('includes')}
                                </p>
                            </div>
                        </div>

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
