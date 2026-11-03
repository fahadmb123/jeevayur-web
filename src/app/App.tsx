import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { LoadingScreen, useInitialPageLoad, InitialLoadProvider, ScrollToTop } from '@/shared/ui';
import { AppRoutes } from './routes';

const lenisOptions = {
  // Omit duration so Lenis uses pure physics frame-rate independent damping (damp())
  lerp: 0.04,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.4,
  infinite: false,
};

export const App: React.FC = React.memo(() => {
  const { isInitialLoading } = useInitialPageLoad({ minDuration: 5000, maxTimeout: 6500 });

  return (
    <ReactLenis root options={lenisOptions}>
      <ThemeProvider>
        <InitialLoadProvider isInitialLoading={isInitialLoading}>
          <Router>
            <ScrollToTop />
            <div className="app">
              {/* Initial App Load Overlay - Stays until components, DOM & fonts settle */}
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

