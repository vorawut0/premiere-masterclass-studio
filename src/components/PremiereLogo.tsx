import React from 'react';

interface PremiereLogoProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
  alt?: string;
}

export const PremiereLogo: React.FC<PremiereLogoProps> = ({
  className = 'w-8 h-8',
  size,
  withGlow = false,
  alt = 'Adobe Premiere Pro Logo'
}) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${withGlow ? 'drop-shadow-[0_0_12px_rgba(153,153,255,0.5)]' : ''} shrink-0 select-none`}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id="prBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00005B" />
          <stop offset="100%" stopColor="#000042" />
        </linearGradient>
      </defs>

      {/* Official Squircle Rounded Container */}
      <rect 
        x="32" 
        y="32" 
        width="448" 
        height="448" 
        rx="108" 
        ry="108" 
        fill="url(#prBgGrad)" 
      />

      {/* Subtle border shine */}
      <rect 
        x="32" 
        y="32" 
        width="448" 
        height="448" 
        rx="108" 
        ry="108" 
        stroke="#9999FF" 
        strokeWidth="5" 
        strokeOpacity="0.15" 
      />

      {/* Letter 'P' */}
      <path 
        d="M 132,172 L 210,172 C 242,172 264,192 264,224 C 264,256 242,276 210,276 L 174,276 L 174,340 L 132,340 Z M 174,206 L 174,242 L 208,242 C 222,242 228,236 228,224 C 228,212 222,206 208,206 Z" 
        fill="#9999FF" 
      />

      {/* Letter 'r' */}
      <path 
        d="M 292,220 L 332,220 L 332,246 C 344,228 360,220 378,220 C 392,220 402,224 408,230 L 394,264 C 386,258 376,256 366,256 C 350,256 334,268 332,286 L 332,340 L 292,340 Z" 
        fill="#9999FF" 
      />
    </svg>
  );
};
