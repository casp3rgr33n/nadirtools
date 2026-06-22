import { ImageResponse } from 'next/og';


export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        {/* Dark background */}
        <rect width="32" height="32" fill="#050705" />
        
        {/* Green bracket accents */}
        <path d="M4 10V4h6" stroke="#00ffd0" strokeWidth="2" fill="none" />
        <circle cx="10" cy="4" r="1.5" fill="#00ffd0" />
        <path d="M28 22v6h-6" stroke="#00ffd0" strokeWidth="2" fill="none" />
        <circle cx="22" cy="28" r="1.5" fill="#00ffd0" />
        
        {/* Gold NV Shape */}
        <path d="M10 24V8l8 10V8h4v16l-8-10v10h-4z" fill="#dfba6b" />
        <path d="M8 26l8 6 8-6" stroke="#dfba6b" strokeWidth="2" fill="none" />
      </svg>
    ),
    { ...size }
  );
}
