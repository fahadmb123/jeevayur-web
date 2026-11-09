import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { InternationalPhoneInput, findCountryByDialCode } from '@/shared/ui/InternationalPhoneInput';
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

  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { book, loading } = useBookAppointment();
  const [submitted, setSubmitted] = useState(false);

  const handleProceedToReview = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setPhoneError(null);
      if (!formData.fullName) return;
      if (!formData.phone) {
        setPhoneError('Please enter your phone number');
        return;
      }
      const country = findCountryByDialCode(formData.phone);
      const clean = formData.phone.replace(/\s+/g, '');
      const digits = clean.startsWith(country.dialCode)
        ? clean.slice(country.dialCode.length).replace(/\D/g, '')
        : clean.replace(/\D/g, '');
      const validation = country.validateDigits(digits);
      if (validation) {
        setPhoneError(validation);
        return;
      }
      setStep('confirm');
    },
    [formData.fullName, formData.phone]
  );

  const handleFinalConfirm = useCallback(
    async () => {
      try {
        await book(formData);
        setSubmitted(true);
        setTimeout(() => {
          onSuccess?.(formData);
          setSubmitted(false);
          setStep('form');
          onClose();
        }, 1400);
      } catch {
      }
    },
    [formData, book, onSuccess, onClose]
  );

  const handleClose = useCallback(() => {
    setStep('form');
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="book-modal-backdrop" onClick={handleClose}>
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
                <h3 className="book-modal__title">
                  {step === 'confirm' ? 'Confirm Consultation' : 'Book Consultation'}
                </h3>
                <p className="book-modal__subtitle">
                  {step === 'confirm'
                    ? 'Review your consultation request'
                    : 'Holistic healing tailored for you'}
                </p>
              </div>
              <button
                className="book-modal__close-btn"
                onClick={handleClose}
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
            ) : step === 'confirm' ? (
              <div className="book-modal__confirm-view">
                <div className="book-modal__confirm-table">
                  <div className="book-modal__confirm-row">
                    <span className="book-modal__confirm-label">Patient Name</span>
                    <strong className="book-modal__confirm-val">{formData.fullName}</strong>
                  </div>
                  <div className="book-modal__confirm-row">
                    <span className="book-modal__confirm-label">Phone Number</span>
                    <strong className="book-modal__confirm-val">{formData.phone}</strong>
                  </div>
                  <div className="book-modal__confirm-row">
                    <span className="book-modal__confirm-label">Selected Therapy</span>
                    <strong className="book-modal__confirm-val">{formData.service}</strong>
                  </div>
                  {formData.preferredDate && (
                    <div className="book-modal__confirm-row">
                      <span className="book-modal__confirm-label">Preferred Date</span>
                      <strong className="book-modal__confirm-val">{formData.preferredDate}</strong>
                    </div>
                  )}
                </div>

                <div className="book-modal__confirm-notice">
                  <ShieldCheck size={16} />
                  <span>Our medical team will review your booking and confirm your appointment.</span>
                </div>

                <div className="book-modal__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('form')}
                    disabled={loading}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleFinalConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      'Confirming...'
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Confirm &amp; Book</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProceedToReview} className="book-modal__form">
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
                  <InternationalPhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, phone: val }));
                      setPhoneError(null);
                    }}
                    error={phoneError || undefined}
                    defaultCountryCode="IN"
                  />
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
                  <Button type="button" variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    <span>Review &amp; Confirm</span>
                    <ArrowRight size={15} />
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
