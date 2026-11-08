import { lazy, type ComponentType } from 'react';

/**
 * Resilient dynamic importer that auto-retries failed dynamic imports
 * caused by Vite HMR or browser caching stale module hashes.
 */
function retryImport<T>(fn: () => Promise<T>, retries = 2, delay = 400): Promise<T> {
  return new Promise((resolve, reject) => {
    fn()
      .then((res) => {
        try {
          sessionStorage.removeItem('chunk_retry_reload');
        } catch {
          // Ignore storage error
        }
        resolve(res);
      })
      .catch((error) => {
        if (retries > 0) {
          setTimeout(() => {
            retryImport(fn, retries - 1, delay).then(resolve, reject);
          }, delay);
        } else {
          try {
            const hasReloaded = sessionStorage.getItem('chunk_retry_reload');
            if (!hasReloaded && typeof window !== 'undefined') {
              sessionStorage.setItem('chunk_retry_reload', 'true');
              window.location.reload();
              return;
            }
            sessionStorage.removeItem('chunk_retry_reload');
          } catch {
            // Ignore storage error
          }
          reject(error);
        }
      });
  });
}

function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(() => retryImport(factory));
}

export const HomePage = createLazyComponent(() =>
  import('@/features/home/pages/HomePage').then((m) => ({ default: m.HomePage }))
);

export const AboutPage = createLazyComponent(() =>
  import('@/features/about/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

export const ServicesPage = createLazyComponent(() =>
  import('@/features/services/pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);

export const YogaSchedulePage = createLazyComponent(() =>
  import('@/features/yoga/pages/YogaSchedulePage').then((m) => ({ default: m.YogaSchedulePage }))
);

export const TeamPage = createLazyComponent(() =>
  import('@/features/team/pages/TeamPage').then((m) => ({ default: m.TeamPage }))
);

export const BlogPage = createLazyComponent(() =>
  import('@/features/blog/pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);

export const ContactPage = createLazyComponent(() =>
  import('@/features/contact/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

export const NotFoundPage = createLazyComponent(() =>
  import('@/features/home/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const LoginPage = createLazyComponent(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

export const ForgotPasswordPage = createLazyComponent(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);

export const ResetPasswordPage = createLazyComponent(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);

export const DoctorDashboardPage = createLazyComponent(() =>
  import('@/features/doctor/pages/DoctorDashboardPage').then((m) => ({ default: m.DoctorDashboardPage }))
);

export const DoctorRequestsPage = createLazyComponent(() =>
  import('@/features/requests/pages/DoctorRequestsPage').then((m) => ({ default: m.DoctorRequestsPage }))
);

export const DoctorPatientsPage = createLazyComponent(() =>
  import('@/features/patients/pages/DoctorPatientsPage').then((m) => ({ default: m.DoctorPatientsPage }))
);

export const DoctorYogaSchedulePage = createLazyComponent(() =>
  import('@/features/yoga/pages/DoctorYogaSchedulePage').then((m) => ({ default: m.DoctorYogaSchedulePage }))
);

export const DoctorGalleryPage = createLazyComponent(() =>
  import('@/features/gallery/pages/DoctorGalleryPage').then((m) => ({ default: m.DoctorGalleryPage }))
);

export const DoctorSettingsPage = createLazyComponent(() =>
  import('@/features/doctor/pages/DoctorSettingsPage').then((m) => ({ default: m.DoctorSettingsPage }))
);
