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
  { id: 1, name: 'Ananya Patel', age: 34, lastVisit: 'Today', status: 'In treatment', phone: '+91 98765 11001', condition: 'Chronic Anxiety', source: 'doctor' },
  { id: 2, name: 'Rahul Verma', age: 45, lastVisit: 'Yesterday', status: 'Recovered', phone: '+91 98765 22002', condition: 'Tension Cephalea', source: 'doctor' },
  { id: 3, name: 'Sunita Rao', age: 29, lastVisit: '18 Sep', status: 'In treatment', phone: '+91 98765 33003', condition: 'Somatoform Disorder', source: 'doctor' },
  { id: 4, name: 'Vikram Singh', age: 52, lastVisit: '15 Sep', status: 'Consultation', phone: '+91 98765 44004', condition: 'Workplace Burnout', source: 'doctor' },
];

function normalizeStatus(status: string): PatientStatus {
  const lower = status.toLowerCase();
  if (lower.includes('treatment')) return 'In treatment';
  if (lower.includes('recovered')) return 'Recovered';
  return 'Consultation';
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

let inMemoryPatients: Patient[] = [...INITIAL_PATIENTS];

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: { patients: ApiPatient[]; total: number };
      }>('/api/patients');
      const apiPatients = res.data?.patients || [];
      if (apiPatients.length > 0) {
        return [...apiPatients.map(mapApiPatient), ...inMemoryPatients];
      }
      return inMemoryPatients;
    } catch {
      return inMemoryPatients;
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
};
