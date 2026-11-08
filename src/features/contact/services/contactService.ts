import type { ClinicInfo, BookingAppointmentForm } from '../types';

export const CLINIC_INFO: ClinicInfo = {
  address: 'Near Ayurveda College, Kottakkal, Malappuram, Pin: 676501, Kerala, India',
  phone: '+91 73567 02775',
  email: 'info@jeevayurniketan.com',
  hours: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
};

export const contactService = {
  async sendMessage(msg: BookingAppointmentForm): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Appointment booking inquiry received:', msg);
    return { success: true };
  },

  getClinicInfo(): ClinicInfo {
    return CLINIC_INFO;
  },
};
