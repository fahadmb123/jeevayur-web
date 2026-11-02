import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { LoadingScreen } from '@/shared/ui';
import { DoctorLayout } from '@/shared/layout';
import { PublicRoute, PrivateRoute } from './guards';

const HomePage = lazy(() =>
  import('@/features/home/pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const AboutPage = lazy(() =>
  import('@/features/about/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ServicesPage = lazy(() =>
  import('@/features/services/pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const YogaSchedulePage = lazy(() =>
  import('@/features/yoga/pages/YogaSchedulePage').then((m) => ({ default: m.YogaSchedulePage }))
);
const TeamPage = lazy(() =>
  import('@/features/team/pages/TeamPage').then((m) => ({ default: m.TeamPage }))
);
const BlogPage = lazy(() =>
  import('@/features/blog/pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const ContactPage = lazy(() =>
  import('@/features/contact/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const NotFoundPage = lazy(() =>
  import('@/features/home/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);

const DoctorDashboardPage = lazy(() =>
  import('@/features/doctor/pages/DoctorDashboardPage').then((m) => ({ default: m.DoctorDashboardPage }))
);
const DoctorRequestsPage = lazy(() =>
  import('@/features/requests/pages/DoctorRequestsPage').then((m) => ({ default: m.DoctorRequestsPage }))
);
const DoctorPatientsPage = lazy(() =>
  import('@/features/patients/pages/DoctorPatientsPage').then((m) => ({ default: m.DoctorPatientsPage }))
);
const DoctorYogaSchedulePage = lazy(() =>
  import('@/features/yoga/pages/DoctorYogaSchedulePage').then((m) => ({ default: m.DoctorYogaSchedulePage }))
);
const DoctorGalleryPage = lazy(() =>
  import('@/features/gallery/pages/DoctorGalleryPage').then((m) => ({ default: m.DoctorGalleryPage }))
);
const DoctorSettingsPage = lazy(() =>
  import('@/features/doctor/pages/DoctorSettingsPage').then((m) => ({ default: m.DoctorSettingsPage }))
);
const GalleryPage = lazy(() =>
  import('@/features/gallery/pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);

export const AppRoutes: React.FC = React.memo(() => {
  return (
    <Suspense fallback={<LoadingScreen fullScreen message="Loading Jeevayurniketan..." />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={ROUTES.YOGA} element={<YogaSchedulePage />} />
        <Route path={ROUTES.TEAM} element={<TeamPage />} />
        <Route path={ROUTES.BLOG} element={<BlogPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.GALLERY} element={<GalleryPage />} />

        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
          <Route element={<DoctorLayout />}>
            <Route path={ROUTES.DOCTOR} element={<DoctorDashboardPage />} />
            <Route path={ROUTES.DOCTOR_REQUESTS} element={<DoctorRequestsPage />} />
            <Route path={ROUTES.DOCTOR_PATIENTS} element={<DoctorPatientsPage />} />
            <Route path={ROUTES.DOCTOR_YOGA} element={<DoctorYogaSchedulePage />} />
            <Route path={ROUTES.DOCTOR_GALLERY} element={<DoctorGalleryPage />} />
            <Route path={ROUTES.DOCTOR_SETTINGS} element={<DoctorSettingsPage />} />
          </Route>
        </Route>

        <Route path="/dev/loading" element={<LoadingScreen fullScreen />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
});

AppRoutes.displayName = 'AppRoutes';
