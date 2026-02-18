import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import StaticPageHeader from '../../../components/StaticPageHeader';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Hotels() {
    const hotels = [
        { name: "Four Points by Sheraton", rating: 5, location: "Manado City Center", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
        { name: "Sintesa Peninsula", rating: 5, location: "Manado City", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800" },
        { name: "Novotel Manado", rating: 4, location: "Golf Resort", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
        { name: "Mercure Manado", rating: 4, location: "Tateli Beach", image: "https://images.unsplash.com/photo-1571896349842-6e53ce41be03?auto=format&fit=crop&q=80&w=800" },
        { name: "Swiss-Belhotel Maleosan", rating: 4, location: "Manado City", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800" },
        { name: "Grand Luley", rating: 5, location: "Bunaken Access", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
    ];

    return (
        <main className="bg-white min-h-screen">
            <Navbar />
            <StaticPageHeader
                title="Hotels & Resorts"
                current="Hotels"
                image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2600"
            />
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-gray-600 text-lg">
                        We partner with the best hotels and resorts in Manado to ensure your stay is comfortable and luxurious. From city center business hotels to secluded beach resorts.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hotels.map((hotel, i) => (
                        <Link href={`/hotels/${hotel.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="group block">
                            <div className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden h-full flex flex-col">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 flex items-center gap-1 text-xs font-bold text-amber-500 rounded-sm z-20 shadow-sm">
                                        <Star size={12} fill="currentColor" /> {hotel.rating}.0
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-amber-600 transition-colors">{hotel.name}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mb-6">
                                        <MapPin size={14} className="mr-2 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                        {hotel.location}
                                    </div>
                                    <div className="mt-auto">
                                        <button className="w-full py-3 border border-gray-200 text-gray-800 font-bold uppercase text-xs tracking-widest group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
