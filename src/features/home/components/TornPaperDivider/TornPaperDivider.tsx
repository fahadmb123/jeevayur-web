import React from 'react';

interface TornPaperDividerProps {
  className?: string;
  fillColor?: string;
}

export const TornPaperDivider: React.FC<TornPaperDividerProps> = React.memo(({
  className = '',
  fillColor = 'var(--bg-color, #FBFBF9)',
}) => {
  return (
    <div className={`torn-paper-divider-wrapper ${className}`} aria-hidden="true">
      <svg
        className="torn-paper-svg"
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
      >
        <path
          d="M0,28 
             C30,33 55,20 85,26 
             C115,32 140,21 170,28 
             C200,35 225,23 255,30 
             C285,37 310,21 340,29 
             C370,37 395,24 425,31 
             C455,38 480,21 510,27 
             C540,33 565,22 595,29 
             C625,36 650,20 680,26 
             C710,32 735,23 765,30 
             C795,37 820,21 850,28 
             C880,35 905,22 935,29 
             C965,36 990,20 1020,27 
             C1050,34 1075,23 1105,30 
             C1135,37 1160,20 1190,26 
             C1220,32 1245,22 1275,28 
             C1305,34 1330,21 1360,29 
             C1390,37 1415,20 1440,27 
             L1440,70 L0,70 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
});

TornPaperDivider.displayName = 'TornPaperDivider';
