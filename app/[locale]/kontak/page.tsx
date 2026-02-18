import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import StaticPageHeader from '../../../components/StaticPageHeader';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <main className="bg-white min-h-screen">
            <Navbar />
            <StaticPageHeader
                title="Contact Us"
                current="Contact"
                image="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2600"
            />
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-8 text-gray-900">Get in Touch</h2>
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            Have questions about our tour packages or need a custom itinerary?
                            We are here to help you plan your perfect trip to Manado and North Sulawesi.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="bg-amber-100 p-3 rounded-full mr-5 text-amber-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-sm">Phone / WhatsApp</h4>
                                    <p className="text-gray-600 text-lg">+62 821-7373-8822</p>
                                    <p className="text-gray-500 text-sm">Mon - Sun, 8am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-amber-100 p-3 rounded-full mr-5 text-amber-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-sm">Email</h4>
                                    <p className="text-gray-600 text-lg">info@maleosan.com</p>
                                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-amber-100 p-3 rounded-full mr-5 text-amber-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-sm">Office Address</h4>
                                    <p className="text-gray-600 text-lg">
                                        Jl. BW Lapian No. 8<br />
                                        Tikala, Manado<br />
                                        North Sulawesi, Indonesia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-8 border border-gray-200">
                        <h3 className="text-xl font-serif font-bold mb-6">Send us a Message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                                    <input type="text" className="w-full bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                    <input type="email" className="w-full bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors" placeholder="Your Email" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                                <input type="text" className="w-full bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors" placeholder="Subject" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                                <textarea className="w-full bg-white border border-gray-300 px-4 py-3 h-32 focus:outline-none focus:border-amber-500 transition-colors" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 bg-amber-600 text-white font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Frame */}
            <div className="w-full h-96 bg-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127602.82736418462!2d124.76718165609652!3d1.4748304999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3287742d4a514d23%3A0x4030bfbcaf780c0!2sManado%2C%20Manado%20City%2C%20North%20Sulawesi!5e0!3m2!1sen!2sid!4v1707923410123!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <Footer />
        </main>
    );
}
