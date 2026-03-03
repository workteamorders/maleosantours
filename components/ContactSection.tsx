'use client';

import { useState, useEffect } from 'react';
import {
    Phone,
    Mail,
    MessageCircle,
    Instagram,
    Facebook,
    Youtube,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface CompanyInfo {
    phone?: string;
    phoneDisplay?: string;
    email?: string;
    addressId?: string;
    addressEn?: string;
    addressZh?: string;
    addressZhCn?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    googleMaps?: string;
}

export default function ContactSection() {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const t = useTranslations('kontak');
    const locale = useLocale();

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
    const whatsapp = companyInfo?.whatsapp || '6285241085050';

    // Multi-language address logic
    let address = companyInfo?.addressId || 'Swiss-Belhotel Maleosan Manado Arcade';
    if (locale === 'en') {
        address = companyInfo?.addressEn || address;
    } else if (locale === 'zh') {
        address = companyInfo?.addressZh || address;
    } else if (locale === 'zh-CN') {
        address = companyInfo?.addressZhCn || address;
    }

    const googleMapsUrl = companyInfo?.googleMaps || 'https://www.google.com/maps/search/?api=1&query=Swiss-Belhotel+Maleosan+Manado+Arcade';

    return (
        <section id="contact" className="relative z-10 bg-background py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-sm uppercase tracking-widest text-foreground/50 mb-3">{t('titleDesc')}</p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t('title')}</h2>
                    <div className="w-16 h-[2px] bg-accent-primary mx-auto mt-4" />
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                    {/* Phone */}
                    <a
                        href={`tel:${phone}`}
                        className="group flex items-center gap-4 p-5 rounded-xl border border-foreground/10 hover:border-accent-primary/40 hover:shadow-lg transition-all duration-300 bg-background"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Phone size={22} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-foreground/50 mb-0.5">{t('phone')}</p>
                            <p className="font-semibold text-foreground text-sm">{phoneDisplay}</p>
                        </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-5 rounded-xl border border-foreground/10 hover:border-green-400/40 hover:shadow-lg transition-all duration-300 bg-background"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <MessageCircle size={22} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-foreground/50 mb-0.5">{t('whatsapp')}</p>
                            <p className="font-semibold text-foreground text-sm">+{whatsapp}</p>
                        </div>
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:${email}`}
                        className="group flex items-center gap-4 p-5 rounded-xl border border-foreground/10 hover:border-amber-400/40 hover:shadow-lg transition-all duration-300 bg-background"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Mail size={22} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-foreground/50 mb-0.5">{t('email')}</p>
                            <p className="font-semibold text-foreground text-sm break-all">{email}</p>
                        </div>
                    </a>

                    {/* Address */}
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-5 rounded-xl border border-foreground/10 hover:border-red-400/40 hover:shadow-lg transition-all duration-300 bg-background"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                            <img
                                src="/logo_swissbell.png"
                                alt="Swissbelhotel Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-foreground/50 mb-0.5">{t('address')}</p>
                            <p className="font-semibold text-foreground text-sm line-clamp-2">{address.split('\n')[0]}</p>
                        </div>
                    </a>
                </div>

                {/* Social Media */}
                <div className="flex flex-wrap justify-center gap-4 mb-14">
                    {companyInfo?.instagram && (
                        <a
                            href={companyInfo.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/10 hover:border-pink-400/40 hover:bg-pink-50 transition-all text-sm font-medium text-foreground/70 hover:text-pink-600"
                        >
                            <Instagram size={18} /> Instagram
                        </a>
                    )}
                    {companyInfo?.facebook && (
                        <a
                            href={companyInfo.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/10 hover:border-blue-400/40 hover:bg-blue-50 transition-all text-sm font-medium text-foreground/70 hover:text-blue-600"
                        >
                            <Facebook size={18} /> Facebook
                        </a>
                    )}
                    {companyInfo?.youtube && (
                        <a
                            href={companyInfo.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/10 hover:border-red-400/40 hover:bg-red-50 transition-all text-sm font-medium text-foreground/70 hover:text-red-600"
                        >
                            <Youtube size={18} /> YouTube
                        </a>
                    )}
                    {companyInfo?.twitter && (
                        <a
                            href={companyInfo.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all text-sm font-medium text-foreground/70 hover:text-foreground"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.23 8.23 0 0 0 4.82 1.56V7a4.85 4.85 0 0 1-1.06-.31z" /></svg>
                            TikTok
                        </a>
                    )}
                </div>

                {/* QR Codes - WeChat & KakaoTalk */}
                <div className="flex flex-row justify-center items-start gap-4 sm:gap-12">
                    {/* WeChat QR */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-green-400/30 shadow-md bg-white flex items-center justify-center">
                            <img
                                src="/uploads/images/wechat-qr.jpg"
                                alt="WeChat QR Code - Vino (MANADO旅遊)"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector('.qr-fallback')) {
                                        const fallback = document.createElement('div');
                                        fallback.className = 'qr-fallback flex flex-col items-center justify-center text-gray-400 gap-2';
                                        fallback.innerHTML = '<span class="text-3xl">💬</span><span class="text-xs">WeChat QR</span>';
                                        parent.appendChild(fallback);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
                                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.118 2.369-.333a.72.72 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.108.24-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 0 1 .177-.554C23.414 18.127 24 16.55 24 14.896c0-3.472-3.36-5.986-7.062-6.038zm-2.036 2.906c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.072 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
                            </svg>
                            <span>WeChat</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-foreground/40 text-center">{t('scanHintWechat')}</p>
                    </div>

                    {/* KakaoTalk QR */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-yellow-400/30 shadow-md bg-white flex items-center justify-center">
                            <img
                                src="/uploads/images/kakaotalk-qr.jpg"
                                alt="KakaoTalk QR Code - Vino Manado"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector('.qr-fallback')) {
                                        const fallback = document.createElement('div');
                                        fallback.className = 'qr-fallback flex flex-col items-center justify-center text-gray-400 gap-2';
                                        fallback.innerHTML = '<span class="text-3xl">💬</span><span class="text-xs">KakaoTalk QR</span>';
                                        parent.appendChild(fallback);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FEE500">
                                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.725 1.792 5.107 4.478 6.457-.157.576-.57 2.088-.654 2.411-.102.398.146.393.308.286.127-.084 2.016-1.368 2.837-1.926A12.98 12.98 0 0 0 12 18.382c5.523 0 10-3.463 10-7.691C22 6.463 17.523 3 12 3z" />
                            </svg>
                            <span>KakaoTalk</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-foreground/40 text-center">{t('scanHintKakao')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
