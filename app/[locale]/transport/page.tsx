import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import StaticPageHeader from '../../../components/StaticPageHeader';
import { Users, Briefcase } from 'lucide-react';

export default function Transport() {
    const fleet = [
        { name: "Toyota Innova Reborn", type: "MPV", capacity: "6 Pax", image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800&auto=format&fit=crop" },
        { name: "Toyota Hiace Commuter", type: "Minibus", capacity: "14 Pax", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop" },
        { name: "Toyota Alphard", type: "Luxury MPV", capacity: "5 Pax", image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=800&auto=format&fit=crop" },
        { name: "Medium Bus", type: "Bus", capacity: "30 Pax", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <main className="bg-white min-h-screen">
            <Navbar />
            <StaticPageHeader
                title="Transport Services"
                current="Transport"
                image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2600"
            />
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-gray-600 text-lg">
                        Reliable and comfortable transportation for your journey in Manado. All our vehicles are well-maintained, air-conditioned, and include professional drivers.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {fleet.map((car, i) => (
                        <div key={i} className="flex flex-col md:flex-row bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="w-full md:w-1/2 h-64 overflow-hidden">
                                <img src={car.image} alt={car.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-serif font-bold mb-2">{car.name}</h3>
                                <p className="text-amber-600 font-bold uppercase text-xs tracking-widest mb-6">{car.type}</p>
                                <div className="flex items-center gap-6 text-gray-500 text-sm mb-8">
                                    <div className="flex items-center"><Users size={16} className="mr-2" /> {car.capacity}</div>
                                    <div className="flex items-center"><Briefcase size={16} className="mr-2" /> Luggage OK</div>
                                </div>
                                <button className="self-start px-6 py-3 bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-amber-600 transition-colors">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
