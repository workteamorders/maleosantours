
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import { Clock, MapPin, Bus, Utensils, Award, Users, Camera, Info, Check, X, ArrowLeft, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const tours: Record<string, any> = {
    'manado-city-tour': {
        title: "Manado City Tour & Manado Cuisine Lunch",
        slug: "manado-city-tour",
        duration: "5-6 Hours",
        description: "Manado City Tour exploring the best landmarks of the city, from the iconic Jesus Blessing Monument to the historic Chinatown and the vibrant downtown area. Finish with a delicious authentic Manado cuisine lunch.",
        image: "https://images.unsplash.com/photo-1596401057633-5b8095b6c33c?q=80&w=2000",
        itinerary: [
            {
                time: "Pick up",
                activity: "Tour participants will be picked up by a tour guide at the hotel/airport."
            },
            {
                time: "Stop 1",
                activity: "Head to Ring Road Citra Land area to see the 'Jesus Blessing Monument' up close. A statue of Jesus built in a floating position facing Manado city."
            },
            {
                time: "Stop 2",
                activity: "Proceed with City Tour: Visit Downtown Manado, Chinatown, and Ban Hin Kiong Temple (the oldest temple in Manado, built in the 18th century, ±300 years old)."
            },
            {
                time: "Stop 3",
                activity: "Visit the Sentrum Church (first Protestant church in North Sulawesi) and the World War II Monument (evidence of destruction in 1942)."
            },
            {
                time: "Lunch",
                activity: "Head to a local restaurant for Manado Cuisine Lunch (Halal)."
            },
            {
                time: "Stop 4",
                activity: "Visit MAKATETE HILLS located on a peak 200M above sea level for a panoramic view of Manado, Bunaken, and Manado Tua Island."
            },
            {
                time: "Drop off",
                activity: "Return to hotel or transfer to airport."
            }
        ],
        inclusions: [
            "Private AC Transportation",
            "Professional Tour Guide",
            "Entrance Fees",
            "Mineral Water",
            "Parking Fees",
            "Lunch (Manado Cuisine)"
        ],
        exclusions: [
            "Personal Expenses",
            "Tipping Guide & Driver",
            "Optional Tours"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=600",
            "https://images.unsplash.com/photo-1518182170546-07eb6db16f2f?q=80&w=600",
            "https://images.unsplash.com/photo-1590079083167-27e69733446e?q=80&w=600"
        ]
    }
};

const defaultTour = {
    title: "Tour Detail",
    duration: "Full Day",
    description: "Experience the beauty of North Sulawesi with our professional guides. Contact us for a detailed itinerary tailored to your preferences.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop",
    itinerary: [
        { time: "Morning", activity: "Pick up from hotel and proceed to the first destination." },
        { time: "Midday", activity: "Lunch at a local restaurant." },
        { time: "Afternoon", activity: "Continue the tour to scenic spots." },
        { time: "Evening", activity: "Return to hotel." }
    ],
    inclusions: ["Transportation", "Guide", "Entrance Fees", "Lunch"],
    exclusions: ["Personal Expenses", "Tips"],
    gallery: []
};


export default async function TourDetailPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
    const { category, slug } = await params;
    const tour = tours[slug] || { ...defaultTour, title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };

    return (
        <main className="bg-white min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title={tour.title}
                current={tour.title}
                image={tour.image}
            />

            <section className="py-16 md:py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-10">
                        <Link href={`/paket-tour/${category}`} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-2 mb-6">
                            <ArrowLeft size={16} /> Back to {category.replace(/-/g, ' ')}
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                            <div className="md:w-2/3">
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">{tour.title}</h1>

                                <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600 font-medium">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <Clock size={16} className="text-amber-500" />
                                        <span>{tour.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <MapPin size={16} className="text-amber-500" />
                                        <span>North Sulawesi</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <Utensils size={16} className="text-amber-500" />
                                        <span>Lunch Inc.</span>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-12 border-l-4 border-amber-500 pl-6">
                                    {tour.description}
                                </p>

                                <div className="mb-12">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Bus size={18} />
                                        </div>
                                        Itinerary Highlights
                                    </h3>
                                    <div className="space-y-0 relative border-l border-gray-200 ml-4 pl-8 md:pl-12">
                                        {tour.itinerary.map((item: any, i: number) => (
                                            <div key={i} className="mb-10 relative">
                                                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full border-4 border-white bg-amber-500 shadow-sm"></div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">{item.time}</span>
                                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">{item.activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-12">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Check size={18} className="text-green-500" /> Inclusions
                                        </h4>
                                        <ul className="space-y-3">
                                            {tour.inclusions.map((inc: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    {inc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <X size={18} className="text-red-500" /> Exclusions
                                        </h4>
                                        <ul className="space-y-3">
                                            {tour.exclusions.map((exc: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 bg-red-300 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    {exc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/3 sticky top-24">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] p-8 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Book This Tour</h3>
                                    <p className="text-gray-500 text-sm mb-6">Contact us for the best price tailored to your group size.</p>

                                    <a href={`https://wa.me/6282173738822?text=Hello, I am interested in ${tour.title}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 mb-4 group">
                                        <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                                        Chat on WhatsApp
                                    </a>

                                    <a href="mailto:info@maleosan.com" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors">
                                        Send Email Inquiry
                                    </a>

                                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-2">Need Help?</span>
                                        <p className="text-lg font-bold text-gray-900">+62 821-7373-8822</p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-100">
                                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Info size={16} /> Note</h4>
                                    <p className="text-sm text-amber-700 leading-relaxed">
                                        Itinerary is flexible and can be customized based on traffic, weather, and your specific requests.
                                    </p>
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
