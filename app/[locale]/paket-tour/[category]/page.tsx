
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';

const toursData: Record<string, any[]> = {
    'north-sulawesi': [
        {
            id: 'manado-city-tour',
            title: "Manado City Tour",
            description: "Explore the vibrant city of Manado, visit the Jesus Blessing Monument, Chinatown, Ban Hin Kiong Temple, and enjoy authentic Manado cuisine.",
            duration: "5-6 Hours",
            image: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=1000",
            price: "Contact Us"
        },
        {
            id: 'minahasa-highland-tour',
            title: "Minahasa Highland Tour",
            description: "Journey through the scenic highlands, visit the traditional market in Tomohon, Lake Linow with its changing colors, and the ancient Waruga stone graves.",
            duration: "8 Hours",
            image: "https://images.unsplash.com/photo-1544642050-46e2919aa74e?q=80&w=1000",
            price: "Contact Us"
        },
        {
            id: 'bunaken-island-sightseeing',
            title: "Bunaken Island Sightseeing",
            description: "Witness the spectacular underwater life of Bunaken National Marine Park. Perfect for snorkelers and non-divers alike.",
            duration: "Full Day",
            image: "https://images.unsplash.com/photo-1584351583369-6b8304020127?q=80&w=1000",
            price: "Contact Us"
        },
        {
            id: 'likupang-lihaga-island-tour',
            title: "Likupang Lihaga Island Tour",
            description: "Relax on the pristine white sands of Lihaga Island in Likupang. Crystal clear waters and untouched nature await.",
            duration: "Full Day",
            image: "https://images.unsplash.com/photo-1590079083167-27e69733446e?q=80&w=1000",
            price: "Contact Us"
        }
    ],
    'tangkoko': [
        {
            id: 'tangkoko-nature-reserve',
            title: "Tangkoko Nature Reserve Tour",
            description: "A guided trek into the jungle to spot the Tarsier (smallest primate), Black Macaques, Hornbills, and other endemic wildlife.",
            duration: "10-12 Hours",
            image: "https://images.unsplash.com/photo-1588874138676-4dae3d64e9a8?q=80&w=1000",
            price: "Contact Us"
        },
        {
            id: 'tangkoko-adventure-3d2n',
            title: "Tangkoko Adventure 3D2N",
            description: "Immersive 3-day adventure exploring the depths of the nature reserve with overnight stays near the park.",
            duration: "3 Days 2 Nights",
            image: "https://images.unsplash.com/photo-1582697816823-3829033327d9?q=80&w=1000",
            price: "Contact Us"
        }
    ],
    'makassar-toraja': [
        {
            id: 'toraja-makassar-4d3n',
            title: "Toraja - Makassar Tour 4D3N",
            description: "Cultural immersion into the highlands of Tana Toraja. Visit Lemo, Londa, Kete Kesu, and experience the unique funeral ceremonies.",
            duration: "4 Days 3 Nights",
            image: "https://images.unsplash.com/photo-1605703813953-f7036a5b6f00?q=80&w=1000",
            price: "Contact Us"
        },
        {
            id: 'toraja-makassar-5d4n',
            title: "Toraja - Makassar Tour 5D4N",
            description: "Extended tour covering more of South Sulawesi's wonders including Rammang-Rammang karst mountains and comprehensive Toraja exploration.",
            duration: "5 Days 4 Nights",
            image: "https://images.unsplash.com/photo-1598616259068-d6c5cc355df0?q=80&w=1000",
            price: "Contact Us"
        }
    ]
};

const categoryTitles: Record<string, string> = {
    'north-sulawesi': "Manado - Minahasa - Likupang",
    'tangkoko': "Tangkoko Adventure Tour",
    'makassar-toraja': "Makassar - Toraja"
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const tours = toursData[category] || [];
    const title = categoryTitles[category] || "Tour Packages";

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title={title}
                current={title}
                image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop"
            />

            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-12">
                        <Link href="/paket-tour" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-2 mb-4">
                            <ArrowRight className="transform rotate-180" size={16} /> Back to Categories
                        </Link>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{title}</h2>
                    </div>

                    {tours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.map((tour) => (
                                <Link href={`/paket-tour/${category}/${tour.id}`} key={tour.id} className="group">
                                    <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                        <div className="h-64 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                                                {tour.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                                {tour.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    <Clock size={14} />
                                                    {tour.duration}
                                                </div>
                                                <span className="text-amber-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Details <ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                            <p className="text-gray-500 text-lg">No tours found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
