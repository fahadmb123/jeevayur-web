import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { LoadingScreen, useInitialPageLoad, InitialLoadProvider, ScrollToTop } from '@/shared/ui';
import { AppRoutes } from './routes';

const lenisOptions = {
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
  syncTouch: false,
  infinite: false,
  prevent: (node: HTMLElement) => {
    return (
      Boolean(node?.hasAttribute?.('data-lenis-prevent')) ||
      Boolean(node?.closest?.('[data-lenis-prevent]')) ||
      Boolean(node?.classList?.contains?.('lenis-prevent')) ||
      Boolean(node?.closest?.('.lenis-prevent'))
    );
  },
};

export const App: React.FC = React.memo(() => {
  const { isInitialLoading } = useInitialPageLoad({ minDuration: 3000, maxTimeout: 4200 });

  return (
    <ReactLenis root options={lenisOptions}>
      <ThemeProvider>
        <InitialLoadProvider isInitialLoading={isInitialLoading}>
          <Router>
            <ScrollToTop />
            <div className="app">
              <AnimatePresence mode="wait">
                {isInitialLoading && (
                  <LoadingScreen
                    key="initial-app-loader"
                    fullScreen
                    message="Loading Jeevayurniketan..."
                  />
                )}
              </AnimatePresence>

              <AppRoutes />
            </div>
          </Router>
        </InitialLoadProvider>
      </ThemeProvider>
    </ReactLenis>
  );
});

App.displayName = 'App';

