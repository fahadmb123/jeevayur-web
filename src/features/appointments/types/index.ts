export type AppointmentStatus = 'next' | 'upcoming' | 'completed';

export interface Appointment {
  id: number | string;
  time: string;
  meridian: 'AM' | 'PM';
  patient: string;
  type: string;
  status: AppointmentStatus;
  isVideo?: boolean;
  phone?: string;
  email?: string;
  reason?: string;
  format?: string;
  notes?: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  service: string;
  preferredDate: string;
  notes?: string;
}

export interface AppointmentConfirmation {
  id: string;
  referenceNumber: string;
  booking: BookingFormData;
  status: 'confirmed' | 'pending';
  createdAt: string;
}
