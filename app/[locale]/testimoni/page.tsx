import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
    // Content inspired by typical travel testimonials for Manado
    const testimonials = [
        {
            name: "Sarah Jenkins",
            location: "United Kingdom",
            text: "The Minahasa Highland tour resolved all our expectations! Our guide was incredibly knowledgeable about the local culture and history. The lunch by Lake Linow was a highlight—absolute serenity.",
            date: "October 2023",
            rating: 5
        },
        {
            name: "Zhang Wei",
            location: "China",
            text: "Bunaken diving is world-class, and Maleosan Travel organized everything perfectly. The equipment was top-notch, and the dive masters were very professional. Highly recommended for any diver visiting North Sulawesi!",
            date: "September 2023",
            rating: 5
        },
        {
            name: "Budi Santoso",
            location: "Jakarta, Indonesia",
            text: "Pelayanan sangat ramah dan profesional. Mobil bersih dan driver on time. Kami sangat menikmati tour culinary di Manado. Terima kasih Maleosan sudah membuat liburan keluarga kami berkesan.",
            date: "August 2023",
            rating: 5
        },
        {
            name: "Michael & Emma",
            location: "Australia",
            text: "We had a fantastic time in Manado. The Tangkoko Nature Reserve tour was magical—we actually saw the Tarsiers! The guide knew exactly where to look. A truly unique experience.",
            date: "July 2023",
            rating: 4
        },
        {
            name: "Anita R.",
            location: "Singapore",
            text: "Arranged a private car charter for 3 days. The driver was safe, polite, and knew all the best shortcuts. It made exploring Minahasa so much easier.",
            date: "June 2023",
            rating: 5
        },
        {
            name: "Thomas Mueller",
            location: "Germany",
            text: "The Tomohon market is intense but fascinating! Our guide explained everything so well. The flower garden visit afterwards was a beautiful contrast.",
            date: "May 2023",
            rating: 5
        }
    ];

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title="Guest Experiences"
                current="Testimonials"
                image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2600"
            />

            <section className="py-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-amber-600 uppercase tracking-[0.2em] text-sm font-semibold">What People Say</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-medium text-gray-900">Stories from Our Travelers</h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testi, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                                <div className="flex gap-1 text-amber-400 mb-6">
                                    {[...Array(testi.rating)].map((_, r) => (
                                        <Star key={r} size={16} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <Quote size={32} className="text-gray-200 mb-4 group-hover:text-amber-100 transition-colors" />
                                <p className="text-gray-600 leading-relaxed mb-6 italic">"{testi.text}"</p>

                                <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-serif text-lg font-medium text-gray-900">{testi.name}</h4>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">{testi.location}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">{testi.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
