import type { Appointment, AppointmentConfirmation, BookingFormData } from '../types';
import { apiClient } from '@/shared/lib/api/apiClient';

interface ApiAppointment {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  format: string;
  language: string;
  status: string;
  createdAt: string;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, time: '10:00', meridian: 'AM', patient: 'Meera N', type: 'Consultation', status: 'next' },
  { id: 2, time: '11:30', meridian: 'AM', patient: 'Karan J', type: 'Follow up', status: 'upcoming' },
  { id: 3, time: '02:00', meridian: 'PM', patient: 'Priya D', type: 'Video Consult', status: 'upcoming', isVideo: true },
  { id: 4, time: '04:15', meridian: 'PM', patient: 'Arjun M', type: 'Therapy Session', status: 'upcoming' },
];

let inMemoryAppointments: Appointment[] = [...INITIAL_APPOINTMENTS];

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data?: {
          appointments?: ApiAppointment[];
          total?: number;
        };
        appointments?: ApiAppointment[];
      }>('/api/appointments');

      const items = res?.data?.appointments || res?.appointments || [];
      if (items.length > 0) {
        const mapped: Appointment[] = items.map((apt, index) => {
          const d = new Date(apt.createdAt);
          const isValid = !isNaN(d.getTime());
          const time = isValid
            ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            : `${10 + index}:00`;
          const meridian = isValid && d.getHours() >= 12 ? 'PM' : 'AM';
          const isVideo = (apt.format || '').toLowerCase() === 'online';
          const statusLower = (apt.status || '').toLowerCase();
          const isDone = statusLower === 'completed';

          return {
            id: apt.id,
            time,
            meridian,
            patient: apt.name,
            type: apt.type === 'yoga class' ? 'Yoga Consultation' : 'Clinical Ayurveda',
            status: isDone ? 'completed' : index === 0 ? 'next' : 'upcoming',
            isVideo,
            phone: apt.phone,
            email: apt.email,
            reason: apt.reason,
            format: apt.format,
          };
        });

        inMemoryAppointments = mapped;
        return mapped;
      }
    } catch {
    }

    return inMemoryAppointments;
  },

  async completeAppointment(id: number | string, notes?: string): Promise<void> {
    const idx = inMemoryAppointments.findIndex((a) => String(a.id) === String(id));
    if (idx !== -1) {
      inMemoryAppointments[idx] = {
        ...inMemoryAppointments[idx],
        status: 'completed',
        notes,
      };
    }

    try {
      await apiClient.patch(`/api/appointments/${encodeURIComponent(String(id))}/status`, {
        status: 'CONFIRMED',
        reason: notes,
      });
    } catch {
    }
  },

  async bookAppointment(data: BookingFormData): Promise<AppointmentConfirmation> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const confirmation: AppointmentConfirmation = {
      id: 'apt_' + Date.now(),
      referenceNumber: 'JEV-' + Math.floor(100000 + Math.random() * 900000),
      booking: data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return confirmation;
  },
};
