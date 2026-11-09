import type { PatientRequest, RequestStatus, RequestMode } from '../types';
import { patientService } from '@/features/patients';
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

function mapApiToPatientRequest(apt: ApiAppointment): PatientRequest {
  const statusLower = (apt.status || 'PENDING').toLowerCase();
  const mappedStatus: RequestStatus =
    statusLower === 'confirmed' || statusLower === 'accepted'
      ? 'accepted'
      : statusLower === 'cancelled' || statusLower === 'rejected'
      ? 'rejected'
      : 'pending';

  const mode: RequestMode =
    (apt.format || '').toLowerCase() === 'online' ? 'Video Call' : 'In-Person';

  const service =
    (apt.type || '').toLowerCase() === 'yoga class' ? 'Yoga Class' : 'Ayurveda Treatment';

  const dateObj = new Date(apt.createdAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  return {
    id: apt.id,
    patientName: apt.name,
    phone: apt.phone || '',
    email: apt.email || '',
    service,
    mode,
    language: apt.language || 'English',
    primaryConcern: apt.reason || 'General Consultation & Booking',
    symptoms: [service, mode, `Language: ${apt.language || 'English'}`],
    notes: `Online booking for ${service} (${mode}). Preferred language: ${apt.language || 'English'}.`,
    requestedAt: formattedDate,
    status: mappedStatus,
  };
}

let cachedRequests: PatientRequest[] = [];
const listeners = new Set<(requests: PatientRequest[]) => void>();

function notify() {
  const current = [...cachedRequests];
  listeners.forEach((l) => l(current));
}

export const requestService = {
  subscribe(listener: (requests: PatientRequest[]) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async getRequests(): Promise<PatientRequest[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: { appointments: ApiAppointment[]; total: number };
      }>('/api/appointments');
      const items = res?.data?.appointments || [];
      cachedRequests = items.map(mapApiToPatientRequest);
      notify();
      return cachedRequests;
    } catch {
      return cachedRequests;
    }
  },

  async acceptRequest(id: string): Promise<PatientRequest> {
    const res = await apiClient.patch<{
      success: boolean;
      data: ApiAppointment;
    }>(`/api/appointments/${encodeURIComponent(id)}/status`, {
      status: 'CONFIRMED',
    });

    const updated = mapApiToPatientRequest(res.data);
    const index = cachedRequests.findIndex((r) => r.id === id);
    if (index !== -1) {
      cachedRequests[index] = updated;
    } else {
      cachedRequests.unshift(updated);
    }

    try {
      await patientService.addPatient({
        name: updated.patientName,
        age: updated.age || 30,
        gender: updated.gender || 'Not specified',
        phone: updated.phone,
        email: updated.email,
        condition: updated.primaryConcern,
        lastVisit: 'Today (New Request)',
        status: 'Uncompleted',
      });
    } catch {
    }

    notify();
    return updated;
  },

  async rejectRequest(id: string, reason?: string): Promise<PatientRequest> {
    const res = await apiClient.patch<{
      success: boolean;
      data: ApiAppointment;
    }>(`/api/appointments/${encodeURIComponent(id)}/status`, {
      status: 'CANCELLED',
      reason,
    });

    const updated = mapApiToPatientRequest(res.data);
    if (reason) {
      updated.rejectionReason = reason;
    }

    const index = cachedRequests.findIndex((r) => r.id === id);
    if (index !== -1) {
      cachedRequests[index] = updated;
    } else {
      cachedRequests.unshift(updated);
    }

    notify();
    return updated;
  },
};

export const consultationService = requestService;
