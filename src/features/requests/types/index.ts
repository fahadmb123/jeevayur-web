export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type ConsultationRequestStatus = RequestStatus;

export type RequestMode = 'In-Person' | 'Video Call' | 'Phone';
export type ConsultationMode = RequestMode;

export interface PatientRequest {
  id: string;
  patientName: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | string;
  phone: string;
  email: string;
  city?: string;
  service: string;
  mode: RequestMode;
  preferredDate?: string;
  preferredTimeSlot?: string;
  primaryConcern: string;
  symptoms?: string[];
  language?: string;
  notes?: string;
  requestedAt: string;
  status: RequestStatus;
  rejectionReason?: string;
  acceptedAt?: string;
}

export type ConsultationRequest = PatientRequest;

export type RequestFilterOption = 'All' | 'Pending' | 'Accepted' | 'Rejected';
export type ConsultationFilterOption = RequestFilterOption;
