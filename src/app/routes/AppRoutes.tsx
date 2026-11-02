import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { LoadingScreen } from '@/shared/ui';
import { DoctorLayout } from '@/shared/layout';
import { PublicRoute, PrivateRoute } from './guards';
import {
  HomePage,
  AboutPage,
  ServicesPage,
  YogaSchedulePage,
  TeamPage,
  BlogPage,
  ContactPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DoctorDashboardPage,
  DoctorRequestsPage,
  DoctorPatientsPage,
  DoctorYogaSchedulePage,
  DoctorGalleryPage,
  DoctorSettingsPage,
} from './lazy';

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
        <Route path="/gallery" element={<Navigate to={ROUTES.HOME} replace />} />

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
