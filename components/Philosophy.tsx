'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Philosophy() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const textElement = textRef.current;
        if (!textElement) return;

        // Create spans for each word to animate them later if needed, 
        // or just use background-clip approach for fill.
        // Brief says: "Text is initially Outlined (Stroke only) -> As user scrolls, text fills with Deep Graphite color from left to right"

        // Approach: Use background-clip: text with duplicate text on top, reveal top with clip-path.
        // Or linear-gradient background that moves.

        gsap.to(textElement, {
            backgroundImage: 'linear-gradient(90deg, #2A2A2A 0%, #2A2A2A 100%, transparent 100%)', // Hard stop
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
            },
            // Animate background-size or position?
            // Better: animate background-size from 0% 100% to 100% 100%
            backgroundSize: '100% 100%',
            ease: 'none',
        });

    }, []);

    return (
        <section ref={containerRef} className="py-32 px-6 md:px-20 min-h-[80vh] flex items-center justify-center bg-background">
            <div className="max-w-6xl mx-auto text-center">
                <p className="text-sm uppercase tracking-widest text-accent-secondary mb-8">Our Philosophy</p>
                <h2
                    ref={textRef}
                    className="text-4xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text leading-tight"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #2A2A2A 0%, #2A2A2A 50%, transparent 50%)',
                        backgroundSize: '0% 100%',
                        backgroundRepeat: 'no-repeat',
                        WebkitTextStroke: '1px #D1D1D1', // Stroke color
                    }}
                >
                    We curate journeys that breathe with the <span className="italic font-light text-accent-primary">rhythm of nature.</span>
                </h2>
            </div>
        </section>
    );
}
