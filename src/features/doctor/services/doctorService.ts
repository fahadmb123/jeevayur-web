import React from 'react';
import { Users, Calendar, Activity, Inbox } from 'lucide-react';
import type { DoctorStatItem } from '../types';
import { appointmentService, type Appointment } from '@/features/appointments';
import { patientService, type Patient } from '@/features/patients';
import { ROUTES } from '@/shared/config/routes';
import { apiClient } from '@/shared/lib/api/apiClient';

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
    title: "Today's Schedule",
    value: '12',
    trend: '4 Remaining',
    variant: 'blue',
    icon: React.createElement(Calendar, { size: 22 }),
  },
  {
    id: 'active-treatments',
    title: 'Completed Therapies',
    value: '28',
    trend: 'In progress',
    variant: 'green',
    icon: React.createElement(Activity, { size: 22 }),
  },
];

export const doctorService = {
  async getStats(): Promise<DoctorStatItem[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data?: {
          stats?: {
            activePatients: number;
            totalPatients?: number;
            todayConsultations: number;
            completedTherapies: number;
            pendingReviews: number;
            inboundRequests?: number;
          };
        };
        stats?: {
          activePatients: number;
          totalPatients?: number;
          todayConsultations: number;
          completedTherapies: number;
          pendingReviews: number;
          inboundRequests?: number;
        };
      }>('/api/doctor/dashboard');

      const s = res?.data?.stats || res?.stats;
      if (s) {
        const pendingCount = s.pendingReviews ?? s.inboundRequests ?? 0;
        const totalPatientsCount = s.totalPatients ?? s.activePatients ?? 0;
        const activeCount = s.activePatients ?? 0;
        const todayCount = s.todayConsultations ?? 0;
        const completedCount = s.completedTherapies ?? 0;

        return [
          {
            id: 'consultation-requests',
            title: 'Inbound Requests',
            value: String(pendingCount),
            trend: pendingCount > 0 ? `${pendingCount} pending review` : 'All caught up',
            variant: 'orange',
            icon: React.createElement(Inbox, { size: 22 }),
            link: ROUTES.DOCTOR_REQUESTS,
          },
          {
            id: 'total-patients',
            title: 'Total Patients',
            value: totalPatientsCount > 0 ? totalPatientsCount.toLocaleString() : '0',
            trend: `${activeCount} active in care`,
            variant: 'green',
            icon: React.createElement(Users, { size: 22 }),
            link: ROUTES.DOCTOR_PATIENTS,
          },
          {
            id: 'today-appointments',
            title: "Today's Schedule",
            value: String(todayCount),
            trend: todayCount > 0 ? `${todayCount} sessions scheduled` : 'No sessions today',
            variant: 'blue',
            icon: React.createElement(Calendar, { size: 22 }),
          },
          {
            id: 'active-treatments',
            title: 'Completed Therapies',
            value: String(completedCount),
            trend: 'Successfully restored',
            variant: 'green',
            icon: React.createElement(Activity, { size: 22 }),
          },
        ];
      }
    } catch {
    }

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
