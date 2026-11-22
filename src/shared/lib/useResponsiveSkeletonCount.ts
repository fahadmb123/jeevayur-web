import { useState, useEffect } from 'react';

export interface ResponsiveSkeletonOptions {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  wide?: number;
}

const DEFAULT_OPTIONS: Required<ResponsiveSkeletonOptions> = {
  mobile: 2,
  tablet: 4,
  desktop: 8,
  wide: 12,
};

export const useResponsiveSkeletonCount = (
  customOptions?: ResponsiveSkeletonOptions,
  explicitCount?: number
): number => {
  const getCount = () => {
    if (explicitCount !== undefined && explicitCount > 0) {
      return explicitCount;
    }
    if (typeof window === 'undefined') {
      return customOptions?.desktop ?? DEFAULT_OPTIONS.desktop;
    }
    const width = window.innerWidth;
    const opts = { ...DEFAULT_OPTIONS, ...customOptions };

    if (width <= 640) {
      return opts.mobile;
    }
    if (width <= 1024) {
      return opts.tablet;
    }
    if (width <= 1440) {
      return opts.desktop;
    }
    return opts.wide;
  };

  const [count, setCount] = useState<number>(getCount);

  useEffect(() => {
    if (explicitCount !== undefined && explicitCount > 0) {
      setCount(explicitCount);
      return;
    }

    const handleResize = () => {
      setCount(getCount());
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [
    explicitCount,
    customOptions?.mobile,
    customOptions?.tablet,
    customOptions?.desktop,
    customOptions?.wide,
  ]);

  return count;
};
