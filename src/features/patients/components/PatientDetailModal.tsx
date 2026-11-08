import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  User,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import { StatusPill } from '@/shared/ui/status-pill';
import type { Patient } from '../types';
import './PatientDetailModal.css';

export interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onStartConsultation?: (patient: Patient) => void;
}

function parsePatientCondition(rawCondition?: string) {
  if (!rawCondition) {
    return {
      serviceType: null,
      format: null,
      reason: null,
    };
  }

  const match = rawCondition.match(/^([^()]+)\s*\(([^)]+)\)\s*:\s*(.*)$/i);
  if (match) {
    const rawType = match[1].trim();
    const rawFormat = match[2].trim();
    const rawReason = match[3].trim();

    const formatLabel =
      rawFormat.toLowerCase() === 'online'
        ? 'Online (Video Consultation)'
        : rawFormat.toLowerCase() === 'offline'
        ? 'Offline (In-Clinic Consultation)'
        : rawFormat.charAt(0).toUpperCase() + rawFormat.slice(1);

    const typeLabel = rawType
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      serviceType: typeLabel,
      format: formatLabel,
      reason: rawReason,
    };
  }

  return {
    serviceType: null,
    format: null,
    reason: rawCondition,
  };
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = React.memo(({
  patient,
  isOpen,
  isLoading = false,
  onClose,
  onStartConsultation,
}) => {
  const isRecovered = patient?.status === 'Recovered';

  const parsedCondition = useMemo(() => {
    return parsePatientCondition(patient?.condition);
  }, [patient?.condition]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="patient-detail-backdrop" onClick={onClose}>
        <motion.div
          className="patient-detail-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={patient ? `Details for ${patient.name}` : 'Patient details'}
        >
          {isLoading ? (
            <div className="patient-modal-skeleton-wrapper" role="status" aria-label="Loading patient details">
              <div className="patient-detail-modal__header">
                <div className="patient-detail-modal__profile">
                  <div className="patient-skeleton-box patient-detail-modal__avatar" />
                  <div className="patient-detail-modal__name-group">
                    <div className="patient-skeleton-box patient-skeleton-header-title" />
                    <div className="patient-skeleton-box patient-skeleton-header-sub" />
                  </div>
                </div>
                <button
                  className="patient-detail-modal__close-btn"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="patient-detail-modal__body">
                <div className="patient-detail-group">
                  <div className="patient-skeleton-box patient-skeleton-group-title" />
                  <div className="patient-detail-table">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="patient-detail-row">
                        <div className="patient-skeleton-box patient-skeleton-row-label" />
                        <div className="patient-skeleton-box patient-skeleton-row-value" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="patient-detail-group">
                  <div className="patient-skeleton-box patient-skeleton-group-title" />
                  <div className="patient-detail-table">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="patient-detail-row">
                        <div className="patient-skeleton-box patient-skeleton-row-label" />
                        <div className="patient-skeleton-box patient-skeleton-row-value" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="patient-detail-modal__footer">
                <div className="patient-skeleton-box patient-skeleton-btn" />
              </div>
            </div>
          ) : patient ? (
            <>
              <div className="patient-detail-modal__header">
                <div className="patient-detail-modal__profile">
                  <div className="patient-detail-modal__avatar">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="patient-detail-modal__name-group">
                    <div className="patient-detail-modal__name-row">
                      <h2 className="patient-detail-modal__name">{patient.name}</h2>
                      <StatusPill
                        status={patient.status}
                        variant={isRecovered ? 'success' : 'pending'}
                      />
                    </div>
                    <span className="patient-detail-modal__sub">
                      Patient Record #{String(patient.id).slice(-8)} • {patient.lastVisit}
                    </span>
                  </div>
                </div>
                <button
                  className="patient-detail-modal__close-btn"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="patient-detail-modal__body">
                <div className="patient-detail-group">
                  <div className="patient-detail-group__header">
                    <User size={14} />
                    <span>Personal & Contact Information</span>
                  </div>
                  <div className="patient-detail-table">
                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Full Name</div>
                      <div className="patient-detail-value">{patient.name}</div>
                    </div>

                    {patient.phone ? (
                      <a
                        href={`tel:${patient.phone}`}
                        className="patient-detail-row patient-detail-row--interactive"
                        title={`Call ${patient.phone}`}
                      >
                        <div className="patient-detail-label">
                          <Phone size={13} />
                          <span>Phone Number</span>
                        </div>
                        <div className="patient-detail-value">
                          <span>{patient.phone}</span>
                          <ExternalLink size={13} className="patient-detail-link-icon" />
                        </div>
                      </a>
                    ) : (
                      <div className="patient-detail-row">
                        <div className="patient-detail-label">Phone Number</div>
                        <div className="patient-detail-value">Not provided</div>
                      </div>
                    )}

                    {patient.email ? (
                      <a
                        href={`mailto:${patient.email}`}
                        className="patient-detail-row patient-detail-row--interactive"
                        title={`Email ${patient.email}`}
                      >
                        <div className="patient-detail-label">
                          <Mail size={13} />
                          <span>Email Address</span>
                        </div>
                        <div className="patient-detail-value">
                          <span>{patient.email}</span>
                          <ExternalLink size={13} className="patient-detail-link-icon" />
                        </div>
                      </a>
                    ) : (
                      <div className="patient-detail-row">
                        <div className="patient-detail-label">Email Address</div>
                        <div className="patient-detail-value">Not provided</div>
                      </div>
                    )}

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Demographics</div>
                      <div className="patient-detail-value">
                        {patient.age} Years • {patient.gender || 'General'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-group">
                  <div className="patient-detail-group__header">
                    <Stethoscope size={14} />
                    <span>Consultation & Clinical Details</span>
                  </div>
                  <div className="patient-detail-table">
                    {parsedCondition.serviceType && (
                      <div className="patient-detail-row">
                        <div className="patient-detail-label">Treatment Type</div>
                        <div className="patient-detail-value patient-detail-value--highlight">
                          {parsedCondition.serviceType}
                        </div>
                      </div>
                    )}

                    {parsedCondition.format && (
                      <div className="patient-detail-row">
                        <div className="patient-detail-label">Format / Mode</div>
                        <div className="patient-detail-value">
                          {parsedCondition.format}
                        </div>
                      </div>
                    )}

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">
                        {parsedCondition.serviceType ? 'Chief Reason' : 'Primary Condition'}
                      </div>
                      <div className="patient-detail-value">
                        {parsedCondition.reason || 'General Consultation'}
                      </div>
                    </div>

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Care Status</div>
                      <div className="patient-detail-value">
                        <StatusPill
                          status={patient.status}
                          variant={isRecovered ? 'success' : 'pending'}
                        />
                      </div>
                    </div>

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Latest Activity</div>
                      <div className="patient-detail-value">
                        {patient.lastVisit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="patient-detail-modal__footer">
                <button
                  type="button"
                  className="patient-detail-modal__btn patient-detail-modal__btn--secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                {onStartConsultation && (
                  <button
                    type="button"
                    className="patient-detail-modal__btn patient-detail-modal__btn--primary"
                    onClick={() => {
                      onStartConsultation(patient);
                      onClose();
                    }}
                  >
                    <Stethoscope size={16} />
                    <span>Start Consultation</span>
                  </button>
                )}
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

PatientDetailModal.displayName = 'PatientDetailModal';
