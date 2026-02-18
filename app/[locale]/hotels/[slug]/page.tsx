
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import { Star, MapPin, Wifi, Check, Info, Phone, Mail, ArrowLeft, Coffee, Waves, Tv, Wind } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const hotelsData: Record<string, any> = {
    'four-points-by-sheraton': {
        name: "Four Points by Sheraton",
        rating: 5,
        location: "Manado City Center (Boulevard)",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2600",
        description: "Experience luxury and comfort at Four Points by Sheraton Manado. Located in the heart of the city, offering breathtaking ocean views and easy access to shopping centers and business districts. The hotel features modern amenities, a rooftop infinity pool, and exceptional dining options.",
        amenities: ["Free Wi-Fi", "Infinity Pool", "Fitness Center", "Ocean View", "Restaurant & Bar", "24/7 Room Service", "Meeting Rooms"],
        gallery: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-6e53ce41be03?auto=format&fit=crop&q=80&w=800"
        ]
    }
};

const defaultHotel = {
    name: "Luxury Hotel Manado",
    rating: 4,
    location: "Manado Premium Location",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2600",
    description: "Enjoy a memorable stay with world-class facilities and warm hospitality. Perfect for both business and leisure travelers looking for comfort and convenience in Manado.",
    amenities: ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Air Conditioning", "Parking"],
    gallery: []
};

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const hotel = hotelsData[slug] || { ...defaultHotel, name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title={hotel.name}
                current={hotel.name}
                image={hotel.image}
            />

            <section className="py-16 md:py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8">
                        <Link href="/hotels" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-2 mb-6">
                            <ArrowLeft size={16} /> Back to Hotels
                        </Link>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Main Content */}
                            <div className="lg:w-2/3">
                                <div className="flex items-center gap-2 text-amber-500 mb-2">
                                    {[...Array(hotel.rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{hotel.name}</h1>

                                <div className="flex items-center text-gray-600 mb-8 border-b border-gray-100 pb-8">
                                    <MapPin size={18} className="mr-2 text-amber-500" />
                                    {hotel.location}
                                </div>

                                <div className="mb-12">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">About the Hotel</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                                        {hotel.description}
                                    </p>
                                </div>

                                <div className="mb-12">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Key Amenities</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {hotel.amenities.map((amenity: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-gray-700">
                                                {amenity.includes('Wi-Fi') ? <Wifi size={20} className="text-amber-500" /> :
                                                    amenity.includes('Pool') ? <Waves size={20} className="text-amber-500" /> :
                                                        amenity.includes('Restaurant') ? <Coffee size={20} className="text-amber-500" /> :
                                                            amenity.includes('Air') ? <Wind size={20} className="text-amber-500" /> :
                                                                <Check size={20} className="text-amber-500" />}
                                                <span className="text-sm font-medium">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gallery Grid */}
                                {hotel.gallery.length > 0 && (
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Gallery</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {hotel.gallery.map((img: string, i: number) => (
                                                <div key={i} className="rounded-lg overflow-hidden h-40 md:h-52">
                                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Booking Sidebar */}
                            <div className="lg:w-1/3">
                                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] sticky top-24">
                                    <div className="text-center mb-8">
                                        <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Starting From</span>
                                        <div className="bg-amber-50 inline-block px-4 py-1 rounded-full text-amber-700 font-bold text-sm mb-4">Best Rate Guarantee</div>
                                        <p className="text-gray-500 text-sm">Contact us for exclusive corporate and group rates.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <a href={`https://wa.me/6282173738822?text=I am interested in booking ${hotel.name}`} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 group">
                                            <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                                            Book via WhatsApp
                                        </a>
                                        <a href="mailto:info@maleosan.com" className="w-full bg-gray-100 text-gray-900 font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Mail size={18} />
                                            Email Inquiry
                                        </a>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <Info size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Prices and availability are subject to change. We recommend booking in advance, especially during peak seasons (July-August, December).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
