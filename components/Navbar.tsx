'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Menu as MenuIcon, Facebook, Youtube, Instagram, Phone, Mail, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const t = useTranslations('nav');
    const pathname = usePathname();

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
        {
            href: '/info-travel',
            label: "Travel Guides",
            subItems: [
                { href: '/info-travel/manado-guide', label: 'Manado Guide' },
                { href: '/info-travel/history-culture', label: 'History & Culture' },
                { href: '/info-travel/transportation', label: 'Transportation in Manado' },
                { href: '/info-travel/shopping', label: 'Shopping in Manado' },
                { href: '/info-travel/food-cuisine', label: 'Food & Cuisine' },
            ]
        },
        { href: '/paket-tour', label: t('paketTour') },
        { href: '/hotels', label: t('hotels') },
        { href: '/transport', label: t('transport') },
        { href: '/testimoni', label: t('testimoni') },
        { href: '/kontak', label: t('kontak') },
    ];

    return (
        <header className="relative z-50">
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                {/* Top Bar - Hidden on small screens */}
                <div className={`hidden md:flex justify-between items-center px-10 py-2 border-b transition-colors duration-300 ${isScrolled ? 'border-gray-100 text-gray-500' : 'border-white/10 text-white/70'} text-[10px] font-bold uppercase tracking-[0.2em]`}>
                    <div className="flex gap-8">
                        <a href="tel:+6282173738822" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                            <Phone size={12} /> +62 821-7373-8822
                        </a>
                        <a href="mailto:info@maleosan.com" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                            <Mail size={12} /> info@maleosan.com
                        </a>
                    </div>
                    <div className="flex gap-5">
                        <Link href="#" className="hover:text-amber-500 transition-colors"><Facebook size={14} /></Link>
                        <Link href="#" className="hover:text-amber-500 transition-colors"><Instagram size={14} /></Link>
                        <Link href="#" className="hover:text-amber-500 transition-colors"><Youtube size={14} /></Link>
                    </div>
                </div>

                <nav className={`flex justify-between items-center px-6 md:px-10 py-4 transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'}`}>
                    <Link href="/" className="font-serif font-bold text-2xl tracking-tighter hover:text-amber-500 z-50 transition-colors">MT.</Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex gap-8 text-[11px] font-bold font-sans uppercase tracking-[0.2em]">
                        {menuItems.map((item) => (
                            <div
                                key={item.href}
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link href={item.href} className="flex items-center gap-1 group">
                                    <span className={`hover:text-amber-500 block cursor-pointer transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
                                        {item.label}
                                    </span>
                                    {item.subItems && (
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''} ${isScrolled ? 'text-black' : 'text-white'} group-hover:text-amber-500`} />
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
                                </Link>

                                {/* Dropdown Menu */}
                                {item.subItems && (
                                    <div className={`absolute top-full left-0 pt-4 w-56 transition-all duration-300 transform origin-top ${activeDropdown === item.label ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                        <div className="bg-white shadow-xl border-t-2 border-amber-500 py-2 rounded-sm overflow-hidden">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className="block px-6 py-3 text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors normal-case tracking-normal font-medium text-xs border-b border-gray-50 last:border-0"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Switcher */}
                        <LanguageSwitcher isScrolled={isScrolled} />

                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={toggleMenu}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest z-50 backdrop-blur-sm transition-all ${isScrolled ? 'border-black bg-black text-white hover:bg-white hover:text-black' : 'border-white bg-white/10 text-white hover:bg-white hover:text-black'}`}
                        >
                            {isOpen ? <X size={14} /> : <><MenuIcon size={14} /> <span>Menu</span></>}
                        </motion.button>
                    </div>
                </nav>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="menu-overlay"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-center overflow-y-auto py-20"
                    >
                        <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">
                            {menuItems.map((item, index) => (
                                <div key={index} className="w-full text-center">
                                    <motion.div variants={linkVariants}>
                                        <Link
                                            href={item.href}
                                            onClick={toggleMenu}
                                            className="font-serif text-3xl md:text-5xl hover:text-amber-500 transition-colors text-white block mb-2"
                                        >
                                            {item.label}
                                        </Link>
                                        {/* Mobile Submenu */}
                                        {item.subItems && (
                                            <div className="flex flex-col gap-3 mt-2 mb-4 border-l border-white/20 ml-[50%] pl-4 text-left">
                                                {item.subItems.map((sub, sIndex) => (
                                                    <Link
                                                        key={sIndex}
                                                        href={sub.href}
                                                        onClick={toggleMenu}
                                                        className="text-sm uppercase tracking-widest text-white/60 hover:text-amber-500 transition-colors"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.5 } }}
                            className="mt-12 text-[10px] font-sans uppercase tracking-[0.3em] opacity-40 text-white flex flex-col items-center gap-4"
                        >
                            <span>Manado, North Sulawesi</span>
                            <div className="flex gap-6">
                                <Facebook size={16} />
                                <Instagram size={16} />
                                <Youtube size={16} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

