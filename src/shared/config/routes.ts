export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  YOGA: '/yoga',
  TEAM: '/team',
  BLOG: '/blog',
  CONTACT: '/contact',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Doctor Portal
  DOCTOR: '/doctor',
  DOCTOR_REQUESTS: '/doctor/requests',
  DOCTOR_CONSULTATION_REQUESTS: '/doctor/requests',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_YOGA: '/doctor/yoga',
  DOCTOR_GALLERY: '/doctor/gallery',
  DOCTOR_SETTINGS: '/doctor/settings',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
