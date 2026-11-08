import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Video,
  Check,
  UserCheck,
  AlertCircle,
  Activity,
  Globe,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { StatusPill } from '@/shared/ui/status-pill';
import type { PatientRequest } from '../types';
import './RequestDetailModal.css';

export interface RequestDetailModalProps {
  request: PatientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (request: PatientRequest) => void;
  onReject: (request: PatientRequest) => void;
  isProcessing?: boolean;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = React.memo(({
  request,
  isOpen,
  onClose,
  onAccept,
  onReject,
  isProcessing = false,
}) => {
  const statusVariant = React.useMemo(() => {
    if (!request) return 'info';
    switch (request.status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }, [request]);

  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="consult-detail-backdrop" onClick={onClose}>
          <motion.div
            className="consult-detail-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="consult-detail-modal__header">
              <div className="consult-detail-modal__title-wrap">
                <div className="consult-detail-modal__avatar">
                  {request.patientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="consult-detail-modal__name-row">
                    <h2 className="consult-detail-modal__name">{request.patientName}</h2>
                    <StatusPill
                      status={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      variant={statusVariant}
                    />
                  </div>
                  <span className="consult-detail-modal__sub">
                    Booking ID: {request.id.slice(0, 8)} • Requested {request.requestedAt}
                  </span>
                </div>
              </div>
              <button
                className="consult-detail-modal__close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="consult-detail-modal__body">
              <div className="consult-detail-modal__section">
                <h4 className="consult-detail-modal__section-title">
                  <Phone size={15} /> Patient Contact Details
                </h4>
                <div className="consult-detail-modal__contact-grid">
                  <a href={`tel:${request.phone}`} className="consult-detail-modal__contact-pill">
                    <Phone size={14} />
                    <span>{request.phone}</span>
                  </a>
                  <a href={`mailto:${request.email}`} className="consult-detail-modal__contact-pill">
                    <Mail size={14} />
                    <span>{request.email}</span>
                  </a>
                  {request.language && (
                    <div className="consult-detail-modal__contact-pill consult-detail-modal__contact-pill--static">
                      <Globe size={14} />
                      <span>Language: {request.language}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="consult-detail-modal__section">
                <h4 className="consult-detail-modal__section-title">
                  <Calendar size={15} /> Appointment Specification
                </h4>
                <div className="consult-detail-modal__schedule-card">
                  <div className="consult-detail-modal__schedule-item">
                    <span className="consult-detail-modal__item-label">Selected Service</span>
                    <strong className="consult-detail-modal__item-value text-primary-green">
                      {request.service}
                    </strong>
                  </div>
                  <div className="consult-detail-modal__schedule-item">
                    <span className="consult-detail-modal__item-label">Format / Channel</span>
                    <span className="consult-detail-modal__mode-badge">
                      {request.mode === 'Video Call' ? <Video size={13} /> : <MapPin size={13} />}
                      {request.mode}
                    </span>
                  </div>
                  <div className="consult-detail-modal__schedule-item">
                    <span className="consult-detail-modal__item-label">Preferred Language</span>
                    <strong className="consult-detail-modal__item-value">
                      <Globe size={13} /> {request.language || 'English'}
                    </strong>
                  </div>
                  <div className="consult-detail-modal__schedule-item">
                    <span className="consult-detail-modal__item-label">Received At</span>
                    <strong className="consult-detail-modal__item-value">
                      <Clock size={13} /> {request.requestedAt}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="consult-detail-modal__section">
                <h4 className="consult-detail-modal__section-title">
                  <Activity size={15} /> Primary Reason & Health Concerns
                </h4>
                <div className="consult-detail-modal__concern-box">
                  <p className="consult-detail-modal__concern-desc">{request.primaryConcern}</p>
                </div>
              </div>

              {request.status === 'rejected' && request.rejectionReason && (
                <div className="consult-detail-modal__feedback-banner consult-detail-modal__feedback-banner--rejected">
                  <AlertCircle size={18} />
                  <div>
                    <h5 className="consult-detail-modal__banner-title">Appointment Declined</h5>
                    <p className="consult-detail-modal__banner-desc">{request.rejectionReason}</p>
                  </div>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="consult-detail-modal__feedback-banner consult-detail-modal__feedback-banner--accepted">
                  <UserCheck size={18} />
                  <div>
                    <h5 className="consult-detail-modal__banner-title">Appointment Confirmed</h5>
                    <p className="consult-detail-modal__banner-desc">
                      Patient has been confirmed and registered in your clinical records.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="consult-detail-modal__footer">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              {request.status === 'pending' && (
                <div className="consult-detail-modal__footer-actions">
                  <Button
                    variant="outline"
                    className="consult-card__btn-reject"
                    onClick={() => {
                      onClose();
                      onReject(request);
                    }}
                    disabled={isProcessing}
                  >
                    <X size={16} />
                    Decline Appointment
                  </Button>
                  <Button
                    variant="primary"
                    className="consult-card__btn-accept"
                    onClick={() => {
                      onAccept(request);
                    }}
                    disabled={isProcessing}
                  >
                    <Check size={16} />
                    Confirm Appointment
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

RequestDetailModal.displayName = 'RequestDetailModal';
export const ConsultationRequestDetailModal = RequestDetailModal;
