import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Video,
  Phone,
  Mail,
  Calendar,
  FileText,
  MapPin,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { Appointment } from '../../types';
import './AppointmentDetailModal.css';

export interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStartConsultation: (appointment: Appointment) => void;
  onMarkCompleted?: (appointmentId: number | string) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = React.memo(({
  appointment,
  isOpen,
  onClose,
  onStartConsultation,
  onMarkCompleted,
}) => {
  if (!appointment) return null;

  const isVideo = appointment.isVideo || (appointment.format || '').toLowerCase() === 'online';
  const isDone = appointment.status === 'completed';

  const cleanPhone = appointment.phone ? appointment.phone.replace(/[^0-9+]/g, '') : '';
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;
  const telLink = cleanPhone ? `tel:${cleanPhone}` : null;
  const mailLink = appointment.email ? `mailto:${appointment.email}` : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="appointment-detail-backdrop" onClick={onClose}>
          <motion.div
            className="appointment-detail-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment-detail-header">
              <div className="appointment-detail-title-wrap">
                <span className="appointment-detail-badge">
                  {isDone ? 'Completed Consultation' : appointment.status === 'next' ? 'Current Session' : 'Scheduled Appointment'}
                </span>
                <h3 className="appointment-detail-patient-name">{appointment.patient}</h3>
              </div>
              <button
                type="button"
                className="appointment-detail-close-btn"
                onClick={onClose}
                aria-label="Close appointment details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="appointment-detail-body">
              <div className="appointment-detail-meta-grid">
                <div className="appointment-detail-meta-item">
                  <Clock size={16} className="appointment-detail-meta-icon" />
                  <div>
                    <span className="appointment-detail-meta-label">Time & Slot</span>
                    <strong className="appointment-detail-meta-val">
                      {appointment.time} {appointment.meridian} • Today
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail-meta-item">
                  {isVideo ? (
                    <Video size={16} className="appointment-detail-meta-icon" />
                  ) : (
                    <MapPin size={16} className="appointment-detail-meta-icon" />
                  )}
                  <div>
                    <span className="appointment-detail-meta-label">Format</span>
                    <strong className="appointment-detail-meta-val">
                      {isVideo ? 'Online Video Teleconsult' : 'In-Clinic Sanctuary Visit'}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail-meta-item">
                  <FileText size={16} className="appointment-detail-meta-icon" />
                  <div>
                    <span className="appointment-detail-meta-label">Service Type</span>
                    <strong className="appointment-detail-meta-val">
                      {appointment.type}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail-meta-item">
                  <Calendar size={16} className="appointment-detail-meta-icon" />
                  <div>
                    <span className="appointment-detail-meta-label">Clinical Status</span>
                    <strong className={`appointment-detail-meta-val ${isDone ? 'val--done' : 'val--pending'}`}>
                      {isDone ? 'Concluded' : 'Awaiting Consultation'}
                    </strong>
                  </div>
                </div>
              </div>

              {(appointment.phone || appointment.email) && (
                <div className="appointment-detail-contact-box">
                  <span className="appointment-detail-section-title">Patient Contact & Quick Connect</span>
                  <div className="appointment-detail-contact-actions">
                    {telLink && (
                      <a href={telLink} className="appointment-detail-contact-btn">
                        <Phone size={14} />
                        <span>Call ({appointment.phone})</span>
                      </a>
                    )}
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="appointment-detail-contact-btn appointment-detail-contact-btn--wa"
                      >
                        <span>WhatsApp Message</span>
                      </a>
                    )}
                    {mailLink && (
                      <a href={mailLink} className="appointment-detail-contact-btn">
                        <Mail size={14} />
                        <span>Email Patient</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {appointment.reason && (
                <div className="appointment-detail-concern-box">
                  <span className="appointment-detail-section-title">Primary Concern / Health Goals</span>
                  <p className="appointment-detail-concern-text">{appointment.reason}</p>
                </div>
              )}
            </div>

            <div className="appointment-detail-footer">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>

              {!isDone && onMarkCompleted && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onMarkCompleted(appointment.id);
                    onClose();
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>Mark Done</span>
                </Button>
              )}

              {!isDone && (
                <Button
                  variant="primary"
                  onClick={() => {
                    onClose();
                    onStartConsultation(appointment);
                  }}
                >
                  <Play size={15} />
                  <span>Start Consultation</span>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AppointmentDetailModal.displayName = 'AppointmentDetailModal';
