import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function KontakPage() {
    const t = useTranslations('kontak');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop"
                        alt="Contact"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-serif text-3xl mb-6">{t('contactInfo')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('phone')}</h3>
                                    <a href="tel:+6282173738822" className="text-gray-600 hover:text-blue-600">
                                        +62 821-7373-8822
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('email')}</h3>
                                    <a href="mailto:info@maleosantravel.com" className="text-gray-600 hover:text-blue-600">
                                        info@maleosantravel.com
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('address')}</h3>
                                    <p className="text-gray-600">
                                        Manado, Sulawesi Utara<br />
                                        Indonesia
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-4">{t('social')}</h3>
                                    <div className="flex gap-4">
                                        <a href="https://www.facebook.com/maleosantravel"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-600">
                                            Facebook
                                        </a>
                                        <a href="https://www.youtube.com/channel/UCFjvpEJe9QTYuBJ-0IrW03w"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-red-600">
                                            YouTube
                                        </a>
                                        <a href="https://www.instagram.com/maleosantravel"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-pink-600">
                                            Instagram
                                        </a>
                                        <a href="https://www.tiktok.com/@maleosantravel"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-black">
                                            TikTok
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl mb-6">{t('sendMessage')}</h2>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('name')}</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('email')}</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('emailPlaceholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder="Subject"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('message')}</label>
                                    <textarea
                                        rows={5}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('messagePlaceholder')}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors"
                                >
                                    {t('sendButton')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
