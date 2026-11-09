import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        if (lenis) {
          lenis.scrollTo(targetElement as HTMLElement, { immediate: false });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    const resetScroll = () => {
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const doctorScroll = document.querySelector('.doctor-layout__content-scroll');
      if (doctorScroll) {
        doctorScroll.scrollTop = 0;
      }
    };

    resetScroll();

    const rAF = requestAnimationFrame(() => {
      resetScroll();
    });

    const timeout1 = setTimeout(() => {
      resetScroll();
    }, 60);

    const timeout2 = setTimeout(() => {
      resetScroll();
    }, 180);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [pathname, search, hash, lenis]);

  return null;
};
