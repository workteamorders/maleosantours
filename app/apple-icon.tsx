import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 100,
                    background: 'linear-gradient(135deg, #B07D62 0%, #8B5E3C 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '36px',
                    fontWeight: 700,
                    fontFamily: 'serif',
                    letterSpacing: '-2px',
                }}
            >
                MT
            </div>
        ),
        { ...size }
    );
}
