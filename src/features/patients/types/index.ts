export type PatientStatus = 'Completed' | 'Uncompleted';

export interface Patient {
  id: number | string;
  name: string;
  age: number;
  lastVisit: string;
  status: PatientStatus;
  phone?: string;
  email?: string;
  gender?: string;
  condition?: string;
  avatarUrl?: string;
  source?: 'website' | 'doctor';
}
