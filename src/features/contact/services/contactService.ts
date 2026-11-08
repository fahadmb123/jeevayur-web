import type { ClinicInfo, BookingAppointmentForm } from '../types';
import { apiClient } from '@/shared/lib/api/apiClient';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';

export const CLINIC_INFO: ClinicInfo = {
  address: 'Near Ayurveda College, Kottakkal, Malappuram, Pin: 676501, Kerala, India',
  phone: CLINIC_CONTACT.phone,
  email: CLINIC_CONTACT.email,
  hours: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
};

export const contactService = {
  async sendMessage(msg: BookingAppointmentForm): Promise<{ success: boolean; data?: unknown }> {
    try {
      const response = await apiClient.post<{ success: boolean; data?: unknown }, BookingAppointmentForm>(
        '/api/appointments',
        msg
      );
      return { success: response.success ?? true, data: response.data };
    } catch (err) {
      console.error('Failed to submit appointment to backend:', err);
      throw err;
    }
  },

  getClinicInfo(): ClinicInfo {
    return {
      ...CLINIC_INFO,
      phone: CLINIC_CONTACT.phone,
      email: CLINIC_CONTACT.email,
    };
  },
};
