'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const [time, setTime] = useState<string>('');
    const t = useTranslations('footer');

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Makassar' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-foreground text-background py-16 md:py-32 px-6 md:px-20 min-h-[50vh] md:min-h-[80vh] flex flex-col justify-between">
            {/* Big Button */}
            <div className="flex flex-col items-center justify-center flex-grow py-10">
                <motion.button
                    className="relative px-10 md:px-20 py-6 md:py-10 text-3xl md:text-[8vw] font-serif leading-none border border-background/20 rounded-full overflow-hidden group mix-blend-difference"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10 mix-blend-difference">{t('letsTalk')}</span>
                    <div className="absolute inset-0 bg-background scale-0 group-hover:scale-150 rounded-full transition-transform duration-700 ease-[0.19,1,0.22,1]" />
                </motion.button>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 border-t border-background/20 pt-10 text-xs md:text-sm font-sans uppercase tracking-widest text-background/60">
                <div className="col-span-1">
                    <p className="text-background">Manado, Indonesia</p>
                    <p>{time} WITA</p>
                </div>
                <div className="col-span-1">
                    <p>{t('contact')}</p>
                    <a href="tel:+6282173738822" className="block hover:text-background transition-colors">+62 821-7373-8822</a>
                    <a href="mailto:info@maleosantravel.com" className="block hover:text-background transition-colors lowercase">info@maleosantravel.com</a>
                </div>
                <div className="col-span-1">
                    <p>{t('socials')}</p>
                    <div className="flex flex-col gap-1">
                        <a href="https://instagram.com/maleosantravel" className="hover:text-background transition-colors">Instagram</a>
                        <a href="https://facebook.com/maleosantravel" className="hover:text-background transition-colors">Facebook</a>
                        <a href="https://tiktok.com/@maleosantravel" className="hover:text-background transition-colors">TikTok</a>
                        <a href="https://youtube.com/channel/UCFjvpEJe9QTYuBJ-0IrW03w" className="hover:text-background transition-colors">YouTube</a>
                    </div>
                </div>
                <div className="col-span-1 text-left md:text-left">
                    <p>© 2026 Maleosan Travel</p>
                    <p>{t('allRights')}</p>
                </div>
            </div>
        </footer>
    );
}
