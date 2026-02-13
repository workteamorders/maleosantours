'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('hero');

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
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
            {/* Background Video/Image */}
            <div ref={videoRef} className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop"
                    alt="Manado Nature"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Text Mask - using mix-blend-mode to cut out text? 
          Actually, simple scale of text with background clip is tricky. 
          Better: The text is white, background is white. 
          Wait, the brief says "Curtain of Alabaster". 
          So we have a layer of Alabaster on top of the image. 
          The text "Welcome Manado" cuts through the Alabaster to show the image.
      */}
            <div className="absolute inset-0 z-10 bg-background mix-blend-screen flex items-center justify-center pointer-events-none">
                {/* This doesn't quite work for 'cutting out'. 
              Standard way: Text with background-image same as fixed bg, formatted with background-clip: text.
              But scaling that is hard.
              
              Alternative: SVG Mask.
          */}
            </div>

            {/* 
         Simplified approach for "Text Reveal":
         Text is huge, centered. 
         As you scroll, the text scales UP (zooms in) until you go through a letter hole into the image.
      */}
            <h1 ref={textRef} className="z-20 text-[15vw] md:text-[10vw] font-serif font-bold text-transparent bg-clip-text bg-cover bg-center leading-none text-center select-none"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop')",
                    backgroundAttachment: 'fixed', // Reverting to fixed for desktop cutout effect; mobile might need specific handling but transparent text is key.
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
