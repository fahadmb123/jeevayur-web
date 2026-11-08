import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  Calendar,
  User,
  Activity,
  Leaf,
  FileText,
  Stethoscope,
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

export const PatientDetailModal: React.FC<PatientDetailModalProps> = React.memo(({
  patient,
  isOpen,
  isLoading = false,
  onClose,
  onStartConsultation,
}) => {
  const isRecovered = patient?.status === 'Recovered';

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
                  <div className="patient-skeleton-box patient-modal-skeleton-avatar" />
                  <div className="patient-detail-modal__name-group">
                    <div className="patient-detail-modal__name-row">
                      <div className="patient-skeleton-box patient-modal-skeleton-title" />
                      <div className="patient-skeleton-box patient-modal-skeleton-pill" />
                    </div>
                    <div className="patient-skeleton-box patient-modal-skeleton-sub" />
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
                <div className="patient-detail-modal__contact-grid">
                  <div className="patient-skeleton-box patient-modal-skeleton-contact" />
                  <div className="patient-skeleton-box patient-modal-skeleton-contact" />
                  <div className="patient-skeleton-box patient-modal-skeleton-contact" />
                </div>

                <div className="patient-detail-modal__section">
                  <div className="patient-skeleton-box patient-modal-skeleton-title-sm" />
                  <div className="patient-skeleton-box patient-modal-skeleton-card" />
                </div>

                <div className="patient-detail-modal__section">
                  <div className="patient-skeleton-box patient-modal-skeleton-title-sm" />
                  <div className="patient-skeleton-box patient-modal-skeleton-card" />
                </div>
              </div>

              <div className="patient-detail-modal__footer">
                <div className="patient-skeleton-box patient-modal-skeleton-btn" />
                <div className="patient-skeleton-box patient-modal-skeleton-btn" />
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
                    <span className="patient-detail-modal__id">
                      Patient Record #{String(patient.id).slice(-8)} • Last Visit: {patient.lastVisit}
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
                <div className="patient-detail-modal__contact-grid">
                  {patient.phone ? (
                    <a
                      href={`tel:${patient.phone}`}
                      className="patient-detail-modal__contact-card patient-detail-modal__contact-card--interactive"
                    >
                      <div className="patient-detail-modal__contact-icon">
                        <Phone size={16} />
                      </div>
                      <div className="patient-detail-modal__contact-meta">
                        <span className="patient-detail-modal__contact-label">Phone Number</span>
                        <span className="patient-detail-modal__contact-val">{patient.phone}</span>
                      </div>
                    </a>
                  ) : (
                    <div className="patient-detail-modal__contact-card">
                      <div className="patient-detail-modal__contact-icon">
                        <Phone size={16} />
                      </div>
                      <div className="patient-detail-modal__contact-meta">
                        <span className="patient-detail-modal__contact-label">Phone Number</span>
                        <span className="patient-detail-modal__contact-val">Not provided</span>
                      </div>
                    </div>
                  )}

                  {patient.email ? (
                    <a
                      href={`mailto:${patient.email}`}
                      className="patient-detail-modal__contact-card patient-detail-modal__contact-card--interactive"
                    >
                      <div className="patient-detail-modal__contact-icon">
                        <Mail size={16} />
                      </div>
                      <div className="patient-detail-modal__contact-meta">
                        <span className="patient-detail-modal__contact-label">Email Address</span>
                        <span className="patient-detail-modal__contact-val">{patient.email}</span>
                      </div>
                    </a>
                  ) : (
                    <div className="patient-detail-modal__contact-card">
                      <div className="patient-detail-modal__contact-icon">
                        <Mail size={16} />
                      </div>
                      <div className="patient-detail-modal__contact-meta">
                        <span className="patient-detail-modal__contact-label">Email Address</span>
                        <span className="patient-detail-modal__contact-val">Not provided</span>
                      </div>
                    </div>
                  )}

                  <div className="patient-detail-modal__contact-card">
                    <div className="patient-detail-modal__contact-icon">
                      <User size={16} />
                    </div>
                    <div className="patient-detail-modal__contact-meta">
                      <span className="patient-detail-modal__contact-label">Demographics</span>
                      <span className="patient-detail-modal__contact-val">
                        {patient.age} yrs • {patient.gender || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-modal__section">
                  <h4 className="patient-detail-modal__section-title">
                    <Activity size={16} /> Clinical Diagnosis & Condition
                  </h4>
                  <div className="patient-detail-modal__card">
                    <div className="patient-detail-modal__clinical-grid">
                      <div className="patient-detail-modal__clinical-item">
                        <span className="patient-detail-modal__item-label">Primary Diagnosis</span>
                        <span className="patient-detail-modal__item-value text-primary-green">
                          {patient.condition || 'General Ayurveda Assessment'}
                        </span>
                      </div>
                      <div className="patient-detail-modal__clinical-item">
                        <span className="patient-detail-modal__item-label">Dosha Profile</span>
                        <span className="patient-detail-modal__badge">
                          <Leaf size={12} />
                          Vata-Pitta Balance
                        </span>
                      </div>
                      <div className="patient-detail-modal__clinical-item">
                        <span className="patient-detail-modal__item-label">Current Phase</span>
                        <span className="patient-detail-modal__item-value">
                          {patient.status}
                        </span>
                      </div>
                      <div className="patient-detail-modal__clinical-item">
                        <span className="patient-detail-modal__item-label">Latest Checkup</span>
                        <span className="patient-detail-modal__item-value">
                          <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                          {patient.lastVisit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-modal__section">
                  <h4 className="patient-detail-modal__section-title">
                    <FileText size={16} /> Physician Consultation Notes & Regimen
                  </h4>
                  <div className="patient-detail-modal__card">
                    <p className="patient-detail-modal__notes-p">
                      Patient is undergoing tailored classical Ayurvedic care for {patient.condition || 'health restoration'}.
                      Recommended regimen includes daily herbal decoctions, therapeutic Abhyanga, and mindful Dinacharya practices.
                    </p>
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
