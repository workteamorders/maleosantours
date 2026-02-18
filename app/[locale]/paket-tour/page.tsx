import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PaketTourPage() {
    const categories = [
        {
            id: 'north-sulawesi',
            title: "Manado - Minahasa - Likupang",
            description: "Discover the breathtaking beauty of North Sulawesi. From the world-famous Bunaken Marine Park to the highlands of Minahasa and the pristine beaches of Likupang.",
            image: "https://images.unsplash.com/photo-1544642050-46e2919aa74e?q=80&w=2000",
            link: "/paket-tour/north-sulawesi"
        },
        {
            id: 'tangkoko',
            title: "Tangkoko Adventure Tour",
            description: "Immerse yourself in nature at the Tangkoko Nature Reserve. Encounter unique wildlife like the spectral tarsier, black macaques, and hornbills in their natural habitat.",
            image: "https://images.unsplash.com/photo-1588874138676-4dae3d64e9a8?q=80&w=2000",
            link: "/paket-tour/tangkoko"
        },
        {
            id: 'makassar-toraja',
            title: "Makassar - Toraja",
            description: "Experience the rich cultural heritage of South Sulawesi. Visit the mystical land of Tana Toraja with its unique funeral rites and traditional Tongkonan houses.",
            image: "https://images.unsplash.com/photo-1605703813953-f7036a5b6f00?q=80&w=2000",
            link: "/paket-tour/makassar-toraja"
        }
    ];

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title="Tour Packages"
                current="Packages"
                image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop"
            />

            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-semibold">Choose Your Adventure</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mt-4 mb-8">Curated Journeys</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We have carefully selected the best destinations in Sulawesi for you. Whether you love the sea, the mountains, or cultural experiences, we have the perfect package.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {categories.map((category) => (
                            <Link href={category.link} key={category.id} className="group cursor-pointer">
                                <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                    <div className="h-80 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow relative bg-white">
                                        <div className="absolute -top-10 right-8 bg-amber-500 w-16 h-16 flex items-center justify-center text-white shadow-lg group-hover:bg-gray-900 transition-colors duration-300">
                                            <ArrowRight size={24} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-500 mb-8 leading-relaxed text-sm flex-grow">
                                            {category.description}
                                        </p>

                                        <div className="mt-auto">
                                            <span className="inline-block text-xs font-bold uppercase tracking-widest border-b-2 border-amber-200 pb-1 group-hover:border-amber-500 transition-colors">
                                                Explore Packages
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

