import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Video,
  Globe,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { PatientAvatar } from '@/features/patients';
import type { PatientRequest } from '../types';
import './AcceptConfirmModal.css';

export interface AcceptConfirmModalProps {
  request: PatientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAccept: (request: PatientRequest) => void;
  isProcessing?: boolean;
}

export const AcceptConfirmModal: React.FC<AcceptConfirmModalProps> = React.memo(({
  request,
  isOpen,
  onClose,
  onConfirmAccept,
  isProcessing = false,
}) => {
  if (!request) return null;



  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAccept(request);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="accept-confirm-backdrop" onClick={onClose}>
          <motion.div
            className="accept-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accept-modal-title"
          >
            <div className="accept-confirm-modal__header">
              <div className="accept-confirm-modal__title-wrap">
                <div className="accept-confirm-modal__icon-badge">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 id="accept-modal-title" className="accept-confirm-modal__title">
                    Confirm Consultation Acceptance
                  </h3>
                  <p className="accept-confirm-modal__subtitle">
                    Review patient request before enrolling into directory
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="accept-confirm-modal__close-btn"
                onClick={onClose}
                aria-label="Close confirmation dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirm} className="accept-confirm-modal__form">
              <div className="accept-confirm-modal__body">
                <div className="accept-confirm-patient-card">
                  <PatientAvatar name={request.patientName} id={request.id} size={42} />
                  <div className="accept-confirm-patient-meta">
                    <div className="accept-confirm-patient-name-row">
                      <h4 className="accept-confirm-patient-name">{request.patientName}</h4>
                      <span className="accept-confirm-badge accept-confirm-badge--mode">
                        {request.mode === 'Video Call' ? <Video size={12} /> : <MapPin size={12} />}
                        <span>{request.mode}</span>
                      </span>
                    </div>
                    <span className="accept-confirm-patient-service">{request.service}</span>
                  </div>
                </div>

                <div className="accept-confirm-details-grid">
                  <div className="accept-confirm-detail-item">
                    <span className="accept-confirm-detail-label">
                      <Phone size={13} />
                      <span>Phone Number</span>
                    </span>
                    <span className="accept-confirm-detail-val">{request.phone}</span>
                  </div>

                  <div className="accept-confirm-detail-item">
                    <span className="accept-confirm-detail-label">
                      <Mail size={13} />
                      <span>Email Address</span>
                    </span>
                    <span className="accept-confirm-detail-val">{request.email}</span>
                  </div>

                  {request.language && (
                    <div className="accept-confirm-detail-item">
                      <span className="accept-confirm-detail-label">
                        <Globe size={13} />
                        <span>Language</span>
                      </span>
                      <span className="accept-confirm-detail-val">{request.language}</span>
                    </div>
                  )}

                  {request.preferredDate && (
                    <div className="accept-confirm-detail-item">
                      <span className="accept-confirm-detail-label">
                        <Calendar size={13} />
                        <span>Preferred Schedule</span>
                      </span>
                      <span className="accept-confirm-detail-val">
                        {request.preferredDate} {request.preferredTimeSlot ? `at ${request.preferredTimeSlot}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {request.primaryConcern && (
                  <div className="accept-confirm-concern-box">
                    <span className="accept-confirm-concern-heading">Chief Health Concern & Reason</span>
                    <p className="accept-confirm-concern-text">{request.primaryConcern}</p>
                  </div>
                )}

                <div className="accept-confirm-notice">
                  <div className="accept-confirm-notice-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="accept-confirm-notice-content">
                    <strong className="accept-confirm-notice-title">Automatic Patient Enrollment & Email</strong>
                    <p className="accept-confirm-notice-desc">
                      Accepting will automatically register <strong>{request.patientName}</strong> in your active patient database and send an official consultation confirmation email to <strong>{request.email}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="accept-confirm-modal__footer">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="accept-confirm-submit-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="accept-confirm-spinner" />
                      <span>Accepting & Enrolling...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm & Accept Consultation</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AcceptConfirmModal.displayName = 'AcceptConfirmModal';

