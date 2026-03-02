import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Maleosan Travel - Best Tour & Travel Operator in Manado, North Sulawesi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(176, 125, 98, 0.15)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '-80px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(176, 125, 98, 0.1)',
                        display: 'flex',
                    }}
                />

                {/* Logo / Brand */}
                <div
                    style={{
                        fontSize: 80,
                        fontWeight: 700,
                        color: '#B07D62',
                        letterSpacing: '-2px',
                        marginBottom: '8px',
                        display: 'flex',
                    }}
                >
                    MT.
                </div>

                {/* Brand Name */}
                <div
                    style={{
                        fontSize: 52,
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '16px',
                        display: 'flex',
                    }}
                >
                    Maleosan Travel
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 24,
                        color: 'rgba(255,255,255,0.7)',
                        textAlign: 'center',
                        maxWidth: '800px',
                        lineHeight: 1.4,
                        display: 'flex',
                    }}
                >
                    Best Tour & Travel Operator in Manado, North Sulawesi
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: '100px',
                        height: '3px',
                        background: '#B07D62',
                        margin: '24px 0',
                        borderRadius: '2px',
                        display: 'flex',
                    }}
                />

                {/* Services */}
                <div
                    style={{
                        display: 'flex',
                        gap: '32px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 18,
                    }}
                >
                    <span style={{ display: 'flex' }}>Tour Packages</span>
                    <span style={{ display: 'flex', color: '#B07D62' }}>•</span>
                    <span style={{ display: 'flex' }}>Hotels</span>
                    <span style={{ display: 'flex', color: '#B07D62' }}>•</span>
                    <span style={{ display: 'flex' }}>Car Rental</span>
                    <span style={{ display: 'flex', color: '#B07D62' }}>•</span>
                    <span style={{ display: 'flex' }}>Bunaken</span>
                </div>

                {/* URL */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.4)',
                        display: 'flex',
                    }}
                >
                    maleosantoursmanado.com
                </div>
            </div>
        ),
        { ...size }
    );
}
