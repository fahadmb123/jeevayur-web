import type { Patient, PatientStatus } from '../types';
import { apiClient } from '@/shared/lib/api/apiClient';

interface ApiPatient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
  condition: string | null;
  status: string;
  lastVisit: string | null;
  source?: 'website' | 'doctor';
  createdAt: string;
}

export const INITIAL_PATIENTS: Patient[] = [
  { id: 1, name: 'Ananya Patel', age: 34, lastVisit: 'Today', status: 'Uncompleted', phone: '+91 98765 11001', condition: 'Chronic Anxiety', source: 'doctor' },
  { id: 2, name: 'Rahul Verma', age: 45, lastVisit: 'Yesterday', status: 'Completed', phone: '+91 98765 22002', condition: 'Tension Cephalea', source: 'doctor' },
  { id: 3, name: 'Sunita Rao', age: 29, lastVisit: '18 Sep', status: 'Uncompleted', phone: '+91 98765 33003', condition: 'Somatoform Disorder', source: 'doctor' },
  { id: 4, name: 'Vikram Singh', age: 52, lastVisit: '15 Sep', status: 'Uncompleted', phone: '+91 98765 44004', condition: 'Workplace Burnout', source: 'doctor' },
];

function normalizeStatus(status: string): PatientStatus {
  const lower = status?.toLowerCase() || '';
  if (lower.includes('complete') || lower.includes('recovered')) return 'Completed';
  return 'Uncompleted';
}

function mapApiPatient(p: ApiPatient): Patient {
  const isWebsite =
    p.source === 'website' ||
    Boolean(p.lastVisit && /website|request/i.test(p.lastVisit)) ||
    Boolean(p.condition && /\((offline|online|in-person|in-clinic|virtual)\)/i.test(p.condition)) ||
    (String(p.id).length > 10 && !p.lastVisit?.toLowerCase().includes('doctor'));

  return {
    id: p.id,
    name: p.name,
    age: p.age || 35,
    lastVisit: p.lastVisit || 'Today (New Request)',
    status: normalizeStatus(p.status),
    phone: p.phone || undefined,
    email: p.email || undefined,
    gender: p.gender || undefined,
    condition: p.condition || undefined,
    source: isWebsite ? 'website' : 'doctor',
  };
}

export interface PatientFilterQuery {
  search?: string;
  status?: string;
  gender?: string;
  source?: string;
  limit?: number;
  page?: number;
}

export interface GetPatientsResult {
  patients: Patient[];
  total: number;
  counts: {
    all: number;
    completed: number;
    uncompleted: number;
  };
}

let inMemoryPatients: Patient[] = [...INITIAL_PATIENTS];

export const patientService = {
  async getPatients(query?: PatientFilterQuery): Promise<GetPatientsResult> {
    const params = new URLSearchParams();
    if (query?.search && query.search.trim()) params.set('search', query.search.trim());
    if (query?.status && query.status !== 'All') params.set('status', query.status);
    if (query?.gender && query.gender !== 'All') params.set('gender', query.gender);
    if (query?.source && query.source !== 'All') params.set('source', query.source);
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.page) params.set('page', String(query.page));

    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
      const res = await apiClient.get<{
        success: boolean;
        data: {
          patients: ApiPatient[];
          total: number;
          counts?: { all: number; completed: number; uncompleted: number };
        };
      }>(`/api/patients${queryString}`);

      const apiPatients = res.data?.patients || [];
      const mapped = apiPatients.map(mapApiPatient);
      const total = res.data?.total ?? mapped.length;
      const counts = res.data?.counts || {
        all: total,
        completed: mapped.filter((p) => p.status === 'Completed').length,
        uncompleted: mapped.filter((p) => p.status === 'Uncompleted').length,
      };

      return {
        patients: mapped,
        total,
        counts,
      };
    } catch {
      let filtered = [...inMemoryPatients];
      if (query?.search && query.search.trim()) {
        const q = query.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.condition && p.condition.toLowerCase().includes(q)) ||
            (p.phone && p.phone.toLowerCase().includes(q)) ||
            (p.email && p.email.toLowerCase().includes(q))
        );
      }
      if (query?.status && query.status !== 'All') {
        filtered = filtered.filter((p) => p.status === query.status);
      }
      if (query?.gender && query.gender !== 'All') {
        filtered = filtered.filter((p) => p.gender === query.gender);
      }
      if (query?.source && query.source !== 'All') {
        filtered = filtered.filter((p) => p.source === query.source);
      }

      const limit = query?.limit || 50;
      return {
        patients: filtered.slice(0, limit),
        total: filtered.length,
        counts: {
          all: inMemoryPatients.length,
          completed: inMemoryPatients.filter((p) => p.status === 'Completed').length,
          uncompleted: inMemoryPatients.filter((p) => p.status === 'Uncompleted').length,
        },
      };
    }
  },

  async addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    try {
      const res = await apiClient.post<{
        success: boolean;
        data: { patient: ApiPatient };
      }>('/api/patients', patient);
      if (res.data?.patient) {
        return mapApiPatient(res.data.patient);
      }
    } catch {
    }
    const newPatient: Patient = {
      ...patient,
      source: 'doctor',
      id: 'pat_' + Date.now(),
    };
    inMemoryPatients.unshift(newPatient);
    return newPatient;
  },

  async updatePatientStatus(id: number | string, status: PatientStatus): Promise<void> {
    const idx = inMemoryPatients.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      inMemoryPatients[idx] = { ...inMemoryPatients[idx], status };
    }
    try {
      await apiClient.patch(`/api/patients/${id}/status`, { status });
    } catch {
    }
  },
};
