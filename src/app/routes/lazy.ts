import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('@/features/home/pages/HomePage').then((m) => ({ default: m.HomePage }))
);

export const AboutPage = lazy(() =>
  import('@/features/about/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

export const ServicesPage = lazy(() =>
  import('@/features/services/pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);

export const YogaSchedulePage = lazy(() =>
  import('@/features/yoga/pages/YogaSchedulePage').then((m) => ({ default: m.YogaSchedulePage }))
);

export const TeamPage = lazy(() =>
  import('@/features/team/pages/TeamPage').then((m) => ({ default: m.TeamPage }))
);

export const BlogPage = lazy(() =>
  import('@/features/blog/pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);

export const ContactPage = lazy(() =>
  import('@/features/contact/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

export const NotFoundPage = lazy(() =>
  import('@/features/home/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

export const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);

export const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);

export const DoctorDashboardPage = lazy(() =>
  import('@/features/doctor/pages/DoctorDashboardPage').then((m) => ({ default: m.DoctorDashboardPage }))
);

export const DoctorRequestsPage = lazy(() =>
  import('@/features/requests/pages/DoctorRequestsPage').then((m) => ({ default: m.DoctorRequestsPage }))
);

export const DoctorPatientsPage = lazy(() =>
  import('@/features/patients/pages/DoctorPatientsPage').then((m) => ({ default: m.DoctorPatientsPage }))
);

export const DoctorYogaSchedulePage = lazy(() =>
  import('@/features/yoga/pages/DoctorYogaSchedulePage').then((m) => ({ default: m.DoctorYogaSchedulePage }))
);

export const DoctorGalleryPage = lazy(() =>
  import('@/features/gallery/pages/DoctorGalleryPage').then((m) => ({ default: m.DoctorGalleryPage }))
);

export const DoctorSettingsPage = lazy(() =>
  import('@/features/doctor/pages/DoctorSettingsPage').then((m) => ({ default: m.DoctorSettingsPage }))
);

