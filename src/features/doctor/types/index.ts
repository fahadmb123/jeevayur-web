import React from 'react';
export type { Appointment, AppointmentStatus } from '@/features/appointments';
export type { Patient, PatientStatus } from '@/features/patients';

export interface DoctorStatItem {
  id: string;
  title: string;
  value: string;
  trend: string;
  variant: 'green' | 'blue' | 'orange';
  icon: React.ReactNode;
  link?: string;
}

export interface DoctorNavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export interface DoctorProfile {
  name: string;
  username?: string;
  specialty: string;
  email: string;
  phone: string;
  consultDuration: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  urgentAlerts?: boolean;
  weeklySummary?: boolean;
  licenseNo?: string;
  location?: string;
  bio?: string;
  bufferTime?: string;
}
