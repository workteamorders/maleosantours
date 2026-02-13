import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function TestimoniPage() {
    const t = useTranslations('testimoni');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=600&fit=crop"
                        alt="Testimonials"
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
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=200&fit=crop"
                                    alt="Travel Experience"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">Sarah Wijaya</h3>
                                        <p className="text-sm text-gray-500">Jakarta</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Pengalaman yang luar biasa! Tim Maleosan Travel sangat profesional dan ramah.
                                    Paket tour Minahasa Highland sangat recommended."
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=200&fit=crop"
                                    alt="Snorkeling"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">John Tan</h3>
                                        <p className="text-sm text-gray-500">Singapore</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Bunaken snorkeling trip was amazing! The coral reefs are beautiful and
                                    guides were very knowledgeable. Highly recommended!"
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=200&fit=crop"
                                    alt="Road Trip"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">Maria Kusuma</h3>
                                        <p className="text-sm text-gray-500">Surabaya</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Sewa mobil dengan supir sangat membantu. Supirnya tahu tempat-tempat wisata
                                    terbaik dan memberikan rekomendasi kuliner yang enak."
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=200&fit=crop"
                                    alt="Beach Trip"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">David Chen</h3>
                                        <p className="text-sm text-gray-500">Kuala Lumpur</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Family trip to Likupang was perfect. The beach is pristine and kids
                                    loved it. Great service from start to finish!"
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=200&fit=crop"
                                    alt="Custom Tour"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">Rina Putri</h3>
                                        <p className="text-sm text-gray-500">Medan</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Paket custom tour sesuai budget saya. Timnya sangat fleksibel dan membantu
                                    merencanakan itinerary yang pas. Terima kasih Maleosan Travel!"
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=200&fit=crop"
                                    alt="Hotel Stay"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                    <div>
                                        <h3 className="font-semibold">Michael Lee</h3>
                                        <p className="text-sm text-gray-500">Hong Kong</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Excellent service! The hotel recommendations were perfect and
                                    transportation was very comfortable. Will definitely come back!"
                                </p>
                                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
