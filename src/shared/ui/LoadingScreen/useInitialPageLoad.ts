import { useState, useEffect } from 'react';

export interface UseInitialPageLoadOptions {
  /**
   * Minimum duration in milliseconds to present the loading screen.
   * @default 3000
   */
  minDuration?: number;

  /**
   * Maximum safety timeout in milliseconds to prevent indefinite blocking
   * in degraded network conditions or delayed third-party assets.
   * @default 4200
   */
  maxTimeout?: number;
}

/**
 * useInitialPageLoad
 * Coordinates the application's initial loading phase by verifying:
 * 1. Component mounting and React hydration
 * 2. Document readiness (`document.readyState === 'complete'`)
 * 3. Typography & font face resolution (`document.fonts.ready`)
 * 4. DOM layout settling via double requestAnimationFrame
 * 5. ~3-second presentation threshold for smooth dissolution
 */
export const useInitialPageLoad = (options: UseInitialPageLoadOptions = {}) => {
  const { minDuration = 3000, maxTimeout = 4200 } = options;
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();

    const finishLoading = () => {
      if (!isMounted) return;
      const elapsedTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      setTimeout(() => {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }, remainingTime);
    };

    const awaitResources = async () => {
      try {
        // 1. Await full document state if still loading
        if (document.readyState !== 'complete') {
          await new Promise<void>((resolve) => {
            const onWindowLoad = () => {
              window.removeEventListener('load', onWindowLoad);
              resolve();
            };
            window.addEventListener('load', onWindowLoad);
          });
        }

        // 2. Await web fonts readiness if FontFaceSet is supported
        if (typeof document !== 'undefined' && 'fonts' in document && document.fonts.ready) {
          await document.fonts.ready;
        }

        // 3. Await two animation frames to ensure React components paint and settle layout
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
      } catch {
        // Fallback gracefully on any error
      } finally {
        finishLoading();
      }
    };

    // Safety timeout prevents the screen from hanging indefinitely
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsInitialLoading(false);
      }
    }, maxTimeout);

    awaitResources();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [minDuration, maxTimeout]);

  return { isInitialLoading };
};
