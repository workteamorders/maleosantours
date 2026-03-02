'use client';

import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, Star, Youtube, Instagram, Facebook } from 'lucide-react';

export default function HomeContent() {
    // Mocks based on WelcomeManado structure
    // Destinations Grid
    const destinations = [
        { title: 'Likupang Lihaga', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop' },
        { title: 'Bunaken Island', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop' },
        { title: 'Tomohon Highland', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop' },
        { title: 'Manado City', image: 'https://images.unsplash.com/photo-1518182170546-0766ce6cba3b?q=80&w=800&auto=format&fit=crop' },
        { title: 'Tangkoko Reserve', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800&auto=format&fit=crop' },
        { title: 'Siladen Island', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
    ];

    // Latest Activities (Blog style)
    const activities = [
        { title: 'Minahasa Highland Tour', date: 'Oct 8, 2023', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963', desc: 'Exploring the hidden gems of Minahasa Highland with MV Carnival Luminosa group.' },
        { title: 'Fam Trip Kota Kinabalu', date: 'Sep 15, 2023', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', desc: 'Welcoming the Fam Trip group from Kota Kinabalu to Manado and Bunaken.' },
    ];

    // Services
    const services = [
        { title: 'Info Travel', link: '/info-travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800', desc: 'Destinations, History, Culture, Transport' },
        { title: 'Daily Tours', link: '/paket-tour', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800', desc: 'Full Day & Half Day Tour Packages' },
        { title: 'Hotels & Resorts', link: '/hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', desc: 'Luxury Stays & Accommodations' },
        { title: 'Transport', link: '/transport', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800', desc: 'Car Rental & Bus Services' },
    ];

    // Gallery
    const gallery = [
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1518182170546-0766ce6cba3b',
    ];

    return (
        <div className="font-sans text-gray-800 bg-white">
            {/* Hero Section */}
            <div className="relative h-screen w-full bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop"
                    alt="Manado"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight">MALEOSAN TOURS MANADO</h1>
                    <p className="text-lg md:text-xl uppercase tracking-widest mb-8 max-w-2xl">Your Best Partner for Tour & Travel in Manado, North Sulawesi</p>
                    <Link href="/paket-tour" className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
                        Explore Tours
                    </Link>
                </div>
            </div>


            {/* Destinations Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Destinasi Wisata</h2>
                    <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, i) => (
                        <div key={i} className="group relative h-80 overflow-hidden cursor-pointer shadow-lg rounded-sm">
                            <img src={dest.image} alt={dest.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-2xl font-serif font-bold">{dest.title}</h3>
                                <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mt-1">Explore</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Activities Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Aktivitas & Tur Terbaru</h2>
                        <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {activities.map((act, i) => (
                            <div key={i} className="bg-white shadow-md p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow">
                                <div className="w-full md:w-1/3 h-48 overflow-hidden">
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-center text-amber-600 text-sm font-bold mb-2">
                                        <Calendar size={14} className="mr-2" />
                                        {act.date}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 hover:text-amber-600 cursor-pointer transition-colors">{act.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{act.desc}</p>
                                    <Link href="#" className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-amber-600">
                                        Read More <ArrowRight size={14} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Layanan Kami</h2>
                    <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((svc, i) => (
                        <div key={i} className="group text-center">
                            <div className="h-64 overflow-hidden mb-6 relative">
                                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{svc.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 h-10">{svc.desc}</p>
                            <Link href={svc.link} className="inline-block px-6 py-2 border border-gray-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors uppercase text-xs font-bold tracking-widest">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Us Preview */}
            <section className="py-20 bg-amber-500 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Tentang Kami</h2>
                    <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-10 opacity-90">
                        Maleosan Travel didedikasikan untuk memenuhi kebutuhan wisata individu dengan merencanakan liburan yang disesuaikan berdasarkan keinginan unik wisatawan. Kami menawarkan paket wisata, penerbangan, hotel, sewa mobil, dan aktivitas terbaik di Sulawesi Utara.
                    </p>
                    <Link href="/about" className="px-8 py-3 bg-white text-amber-600 font-bold uppercase hover:bg-gray-100 transition-colors inline-block">
                        Read Our Story
                    </Link>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold mb-2">Galeri Pelanggan</h2>
                    <p className="text-gray-500">Momen-momen indah bersama Maleosan Travel</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-200 overflow-hidden group">
                            <img src={`${img}?q=80&w=600&auto=format&fit=crop`} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/gallery" className="text-amber-600 font-bold hover:underline">View All Gallery &rarr;</Link>
                </div>
            </section>

            {/* Member Of Section */}
            <section className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Member Of</h3>
                    <div className="flex justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholders for logos (ASITA, INTOA, etc) */}
                        <div className="h-12 w-32 bg-gray-300 flex items-center justify-center font-bold text-white">ASITA</div>
                        <div className="h-12 w-32 bg-gray-300 flex items-center justify-center font-bold text-white">INTOA</div>
                        <div className="h-12 w-32 bg-gray-300 flex items-center justify-center font-bold text-white">ASTINDO</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
