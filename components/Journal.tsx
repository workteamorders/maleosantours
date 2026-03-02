'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface JournalItem {
    title: string;
    date: string;
    desc: string;
    image: string;
    rotation?: number;
}

const defaultActivities: JournalItem[] = [
    {
        title: "MV Carnival Luminosa",
        date: "8 Okt, 2023",
        desc: "Kemewahan bertemu petualangan. Menjelajahi permata tersembunyi Manado.",
        image: "https://images.unsplash.com/photo-1548574505-5e239809ee19"
    },
    {
        title: "Fam Trip Kota Kinabalu",
        date: "Sep 2023",
        desc: "Mempererat hubungan dengan Kota Kinabalu. Penerbangan langsung dan wisata kota.",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b"
    },
    {
        title: "Raja Ampat Study Trip",
        date: "Agu 2023",
        desc: "Perjalanan pembelajaran dan pertukaran budaya di Bitung.",
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86"
    },
    {
        title: "Bunaken Diving Experience",
        date: "Juli 2023",
        desc: "Menemukan surga bawah laut Taman Nasional Bunaken.",
        image: "https://images.unsplash.com/photo-1582967788606-a171f1080cae"
    }
];

interface JournalProps {
    items?: JournalItem[];
}

export default function Journal({ items }: JournalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const [activities, setActivities] = useState<JournalItem[]>(items || defaultActivities);
    const t = useTranslations('journal');

    useEffect(() => {
        if (!items) {
            fetch('/api/homepage?section=journal')
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        setActivities(data.map((d: any) => ({
                            title: d.title || '',
                            date: d.subtitle || '',
                            desc: d.desc || '',
                            image: d.image,
                            rotation: d.rotation || 0,
                        })));
                    }
                })
                .catch(() => { });
        }
    }, [items]);

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]); // Faster scroll

    return (
        <section ref={containerRef} className="py-20 md:py-32 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 md:px-20">
                <h2 className="text-sm font-sans uppercase tracking-widest mb-10 md:mb-20 text-accent-secondary">{t('title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                    {/* Column 1 - Slower */}
                    <motion.div style={{ y: y1 }} className="flex flex-col gap-12 md:gap-32 md:pt-20">
                        {activities.filter((_, i) => i % 2 === 0).map((activity, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="overflow-hidden mb-4 md:mb-6 aspect-[3/4]">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        style={{ transform: activity.rotation ? `rotate(${activity.rotation}deg) scale(1.3)` : undefined, transformOrigin: 'center center' }}
                                    />
                                </div>
                                <span className="block text-xs font-sans uppercase tracking-widest text-foreground/50 mb-2">{activity.date}</span>
                                <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-accent-primary transition-colors">{activity.title}</h3>
                                <p className="font-sans text-sm text-foreground/70 leading-relaxed">{activity.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Column 2 - Faster (Parallax) */}
                    <motion.div style={{ y: y2 }} className="flex flex-col gap-12 md:gap-32">
                        {activities.filter((_, i) => i % 2 !== 0).map((activity, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="overflow-hidden mb-4 md:mb-6 aspect-[3/4]">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        style={{ transform: activity.rotation ? `rotate(${activity.rotation}deg) scale(1.3)` : undefined, transformOrigin: 'center center' }}
                                    />
                                </div>
                                <span className="block text-xs font-sans uppercase tracking-widest text-foreground/50 mb-2">{activity.date}</span>
                                <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-accent-primary transition-colors">{activity.title}</h3>
                                <p className="font-sans text-sm text-foreground/70 leading-relaxed">{activity.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
