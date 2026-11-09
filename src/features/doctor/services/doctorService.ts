import React from 'react';
import { Users, Calendar, Activity, Inbox } from 'lucide-react';
import type { DoctorStatItem } from '../types';
import { appointmentService, type Appointment } from '@/features/appointments';
import { patientService, type Patient } from '@/features/patients';
import { ROUTES } from '@/shared/config/routes';

export const INITIAL_STATS: DoctorStatItem[] = [
  {
    id: 'consultation-requests',
    title: 'Inbound Requests',
    value: '3',
    trend: 'Pending review',
    variant: 'orange',
    icon: React.createElement(Inbox, { size: 22 }),
    link: ROUTES.DOCTOR_REQUESTS,
  },
  {
    id: 'total-patients',
    title: 'Total Patients',
    value: '1,248',
    trend: '+12% this month',
    variant: 'green',
    icon: React.createElement(Users, { size: 22 }),
    link: ROUTES.DOCTOR_PATIENTS,
  },
  {
    id: 'today-appointments',
    title: "Today's Appointments",
    value: '12',
    trend: '4 Remaining',
    variant: 'blue',
    icon: React.createElement(Calendar, { size: 22 }),
  },
  {
    id: 'active-treatments',
    title: 'Active Treatments',
    value: '28',
    trend: 'In progress',
    variant: 'green',
    icon: React.createElement(Activity, { size: 22 }),
  },
];

export const doctorService = {
  async getStats(): Promise<DoctorStatItem[]> {
    return INITIAL_STATS;
  },

  async getAppointments(): Promise<Appointment[]> {
    return appointmentService.getAppointments();
  },

  async getPatients(): Promise<Patient[]> {
    const res = await patientService.getPatients();
    return res.patients;
  },

  async addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    return patientService.addPatient(patient);
  },
};
