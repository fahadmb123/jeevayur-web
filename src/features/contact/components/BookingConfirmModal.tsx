import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CalendarCheck,
  MapPin,
  Video,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Leaf,
  Sparkles,
  ShieldCheck,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { BookingAppointmentForm } from '../types';
import './BookingConfirmModal.css';

export interface BookingConfirmModalProps {
  isOpen: boolean;
  bookingData: BookingAppointmentForm | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = React.memo(({
  isOpen,
  bookingData,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!bookingData) return null;

  const isAyurveda = bookingData.type === 'ayurveda treatment';
  const isOnline = bookingData.format === 'online';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="booking-confirm-backdrop" onClick={onClose}>
          <motion.div
            className="booking-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirm-title"
          >
            <div className="booking-confirm-modal__header">
              <div className="booking-confirm-modal__title-wrap">
                <div className="booking-confirm-modal__icon-badge">
                  <CalendarCheck size={22} />
                </div>
                <div>
                  <h3 id="booking-confirm-title" className="booking-confirm-modal__title">
                    Confirm Consultation Booking
                  </h3>
                  <p className="booking-confirm-modal__subtitle">
                    Please review your appointment request before finalizing
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="booking-confirm-modal__close-btn"
                onClick={onClose}
                aria-label="Close review dialog"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>

            <div className="booking-confirm-modal__body">
              <div className="booking-confirm-summary-hero">
                <div className="booking-confirm-service-pill">
                  {isAyurveda ? <Leaf size={15} /> : <Sparkles size={15} />}
                  <span>{isAyurveda ? 'Ayurveda Treatment' : 'Yoga Class'}</span>
                </div>
                <div className="booking-confirm-format-pill">
                  {isOnline ? <Video size={14} /> : <MapPin size={14} />}
                  <span>{isOnline ? 'Online (Virtual Consultation)' : 'Offline (In-Clinic in Kottakkal)'}</span>
                </div>
              </div>

              <div className="booking-confirm-info-table">
                <div className="booking-confirm-row">
                  <div className="booking-confirm-label">
                    <User size={14} />
                    <span>Patient Name</span>
                  </div>
                  <div className="booking-confirm-value">{bookingData.name}</div>
                </div>

                <div className="booking-confirm-row">
                  <div className="booking-confirm-label">
                    <Phone size={14} />
                    <span>Phone Number</span>
                  </div>
                  <div className="booking-confirm-value">{bookingData.phone}</div>
                </div>

                <div className="booking-confirm-row">
                  <div className="booking-confirm-label">
                    <Mail size={14} />
                    <span>Email Address</span>
                  </div>
                  <div className="booking-confirm-value">{bookingData.email}</div>
                </div>

                <div className="booking-confirm-row">
                  <div className="booking-confirm-label">
                    <Globe size={14} />
                    <span>Consultation Language</span>
                  </div>
                  <div className="booking-confirm-value">{bookingData.language}</div>
                </div>
              </div>

              {bookingData.reason && (
                <div className="booking-confirm-concern-card">
                  <div className="booking-confirm-concern-header">
                    <FileText size={14} />
                    <span>Reason for Visit & Health Concern</span>
                  </div>
                  <p className="booking-confirm-concern-text">{bookingData.reason}</p>
                </div>
              )}

              <div className="booking-confirm-assurance-box">
                <ShieldCheck size={18} className="booking-confirm-assurance-icon" />
                <p className="booking-confirm-assurance-text">
                  Your request is submitted directly to Dr. Ahalya T.S. and our clinical coordinator. You will receive an immediate acknowledgment email with visit details.
                </p>
              </div>
            </div>

            <div className="booking-confirm-modal__footer">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={onConfirm}
                disabled={isLoading}
                className="booking-confirm-submit-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="booking-confirm-spinner" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Confirm & Submit Booking</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

BookingConfirmModal.displayName = 'BookingConfirmModal';
