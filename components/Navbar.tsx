'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Menu as MenuIcon } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { CurrencySelector } from './CurrencyProvider';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const t = useTranslations('nav');
    const pathname = usePathname();

    // Check if current page is homepage (root or /<locale>)
    const isHomePage = /^\/(?:id|en|zh|zh-CN)?$/.test(pathname);

    // Determine if we should use dark text (scrolled or not on homepage)
    const useDarkText = isScrolled || !isHomePage;

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const linkVariants = {
        closed: { y: 80, opacity: 0 },
        open: { y: 0, opacity: 1 }
    };

    const menuItems = [
        { href: '/', label: t('home') },
        { href: '/info-travel', label: t('infoTravel') },
        { href: '/paket-tour', label: t('paketTour') },
        { href: '/hotels', label: t('hotels') },
        { href: '/transport', label: t('transport') },
        { href: '/testimoni', label: t('testimoni') },
        { href: '/kontak', label: t('kontak') },
    ];

    return (
        <header className="relative z-50">
            <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 transition-colors duration-300 pointer-events-none ${useDarkText ? 'text-black' : 'text-white'}`}>
                <Link href="/" className="flex items-center gap-3 font-serif font-bold text-xl tracking-tighter hover:text-gray-500 z-50 pointer-events-auto">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        priority
                    />
                    MT.
                </Link>

                {/* Desktop Desktop Menu - Hidden on Mobile */}
                <div className="hidden md:flex gap-6 text-sm font-bold font-sans uppercase tracking-widest pointer-events-auto">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <motion.span whileHover={{ scale: 1.1 }} className={`hover:text-gray-500 block cursor-pointer transition-colors ${useDarkText ? 'text-black' : 'text-white'}`}>
                                {item.label}
                            </motion.span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Currency Selector */}
                    <CurrencySelector className={`${useDarkText ? 'text-black border-gray-400' : 'text-white border-white/50'} bg-transparent text-xs`} />

                    {/* Language Switcher */}
                    <LanguageSwitcher isScrolled={useDarkText} />

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={toggleMenu}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold z-50 backdrop-blur-sm transition-colors pointer-events-auto ${useDarkText ? 'border-black bg-white/20 hover:bg-white/40 text-black' : 'border-white bg-black/20 hover:bg-black/40 text-white'}`}
                    >
                        {isOpen ? <X size={16} /> : <div className="flex items-center gap-2">{t('menu')}</div>}
                    </motion.button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="menu-overlay"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md text-white flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-6">
                            {menuItems.map((item, index) => (
                                <div key={index} className="overflow-hidden">
                                    <motion.div variants={linkVariants}>
                                        <Link
                                            href={item.href}
                                            onClick={toggleMenu}
                                            className="font-serif text-5xl md:text-7xl hover:text-accent-primary transition-colors text-white"
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.5 } }}
                            className="absolute bottom-10 text-xs font-sans uppercase tracking-widest opacity-50 text-white"
                        >
                            {t('location')}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
