'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from 'next-intl';

export default function Philosophy() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const locale = useLocale();

    const [content, setContent] = useState({
        title: 'Our Philosophy',
        tagline1: 'We curate journeys that breathe with the',
        tagline2: 'rhythm of nature.'
    });

    useEffect(() => {
        fetch('/api/company-info')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    // Logic to pick the right field based on locale
                    let title = data.philosophyTitleId;
                    let tag1 = data.philosophyTagline1Id;
                    let tag2 = data.philosophyTagline2Id;

                    if (locale === 'en') {
                        title = data.philosophyTitleEn || title;
                        tag1 = data.philosophyTagline1En || tag1;
                        tag2 = data.philosophyTagline2En || tag2;
                    } else if (locale === 'zh') {
                        title = data.philosophyTitleZh || title;
                        tag1 = data.philosophyTagline1Zh || tag1;
                        tag2 = data.philosophyTagline2Zh || tag2;
                    } else if (locale === 'zh-CN') {
                        title = data.philosophyTitleZhCn || title;
                        tag1 = data.philosophyTagline1ZhCn || tag1;
                        tag2 = data.philosophyTagline2ZhCn || tag2;
                    }

                    setContent({
                        title: title || 'Our Philosophy',
                        tagline1: tag1 || 'We curate journeys that breathe with the',
                        tagline2: tag2 || 'rhythm of nature.'
                    });
                }
            })
            .catch(() => { });
    }, [locale]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const textElement = textRef.current;
        if (!textElement) return;

        gsap.to(textElement, {
            backgroundImage: 'linear-gradient(90deg, #2A2A2A 0%, #2A2A2A 100%, transparent 100%)',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
            },
            backgroundSize: '100% 100%',
            ease: 'none',
        });

    }, []);

    return (
        <section ref={containerRef} className="py-32 px-6 md:px-20 min-h-[80vh] flex items-center justify-center bg-background overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-accent-secondary mb-8 font-bold">{content.title}</p>
                <h2
                    ref={textRef}
                    className="text-4xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text leading-tight"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #2A2A2A 0%, #2A2A2A 50%, transparent 50%)',
                        backgroundSize: '0% 100%',
                        backgroundRepeat: 'no-repeat',
                        WebkitTextStroke: '1px #D1D1D1',
                    }}
                >
                    {content.tagline1} <span className="italic font-light text-accent-primary">{content.tagline2}</span>
                </h2>
            </div>
        </section>
    );
}
