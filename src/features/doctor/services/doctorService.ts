import React from 'react';
import { Users, Activity, CheckCircle2, Inbox } from 'lucide-react';
import type { DoctorStatItem } from '../types';
import { ROUTES } from '@/shared/config/routes';
import { apiClient } from '@/shared/lib/api/apiClient';

export const INITIAL_STATS: DoctorStatItem[] = [
  {
    id: 'consultation-requests',
    title: 'Inbound Requests',
    value: '0',
    trend: 'Pending review',
    variant: 'orange',
    icon: React.createElement(Inbox, { size: 22 }),
    link: ROUTES.DOCTOR_REQUESTS,
  },
  {
    id: 'total-patients',
    title: 'Total Patients',
    value: '0',
    trend: 'Clinical registry',
    variant: 'green',
    icon: React.createElement(Users, { size: 22 }),
    link: ROUTES.DOCTOR_PATIENTS,
  },
  {
    id: 'active-patients',
    title: 'Active in Care',
    value: '0',
    trend: 'Under active therapy',
    variant: 'blue',
    icon: React.createElement(Activity, { size: 22 }),
  },
  {
    id: 'active-treatments',
    title: 'Completed Therapies',
    value: '0',
    trend: 'Restored & concluded',
    variant: 'green',
    icon: React.createElement(CheckCircle2, { size: 22 }),
  },
];

interface DoctorDashboardApiResponse {
  success: boolean;
  data?: {
    stats?: {
      activePatients: number;
      totalPatients?: number;
      completedTherapies: number;
      pendingReviews: number;
      inboundRequests?: number;
    };
  };
  stats?: {
    activePatients: number;
    totalPatients?: number;
    completedTherapies: number;
    pendingReviews: number;
    inboundRequests?: number;
  };
}

export const doctorService = {
  async getStats(): Promise<DoctorStatItem[]> {
    try {
      const res = await apiClient.get<DoctorDashboardApiResponse>('/api/doctor/dashboard');

      const s = res?.data?.stats || res?.stats;
      if (s) {
        const pendingCount = s.pendingReviews ?? s.inboundRequests ?? 0;
        const totalPatientsCount = s.totalPatients ?? s.activePatients ?? 0;
        const activeCount = s.activePatients ?? 0;
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
            id: 'active-patients',
            title: 'Active in Care',
            value: String(activeCount),
            trend: activeCount > 0 ? `${activeCount} under therapy` : 'No active therapies',
            variant: 'blue',
            icon: React.createElement(Activity, { size: 22 }),
          },
          {
            id: 'active-treatments',
            title: 'Completed Therapies',
            value: String(completedCount),
            trend: completedCount > 0 ? `${completedCount} restored & concluded` : 'Ready for records',
            variant: 'green',
            icon: React.createElement(CheckCircle2, { size: 22 }),
          },
        ];
      }
    } catch {
    }

    return INITIAL_STATS;
  },
};
