import { useState, useEffect, type RefObject } from 'react';

export const useGridColumns = (containerRef?: RefObject<HTMLElement | null>, defaultCols = 4) => {
  const getInitialCols = () => {
    if (typeof window === 'undefined') return defaultCols;
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1024) return 2;
    if (width <= 1360) return 3;
    return 4;
  };

  const [cols, setCols] = useState<number>(getInitialCols);

  useEffect(() => {
    const update = () => {
      if (containerRef?.current) {
        const children = Array.from(containerRef.current.children) as HTMLElement[];
        if (children.length > 1) {
          const firstTop = children[0].offsetTop;
          let count = 0;
          for (let i = 0; i < children.length; i++) {
            if (Math.abs(children[i].offsetTop - firstTop) < 14) {
              count++;
            } else {
              break;
            }
          }
          if (count > 0) {
            setCols(count);
            return;
          }
        }
      }

      const width = window.innerWidth;
      if (width <= 640) {
        setCols(1);
      } else if (width <= 1024) {
        setCols(2);
      } else if (width <= 1360) {
        setCols(3);
      } else {
        setCols(4);
      }
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [containerRef, defaultCols]);

  return cols;
};
