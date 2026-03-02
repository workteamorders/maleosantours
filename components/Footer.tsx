'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CompanyInfo {
    phone?: string;
    phoneDisplay?: string;
    email?: string;
    addressId?: string;
    addressEn?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

export default function Footer() {
    const [time, setTime] = useState<string>('');
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const t = useTranslations('footer');

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Makassar' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch('/api/company-info')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setCompanyInfo(data);
            })
            .catch(() => { });
    }, []);

    const phone = companyInfo?.phone || '+62-852-4108-5050';
    const phoneDisplay = companyInfo?.phoneDisplay || phone;
    const email = companyInfo?.email || 'info@maleosan.com';
    const addressShort = companyInfo?.addressId?.split('\n')[0] || 'Manado, Indonesia';

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
                    <p className="text-background">{addressShort}</p>
                    <p>{time} WITA</p>
                </div>
                <div className="col-span-1">
                    <p>{t('contact')}</p>
                    <a href={`tel:${phone}`} className="block hover:text-background transition-colors">{phoneDisplay}</a>
                    <a href={`mailto:${email}`} className="block hover:text-background transition-colors lowercase">{email}</a>
                </div>
                <div className="col-span-1">
                    <p>{t('socials')}</p>
                    <div className="flex flex-col gap-1">
                        {companyInfo?.instagram && (
                            <a href={companyInfo.instagram} className="hover:text-background transition-colors">Instagram</a>
                        )}
                        {companyInfo?.facebook && (
                            <a href={companyInfo.facebook} className="hover:text-background transition-colors">Facebook</a>
                        )}
                        {companyInfo?.twitter && (
                            <a href={companyInfo.twitter} className="hover:text-background transition-colors">TikTok</a>
                        )}
                        {companyInfo?.youtube && (
                            <a href={companyInfo.youtube} className="hover:text-background transition-colors">YouTube</a>
                        )}
                        {!companyInfo && (
                            <>
                                <span className="text-background/30">Instagram</span>
                                <span className="text-background/30">Facebook</span>
                                <span className="text-background/30">YouTube</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-span-1 text-left md:text-left">
                    <p>© 2026 Maleosan Tours Manado</p>
                    <p>{t('allRights')}</p>
                    <Link href="/admin/login" className="mt-4 inline-block hover:text-background transition-colors opacity-40 hover:opacity-100 text-[10px]">
                        {t('adminLogin')}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
