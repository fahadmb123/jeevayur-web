import React from 'react';

export interface OrganicWaveDividerProps {
  className?: string;
  fillColor?: string;
}

export const OrganicWaveDivider: React.FC<OrganicWaveDividerProps> = React.memo(({
  className = '',
  fillColor = '#ffffff',
}) => {
  return (
    <div className={`organic-wave-divider ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        preserveAspectRatio="none"
        className="organic-wave-svg"
      >
        <path
          d="M0,38 C240,68 460,78 720,44 C980,10 1220,18 1440,48 L1440,90 L0,90 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
});

OrganicWaveDivider.displayName = 'OrganicWaveDivider';
