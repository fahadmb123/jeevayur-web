import React from 'react';

export const BotanicalLotusArt: React.FC<{ className?: string }> = React.memo(({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Delicate botanical lotus and leaves illustration */}
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Lotus Bloom */}
        <path d="M160 120 C160 70 145 30 160 15 C175 30 160 70 160 120 Z" />
        <path d="M160 120 C140 85 110 50 95 38 C120 60 145 90 160 120 Z" />
        <path d="M160 120 C180 85 210 50 225 38 C200 60 175 90 160 120 Z" />
        <path d="M160 120 C125 100 80 80 60 75 C85 95 130 110 160 120 Z" />
        <path d="M160 120 C195 100 240 80 260 75 C235 95 190 110 160 120 Z" />
        
        {/* Outer Lower Petals */}
        <path d="M160 120 C110 115 65 120 40 135 C75 135 125 125 160 120 Z" />
        <path d="M160 120 C210 115 255 120 280 135 C245 135 195 125 160 120 Z" />
        
        {/* Lotus Calyx & Receptacle */}
        <path d="M135 122 C148 135 172 135 185 122" />
        <path d="M142 128 C152 138 168 138 178 128" />

        {/* Slender Curving Main Stems */}
        <path d="M160 135 C158 190 155 260 152 380" strokeWidth="1.5" />
        <path d="M145 190 C120 210 80 250 65 310" strokeWidth="1.3" />
        <path d="M170 230 C200 250 230 280 245 350" strokeWidth="1.3" />

        {/* Small Lotus Buds */}
        <path d="M65 310 C62 290 55 275 60 268 C68 275 66 295 65 310 Z" />
        <path d="M60 268 C52 280 50 295 55 305" />
        <path d="M60 268 C70 280 72 295 68 305" />

        {/* Broad Lily Pad / Lotus Leaf Veins */}
        <path d="M110 320 C60 280 10 300 5 350 C30 380 120 375 140 340 C145 330 130 325 110 320 Z" />
        <path d="M60 335 C30 315 15 320 5 350" />
        <path d="M60 335 C40 355 35 370 30 380" />
        <path d="M60 335 C80 360 100 370 120 375" />
        <path d="M60 335 C85 330 115 330 140 340" />

        {/* Second Leaf on Right */}
        <path d="M210 320 C250 290 290 305 305 345 C285 375 220 375 195 345 C190 335 200 325 210 320 Z" />
        <path d="M250 335 C275 315 290 320 305 345" />
        <path d="M250 335 C270 355 275 370 280 378" />
        <path d="M250 335 C230 360 215 370 200 375" />
      </g>
    </svg>
  );
});

BotanicalLotusArt.displayName = 'BotanicalLotusArt';
