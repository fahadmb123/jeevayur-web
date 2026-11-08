import React from 'react';
import { Around } from '@theme-toggles/react';
import '@theme-toggles/react/styles/around.css';
import { useTheme } from '@/shared/context/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
  duration?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = React.memo(({
  className = '',
  duration = 750,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`theme-toggle-wrapper ${className}`}>
      <Around
        toggled={isDark}
        duration={duration}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggleTheme(event)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Dark Mode (Click for Light Mode)' : 'Light Mode (Click for Dark Mode)'}
        className="theme-toggle-around"
      />
    </div>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
