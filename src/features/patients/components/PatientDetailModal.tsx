import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  User,
  Stethoscope,
  FileText,
  ExternalLink,
  MessageSquare,
  Globe,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { Patient } from '../types';
import { PatientAvatar } from './PatientAvatar';
import './PatientDetailModal.css';

export interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  isLoading?: boolean;
  isStatusUpdating?: boolean;
  onClose: () => void;
  onStartConsultation?: (patient: Patient) => void;
  onToggleStatus?: (patient: Patient) => void;
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
  isStatusUpdating = false,
  onClose,
  onStartConsultation,
  onToggleStatus,
}) => {
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
                    {Array.from({ length: 3 }).map((_, i) => (
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
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="patient-detail-row">
                        <div className="patient-skeleton-box patient-skeleton-row-label" />
                        <div className="patient-skeleton-box patient-skeleton-row-value" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="patient-detail-group">
                  <div className="patient-skeleton-box patient-skeleton-group-title" />
                  <div className="patient-skeleton-box patient-skeleton-reason-box" />
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
                  <PatientAvatar
                    name={patient.name}
                    gender={patient.gender}
                    avatarUrl={patient.avatarUrl}
                    id={patient.id}
                    size={48}
                  />
                  <div className="patient-detail-modal__name-group">
                    <h2 className="patient-detail-modal__name">{patient.name}</h2>
                    <div className="patient-detail-modal__meta-strip">
                      <span className="patient-detail-modal__sub">
                        Patient ID #{String(patient.id).slice(-8)}
                      </span>
                      <span className={`patient-detail-status-pill patient-detail-status-pill--${patient.status === 'Completed' ? 'completed' : 'uncompleted'}`}>
                        {patient.status}
                      </span>
                      <span className={`patient-detail-source-badge patient-detail-source-badge--${patient.source || 'doctor'}`}>
                        {patient.source === 'website' ? (
                          <>
                            <Globe size={11} />
                            <span>Website Booking</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={11} />
                            <span>Added by Doctor</span>
                          </>
                        )}
                      </span>
                    </div>
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
                    <User size={15} />
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
                        <div className="patient-detail-value patient-detail-value--empty">Not provided</div>
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
                        <div className="patient-detail-value patient-detail-value--empty">Not provided</div>
                      </div>
                    )}

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Registration Source</div>
                      <div className="patient-detail-value">
                        {patient.source === 'website' ? (
                          <span className="patient-detail-source-indicator patient-detail-source-indicator--website">
                            <Globe size={13} />
                            <span>Applied via Website Appointment</span>
                          </span>
                        ) : (
                          <span className="patient-detail-source-indicator patient-detail-source-indicator--doctor">
                            <UserCheck size={13} />
                            <span>Added Manually by Doctor</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-group">
                  <div className="patient-detail-group__header">
                    <Stethoscope size={15} />
                    <span>Consultation & Treatment Specification</span>
                  </div>
                  <div className="patient-detail-table">
                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Treatment Type</div>
                      <div className="patient-detail-value patient-detail-value--highlight">
                        {parsedCondition.serviceType || 'Ayurveda Treatment'}
                      </div>
                    </div>

                    <div className="patient-detail-row">
                      <div className="patient-detail-label">Consultation Format</div>
                      <div className="patient-detail-value">
                        {parsedCondition.format || 'Offline (In-Clinic Consultation)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-group">
                  <div className="patient-detail-group__header">
                    <FileText size={15} />
                    <span>Chief Health Concern & Detailed Reason</span>
                  </div>
                  <div className="patient-detail-reason-card">
                    <div className="patient-detail-reason-badge">
                      <MessageSquare size={13} />
                      <span>Reported Health Concern</span>
                    </div>
                    <div className="patient-detail-reason-content">
                      <p className="patient-detail-reason-text">
                        {parsedCondition.reason || 'General Consultation'}
                      </p>
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
                {onToggleStatus && (
                  <button
                    type="button"
                    className={`patient-detail-modal__btn ${
                      patient.status === 'Completed'
                        ? 'patient-detail-modal__btn--uncomplete'
                        : 'patient-detail-modal__btn--complete'
                    } ${isStatusUpdating ? 'is-loading' : ''}`}
                    onClick={() => onToggleStatus(patient)}
                    disabled={isStatusUpdating}
                  >
                    {isStatusUpdating ? (
                      <>
                        <Loader2 size={15} className="patient-btn-spinner" />
                        <span>Updating Status...</span>
                      </>
                    ) : patient.status === 'Completed' ? (
                      <>
                        <RotateCcw size={15} />
                        <span>Mark Uncompleted</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Mark Completed</span>
                      </>
                    )}
                  </button>
                )}
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
