'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
    {
        title: "Travel Info",
        desc: "Destinations, History, Culture, Transport & Food",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963" // Cinque Terre like
    },
    {
        title: "Daily Tours",
        desc: "Curated Day Trips & Excursions",
        image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9" // Venice like
    },
    {
        title: "Hotels & Resorts",
        desc: "Luxury Accommodations & Stays",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945" // Luxury Hotel
    },
    {
        title: "Transportation",
        desc: "Private Cars & Bus Rentals",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d" // Driving
    }
];

export default function Services() {
    const [activeService, setActiveService] = useState<number | null>(null);

    return (
        <section className="relative py-20 min-h-screen bg-limestone flex flex-col justify-center overflow-hidden">
            {/* Background Image Area */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <AnimatePresence mode="wait">
                    {activeService !== null && (
                        <motion.div
                            key={activeService}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={services[activeService].image}
                                alt="Service Background"
                                className="w-full h-full object-cover grayscale opacity-50"
                            />
                            <div className="absolute inset-0 bg-limestone/80 mix-blend-overlay" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="container mx-auto px-6 md:px-20 z-10 relative">
                <h2 className="text-sm font-sans uppercase tracking-widest mb-12 text-accent-secondary">Our Services</h2>
                <div className="flex flex-col border-t border-border">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setActiveService(index)}
                            onMouseLeave={() => setActiveService(null)}
                            className="group border-b border-border py-10 cursor-pointer flex justify-between items-center transition-all duration-300 hover:pl-10"
                        >
                            <h3 className="text-4xl md:text-6xl font-serif text-foreground group-hover:text-accent-primary transition-colors">
                                {service.title}
                            </h3>
                            <p className="hidden md:block text-sm font-sans uppercase tracking-widest text-foreground/60 group-hover:text-foreground transition-colors">
                                {service.desc}
                            </p>
                            <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                &rarr;
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
