'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DestinationItem {
    title: string;
    category: string;
    image: string;
    year: string;
    rotation?: number;
}

interface DestinationsProps {
    items?: DestinationItem[];
}

export default function Destinations({ items }: DestinationsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [dragConstraint, setDragConstraint] = useState(0);
    const t = useTranslations('destinations');

    const defaultDestinations: DestinationItem[] = [
        {
            title: "Likupang Lihaga",
            category: t('island'),
            image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2670&auto=format&fit=crop",
            year: "2024"
        },
        {
            title: "Pantai Paal",
            category: t('beach'),
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop",
            year: "2024"
        },
        {
            title: "Bukit Savana",
            category: t('nature'),
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2674&auto=format&fit=crop",
            year: "2024"
        },
        {
            title: "Air Terjun Tunan",
            category: t('waterfall'),
            image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2670&auto=format&fit=crop",
            year: "2024"
        },
        {
            title: "Pagoda Ekayana",
            category: t('culture'),
            image: "https://images.unsplash.com/photo-1518182170546-0766ce6cba3b?q=80&w=2670&auto=format&fit=crop",
            year: "2023"
        }
    ];

    const [destinations, setDestinations] = useState<DestinationItem[]>(items || defaultDestinations);

    useEffect(() => {
        if (!items) {
            fetch('/api/homepage?section=destination')
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        setDestinations(data.map((d: any) => ({
                            title: d.title || '',
                            category: d.subtitle || '',
                            image: d.image,
                            year: new Date(d.createdAt).getFullYear().toString(),
                            rotation: d.rotation || 0,
                        })));
                    }
                })
                .catch(() => { });
        }
    }, [items]);

    // Calculate drag constraints based on inner content vs container width
    useEffect(() => {
        const calcConstraint = () => {
            if (containerRef.current && innerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const innerWidth = innerRef.current.scrollWidth;
                setDragConstraint(Math.min(0, -(innerWidth - containerWidth)));
            }
        };
        calcConstraint();
        window.addEventListener('resize', calcConstraint);
        return () => window.removeEventListener('resize', calcConstraint);
    }, [destinations]);

    return (
        <section className="relative bg-background py-10 md:py-20">
            <div
                ref={containerRef}
                className="overflow-hidden cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    ref={innerRef}
                    drag="x"
                    dragConstraints={{ left: dragConstraint, right: 0 }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                    className="flex gap-4 md:gap-10 pl-4 md:pl-20 pr-4 md:pr-20"
                >
                    {destinations.map((dest, i) => (
                        <div key={i} className="group relative h-[60vh] md:h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden select-none">
                            <div className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-105">
                                <img src={dest.image} alt={dest.title} className="h-full w-full object-cover pointer-events-none select-none" draggable={false} style={{ transform: dest.rotation ? `rotate(${dest.rotation}deg) scale(1.3)` : undefined, transformOrigin: 'center center' }} />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 bg-gradient-to-t from-black/60 to-transparent text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-2xl md:text-4xl font-serif mb-2">{dest.title}</h3>
                                <p className="font-sans text-xs md:text-sm uppercase tracking-widest">{dest.category}{' \u2014 '}{dest.year}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
