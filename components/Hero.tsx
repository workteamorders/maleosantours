'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImage {
    url: string;
    title?: string | null;
    rotation?: number;
}

interface HeroProps {
    heroImages?: string[];
}

const DEFAULT_IMAGES: HeroImage[] = [{ url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop', title: null, rotation: 0 }];
const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export default function Hero({ heroImages }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('hero');

    const [images, setImages] = useState<HeroImage[]>(
        heroImages && heroImages.length > 0 
            ? heroImages.map(url => ({ url, title: null, rotation: 0 })) 
            : DEFAULT_IMAGES
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

    // Fetch from API if no props provided
    useEffect(() => {
        if (!heroImages || heroImages.length === 0) {
            fetch('/api/homepage?section=hero')
                .then(res => res.json())
                .then(items => {
                    if (items.length > 0) {
                        setImages(items.map((i: any) => ({ 
                            url: i.image, 
                            title: i.title || null, 
                            rotation: i.rotation || 0 
                        })));
                    }
                })
                .catch(() => {});
        }
    }, [heroImages]);

    const currentImage = images[currentIndex]?.url || DEFAULT_IMAGES[0].url;
    const currentTitle = images[currentIndex]?.title;
    const currentRotation = images[currentIndex]?.rotation || 0;

    // Navigate to next/prev slide
    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || images.length <= 1) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [isTransitioning, images.length]);

    const nextSlide = useCallback(() => {
        goToSlide((currentIndex + 1) % images.length);
    }, [currentIndex, images.length, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide((currentIndex - 1 + images.length) % images.length);
    }, [currentIndex, images.length, goToSlide]);

    // Auto-slide
    useEffect(() => {
        if (images.length <= 1) return;
        autoSlideTimer.current = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
        return () => {
            if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        };
    }, [nextSlide, images.length]);

    // Reset auto-slide timer on manual navigation
    const resetAutoSlide = useCallback(() => {
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        autoSlideTimer.current = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    }, [nextSlide]);

    // Touch/swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    };

    // GSAP scroll effect
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                scrub: 1,
            },
        });

        tl.to(textRef.current, {
            scale: 50,
            opacity: 0,
            ease: 'power2.inOut',
        });

        tl.to(videoRef.current, {
            filter: 'brightness(1)',
        }, 0);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Images - Crossfade */}
            <div ref={videoRef} className="absolute inset-0 z-0">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img.url}
                        alt={img.title || `Hero ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out`}
                        style={{ 
                            opacity: i === currentIndex ? 1 : 0,
                            transform: img.rotation ? `rotate(${img.rotation}deg) scale(1.3)` : undefined,
                            transformOrigin: 'center center',
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Title Overlay */}
            {currentTitle && (
                <div className="absolute inset-0 z-[25] flex items-end justify-center pb-32 pointer-events-none">
                    <div className="text-center px-6">
                        <h2 
                            className={`font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 ease-out ${
                                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.4)' }}
                        >
                            {currentTitle}
                        </h2>
                        <div 
                            className={`mt-3 h-[2px] mx-auto bg-white/70 transition-all duration-700 delay-200 ${
                                isTransitioning ? 'w-0 opacity-0' : 'w-24 md:w-36 opacity-100'
                            }`} 
                        />
                    </div>
                </div>
            )}

            {/* Navigation Arrows (only if multiple images) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => { prevSlide(); resetAutoSlide(); }}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => { nextSlide(); resetAutoSlide(); }}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { goToSlide(i); resetAutoSlide(); }}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/40 hover:bg-white/60'
                                }`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Text Overlay */}
            <div className="absolute inset-0 z-10 bg-background mix-blend-screen flex items-center justify-center pointer-events-none" />

            <h1 ref={textRef} className="z-20 text-[15vw] md:text-[10vw] font-serif font-bold text-transparent bg-clip-text bg-cover bg-center leading-none text-center select-none"
                style={{
                    backgroundImage: `url('${currentImage}')`,
                    backgroundAttachment: 'fixed',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }}
            >
                MALEOSAN<br />TRAVEL
            </h1>

            <div className="absolute bottom-10 left-0 right-0 text-center z-30">
                <p className="text-sm uppercase tracking-widest text-foreground/60">{t('scrollToExplore')}</p>
            </div>
        </div>
    );
}
