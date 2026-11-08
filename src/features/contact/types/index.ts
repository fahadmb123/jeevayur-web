export type AppointmentType = 'ayurveda treatment' | 'yoga class';
export type AppointmentFormat = 'online' | 'offline';

export interface BookingAppointmentForm {
  type: AppointmentType;
  name: string;
  email: string;
  reason: string;
  format: AppointmentFormat;
  language: string;
}

export type ContactMessage = BookingAppointmentForm;

export interface ClinicInfo {
  address: string;
  phone: string;
  email: string;
  hours: string[];
}
