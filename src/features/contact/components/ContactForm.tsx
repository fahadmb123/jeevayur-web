import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  CalendarCheck,
  Globe,
  Sparkles,
  MapPin,
  Video,
  Leaf,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useContact } from '../hooks/useContact';
import { POPULAR_LANGUAGES, ALL_WORLD_LANGUAGES } from '../data/languages';
import { BookingConfirmModal } from './BookingConfirmModal';
import type { BookingAppointmentForm } from '../types';

const bookingSchema = z.object({
  type: z.enum(['ayurveda treatment', 'yoga class'], {
    required_error: 'Please select a service type',
  }),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(6, 'Please enter a valid contact phone number'),
  reason: z.string().trim().min(5, 'Please describe the reason for your visit (min 5 characters)'),
  format: z.enum(['online', 'offline'], {
    required_error: 'Please select online or offline format',
  }),
  language: z.string().min(1, 'Please select your preferred language'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export const ContactForm: React.FC = React.memo(() => {
  const [searchParams] = useSearchParams();
  const { sendMessage, loading, success, reset } = useContact();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookingAppointmentForm | null>(null);

  const typeParam = searchParams.get('type')?.toLowerCase();
  const initialType: 'ayurveda treatment' | 'yoga class' =
    typeParam && typeParam.includes('yoga') ? 'yoga class' : 'ayurveda treatment';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      type: initialType,
      name: '',
      email: '',
      phone: '',
      reason: '',
      format: 'offline',
      language: 'English',
    },
  });

  const selectedType = watch('type');
  const selectedFormat = watch('format');

  useEffect(() => {
    if (typeParam) {
      if (typeParam.includes('yoga')) {
        setValue('type', 'yoga class');
      } else {
        setValue('type', 'ayurveda treatment');
      }
    }
  }, [typeParam, setValue]);

  const handleReviewBooking = useCallback((values: BookingFormValues) => {
    const payload: BookingAppointmentForm = {
      type: values.type,
      name: values.name,
      email: values.email,
      phone: values.phone,
      reason: values.reason,
      format: values.format,
      language: values.language,
    };
    setPendingValues(payload);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmFinal = useCallback(async () => {
    if (!pendingValues) return;
    try {
      await sendMessage(pendingValues);
      setIsConfirmOpen(false);
      setPendingValues(null);
    } catch {
    }
  }, [pendingValues, sendMessage]);

  const handleCloseConfirm = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const handleBookAnother = () => {
    reset();
    setIsConfirmOpen(false);
    setPendingValues(null);
    resetForm({
      type: 'ayurveda treatment',
      name: '',
      email: '',
      phone: '',
      reason: '',
      format: 'offline',
      language: 'English',
    });
  };

  return (
    <div className="contact-form-wrapper" id="booking-form">
      <Card className="contact-form-card">
        {success ? (
          <div className="contact-form__success">
            <CheckCircle2 size={54} className="contact-form__success-icon" />
            <h4>Appointment Request Confirmed</h4>
            <p>
              Thank you for choosing Jeevayurniketan Sanctuary. Our clinical patient care team will
              review your details and contact you via phone and email shortly.
            </p>
            <div className="contact-form__summary">
              <div className="contact-form__summary-row">
                <span className="summary-label">Service:</span>
                <span className="summary-value">
                  {selectedType === 'ayurveda treatment' ? 'Ayurveda Treatment' : 'Yoga Class'}
                </span>
              </div>
              <div className="contact-form__summary-row">
                <span className="summary-label">Format:</span>
                <span className="summary-value">
                  {selectedFormat === 'online' ? 'Online (Virtual)' : 'Offline (In-Person Clinic)'}
                </span>
              </div>
              <div className="contact-form__summary-row">
                <span className="summary-label">Contact Phone:</span>
                <span className="summary-value">{watch('phone')}</span>
              </div>
              <div className="contact-form__summary-row">
                <span className="summary-label">Preferred Language:</span>
                <span className="summary-value">{watch('language')}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleBookAnother}
              className="mt-4"
            >
              Book Another Appointment
            </Button>
          </div>
        ) : (
          <>
            <div className="contact-form-header">
              <h3>Book Appointment & Inquire</h3>
              <p>Schedule your personalized Ayurveda treatment or yoga session with our clinical specialists.</p>
            </div>

            <form onSubmit={handleSubmit(handleReviewBooking)} className="contact-form" noValidate>
              <div className="contact-form__field">
                <label className="field-title">Appointment / Service Type</label>
                <div className="appointment-type-selector">
                  <button
                    type="button"
                    className={`type-choice-btn ${selectedType === 'ayurveda treatment' ? 'active' : ''}`}
                    onClick={() => setValue('type', 'ayurveda treatment', { shouldValidate: true })}
                  >
                    <Leaf size={18} className="type-icon" />
                    <div className="type-info">
                      <span className="type-title">Ayurveda Treatment</span>
                      <span className="type-subtitle">Clinical consultation & therapies</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`type-choice-btn ${selectedType === 'yoga class' ? 'active' : ''}`}
                    onClick={() => setValue('type', 'yoga class', { shouldValidate: true })}
                  >
                    <Sparkles size={18} className="type-icon" />
                    <div className="type-info">
                      <span className="type-title">Yoga Class</span>
                      <span className="type-subtitle">Therapeutic asana & meditation</span>
                    </div>
                  </button>
                </div>
                {errors.type && <span className="field-error">{errors.type.message}</span>}
              </div>

              <div className="contact-form__field">
                <label className="field-title">Consultation Format</label>
                <div className="appointment-format-selector">
                  <button
                    type="button"
                    className={`format-choice-btn ${selectedFormat === 'offline' ? 'active' : ''}`}
                    onClick={() => setValue('format', 'offline', { shouldValidate: true })}
                  >
                    <MapPin size={17} className="format-icon" />
                    <div className="format-info">
                      <span className="format-title">Offline (In-Person)</span>
                      <span className="format-subtitle">Sanctuary Clinic in Kottakkal</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`format-choice-btn ${selectedFormat === 'online' ? 'active' : ''}`}
                    onClick={() => setValue('format', 'online', { shouldValidate: true })}
                  >
                    <Video size={17} className="format-icon" />
                    <div className="format-info">
                      <span className="format-title">Online (Virtual)</span>
                      <span className="format-subtitle">Tele-health Video Consultation</span>
                    </div>
                  </button>
                </div>
                {errors.format && <span className="field-error">{errors.format.message}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="bookingName" className="field-title">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="bookingName"
                  type="text"
                  placeholder="e.g. Ananya Nair"
                  {...register('name')}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name.message}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="bookingEmail" className="field-title">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="bookingEmail"
                  type="email"
                  placeholder="e.g. ananya@example.com"
                  {...register('email')}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="bookingPhone" className="field-title">
                  <Phone size={14} className="inline mr-1 text-primary-green" />
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="bookingPhone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  {...register('phone')}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone.message}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="bookingReason" className="field-title">
                  Reason for Appointment / Symptoms <span className="required-star">*</span>
                </label>
                <textarea
                  id="bookingReason"
                  rows={3}
                  placeholder="Please describe your primary health concern, symptoms, treatment inquiry, or wellness goals..."
                  {...register('reason')}
                  className={errors.reason ? 'input-error' : ''}
                />
                {errors.reason && <span className="field-error">{errors.reason.message}</span>}
              </div>

              <div className="contact-form__field">
                <label htmlFor="bookingLanguage" className="field-title">
                  <Globe size={15} className="inline mr-1 text-primary-green" />
                  Preferred Language <span className="required-star">*</span>
                </label>
                <div className="language-select-wrapper">
                  <select
                    id="bookingLanguage"
                    {...register('language')}
                    className="language-select"
                  >
                    <optgroup label="Popular & Regional Languages">
                      {POPULAR_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.name} {lang.nativeName && lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All World Languages (A - Z)">
                      {ALL_WORLD_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.name} {lang.nativeName && lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {errors.language && <span className="field-error">{errors.language.message}</span>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="confirm-booking-btn"
              >
                <CalendarCheck size={18} />
                <span>Review &amp; Confirm Consultation</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </>
        )}
      </Card>

      <BookingConfirmModal
        isOpen={isConfirmOpen}
        bookingData={pendingValues}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmFinal}
        isLoading={loading}
      />
    </div>
  );
});

ContactForm.displayName = 'ContactForm';
