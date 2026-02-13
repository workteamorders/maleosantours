'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const destinations = [
    {
        title: "Likupang Lihaga",
        category: "Island",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2670&auto=format&fit=crop",
        year: "2024"
    },
    {
        title: "Pantai Paal",
        category: "Beach",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop",
        year: "2024"
    },
    {
        title: "Bukit Savana",
        category: "Nature",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2674&auto=format&fit=crop",
        year: "2024"
    },
    {
        title: "Air Terjun Tunan",
        category: "Waterfall",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2670&auto=format&fit=crop",
        year: "2024"
    },
    {
        title: "Pagoda Ekayana",
        category: "Culture",
        image: "https://images.unsplash.com/photo-1518182170546-0766ce6cba3b?q=80&w=2670&auto=format&fit=crop", // Pagoda placeholder
        year: "2023"
    }
];

export default function Destinations() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4 md:gap-10 pl-4 md:pl-20 pr-4 md:pr-20">
                    {destinations.map((dest, i) => (
                        <div key={i} className="group relative h-[60vh] md:h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-105">
                                <img src={dest.image} alt={dest.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 bg-gradient-to-t from-black/60 to-transparent text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-2xl md:text-4xl font-serif mb-2">{dest.title}</h3>
                                <p className="font-sans text-xs md:text-sm uppercase tracking-widest">{dest.category} — {dest.year}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
