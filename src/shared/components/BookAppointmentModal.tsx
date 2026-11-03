import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useBookAppointment } from '@/features/appointments/hooks/useBookAppointment';
import type { BookingFormData } from '@/features/appointments/types';
import './BookAppointmentModal.css';

export interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: BookingFormData) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = React.memo(({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    service: 'Smriti Meditation',
    preferredDate: '',
    notes: '',
  });

  const { book, loading } = useBookAppointment();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.fullName || !formData.phone) return;
      try {
        await book(formData);
        setSubmitted(true);
        setTimeout(() => {
          onSuccess?.(formData);
          setSubmitted(false);
          onClose();
        }, 1400);
      } catch {
      }
    },
    [formData, book, onSuccess, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="book-modal-backdrop" onClick={onClose}>
          <motion.div
            className="book-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="book-modal__header">
              <div>
                <h3 className="book-modal__title">Book Consultation</h3>
                <p className="book-modal__subtitle">Holistic healing tailored for you</p>
              </div>
              <button
                className="book-modal__close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="book-modal__success">
                <CheckCircle2 size={48} className="book-modal__success-icon" />
                <h4>Appointment Requested!</h4>
                <p>Our clinic will contact you shortly to confirm your slot.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="book-modal__form">
                <div className="book-modal__field">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="book-modal__input-wrapper">
                    <User size={18} className="book-modal__input-icon" />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Ramesh Menon"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="book-modal__field">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="book-modal__input-wrapper">
                    <Phone size={18} className="book-modal__input-icon" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="book-modal__field">
                  <label htmlFor="service">Therapy / Service</label>
                  <select
                    id="service"
                    className="book-modal__select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Smriti Meditation">Smriti Meditation</option>
                    <option value="Psychotherapy">Ayurvedic Psychotherapy</option>
                    <option value="Stress Management">Stress Management Program</option>
                    <option value="General Consultation">General Ayurveda Consultation</option>
                  </select>
                </div>

                <div className="book-modal__field">
                  <label htmlFor="preferredDate">Preferred Date</label>
                  <div className="book-modal__input-wrapper">
                    <Calendar size={18} className="book-modal__input-icon" />
                    <input
                      id="preferredDate"
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="book-modal__actions">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

BookAppointmentModal.displayName = 'BookAppointmentModal';

