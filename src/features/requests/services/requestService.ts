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

  const genderMatch = apt.reason?.match(/\[Gender:\s*([^\]]+)\]/i);
  const extractedGender = genderMatch ? genderMatch[1].trim() : undefined;
  const cleanReason = apt.reason ? apt.reason.replace(/\[Gender:\s*[^\]]+\]\s*/i, '').trim() : '';

  return {
    id: apt.id,
    patientName: apt.name,
    gender: extractedGender || (apt as any).gender || 'Male',
    phone: apt.phone || '',
    email: apt.email || '',
    service,
    mode,
    language: apt.language || 'English',
    primaryConcern: cleanReason || 'General Consultation & Booking',
    symptoms: [service, mode, `Language: ${apt.language || 'English'}`],
    notes: `Online booking for ${service} (${mode}). Preferred language: ${apt.language || 'English'}.`,
    requestedAt: formattedDate,
    status: mappedStatus,
  };
}

export interface RequestFilterQuery {
  status?: string;
  service?: string;
  mode?: string;
  search?: string;
}

export interface RequestCounts {
  all: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface GetRequestsResult {
  requests: PatientRequest[];
  total: number;
  counts: RequestCounts;
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

  async getRequests(query?: RequestFilterQuery): Promise<GetRequestsResult> {
    const params = new URLSearchParams();
    if (query?.status && query.status !== 'All' && query.status !== 'all') {
      params.set('status', query.status.toLowerCase());
    }
    if (query?.service && query.service !== 'All' && query.service !== 'all') {
      params.set('service', query.service);
    }
    if (query?.mode && query.mode !== 'All' && query.mode !== 'all') {
      params.set('mode', query.mode);
    }
    if (query?.search && query.search.trim()) {
      params.set('search', query.search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
      const res = await apiClient.get<{
        success: boolean;
        data: {
          appointments: ApiAppointment[];
          total: number;
          counts?: RequestCounts;
        };
      }>(`/api/appointments${queryString}`);
      const items = res?.data?.appointments || [];
      const mapped = items.map(mapApiToPatientRequest);
      cachedRequests = mapped;
      notify();
      const counts = res?.data?.counts || {
        all: res?.data?.total ?? mapped.length,
        pending: mapped.filter((r) => r.status === 'pending').length,
        accepted: mapped.filter((r) => r.status === 'accepted').length,
        rejected: mapped.filter((r) => r.status === 'rejected').length,
      };
      return {
        requests: mapped,
        total: res?.data?.total ?? mapped.length,
        counts,
      };
    } catch {
      return {
        requests: cachedRequests,
        total: cachedRequests.length,
        counts: {
          all: cachedRequests.length,
          pending: cachedRequests.filter((r) => r.status === 'pending').length,
          accepted: cachedRequests.filter((r) => r.status === 'accepted').length,
          rejected: cachedRequests.filter((r) => r.status === 'rejected').length,
        },
      };
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
