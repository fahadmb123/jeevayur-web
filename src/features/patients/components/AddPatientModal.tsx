import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Sparkles,
  MapPin,
  Video,
  User,
  Phone,
  Mail,
  Globe,
  FileText,
  ShieldCheck,
  Check,
  ArrowRight,
  Loader2,
  CalendarCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { InternationalPhoneInput, findCountryByDialCode } from '@/shared/ui/InternationalPhoneInput';
import { POPULAR_LANGUAGES, ALL_WORLD_LANGUAGES } from '@/features/contact/data/languages';
import type { Patient } from '../types';
import './AddPatientModal.css';

export interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient?: (patient: Omit<Patient, 'id'>) => Promise<unknown> | void;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  language?: string;
  gender?: string;
  reason?: string;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = React.memo(({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [type, setType] = useState<'ayurveda treatment' | 'yoga class'>('ayurveda treatment');
  const [format, setFormat] = useState<'offline' | 'online'>('offline');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState<string>('32');
  const [reason, setReason] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = useCallback((field: keyof FormErrors, customVal?: string): string | undefined => {
    switch (field) {
      case 'name': {
        const v = (customVal !== undefined ? customVal : name).trim();
        if (!v) return 'Patient full name is required';
        if (v.length < 2) return 'Patient name must be at least 2 characters';
        if (v.length > 100) return 'Patient name cannot exceed 100 characters';
        return undefined;
      }
      case 'phone': {
        const v = (customVal !== undefined ? customVal : phone).trim();
        if (!v) return 'Contact phone number is required';
        const country = findCountryByDialCode(v);
        const clean = v.replace(/\s+/g, '');
        const digits = clean.startsWith(country.dialCode)
          ? clean.slice(country.dialCode.length).replace(/\D/g, '')
          : clean.replace(/\D/g, '');
        return country.validateDigits(digits) || undefined;
      }
      case 'email': {
        const v = (customVal !== undefined ? customVal : email).trim();
        if (v) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(v)) return 'Please enter a valid email address';
        }
        return undefined;
      }
      case 'age': {
        const v = (customVal !== undefined ? customVal : age).trim();
        if (!v) return 'Patient age is required';
        const num = Number(v);
        if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 120) {
          return 'Age must be a valid number between 1 and 120';
        }
        return undefined;
      }
      case 'language': {
        const v = (customVal !== undefined ? customVal : language).trim();
        if (!v) return 'Please select preferred consultation language';
        return undefined;
      }
      case 'gender': {
        const v = (customVal !== undefined ? customVal : gender).trim();
        if (!v) return 'Please select patient gender';
        return undefined;
      }
      case 'reason': {
        const v = (customVal !== undefined ? customVal : reason).trim();
        if (!v) return 'Please describe chief health concern or reason for visit';
        if (v.length < 5) return 'Health concern must be at least 5 characters';
        return undefined;
      }
      default:
        return undefined;
    }
  }, [name, phone, email, age, language, gender, reason]);

  const handleBlurField = useCallback((field: keyof FormErrors) => {
    const error = validateField(field);
    setFieldErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      }
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, [validateField]);

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const resetForm = useCallback(() => {
    setStep('form');
    setType('ayurveda treatment');
    setFormat('offline');
    setName('');
    setEmail('');
    setPhone('');
    setLanguage('English');
    setGender('Male');
    setAge('32');
    setReason('');
    setFieldErrors({});
    setSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleProceedToReview = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: FormErrors = {};
      const fieldsToCheck: (keyof FormErrors)[] = ['name', 'phone', 'email', 'age', 'language', 'gender', 'reason'];
      for (const f of fieldsToCheck) {
        const err = validateField(f);
        if (err) {
          newErrors[f] = err;
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }

      setFieldErrors({});
      setStep('confirm');
    },
    [validateField]
  );

  const handleFinalConfirm = useCallback(async () => {
    setIsSubmitting(true);
    const isOnline = format === 'online';
    const serviceName = type === 'ayurveda treatment' ? 'Ayurveda Treatment' : 'Yoga Class';
    const conditionString = `${serviceName} (${isOnline ? 'online' : 'offline'}): ${reason.trim() || 'General Consultation'}`;

    try {
      await onAddPatient?.({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        age: age ? parseInt(age, 10) : 30,
        condition: conditionString,
        status: 'Uncompleted',
        lastVisit: 'Today (Doctor Entry)',
      });
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  }, [type, format, reason, name, email, phone, gender, age, onAddPatient, handleClose]);

  const isAyurveda = type === 'ayurveda treatment';
  const isOnline = format === 'online';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="add-patient-backdrop" onClick={handleClose}>
          <motion.div
            className="add-patient-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="add-patient-modal__header">
              <div className="add-patient-modal__title-wrap">
                <div className="add-patient-modal__icon-badge">
                  {step === 'confirm' ? <CalendarCheck size={22} /> : <UserPlus size={22} />}
                </div>
                <div>
                  <h3 className="add-patient-modal__title">
                    {step === 'confirm' ? 'Confirm Patient Record' : 'Add New Patient'}
                  </h3>
                  <p className="add-patient-modal__subtitle">
                    {step === 'confirm'
                      ? 'Review clinical details before adding to directory'
                      : 'Create a new classical Ayurveda patient file'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="add-patient-modal__close-btn"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="add-patient-modal__body">
              {submitted ? (
                <div className="add-patient-modal__success">
                  <CheckCircle2 size={48} className="add-patient-modal__success-icon" />
                  <h4>Patient Enrolled Successfully!</h4>
                  <p>{name} has been recorded into the clinical patient register.</p>
                </div>
              ) : step === 'confirm' ? (
                <div className="add-patient-confirm-view">
                  <div className="add-patient-summary-hero">
                    <div className="add-patient-service-pill">
                      {isAyurveda ? <Leaf size={15} /> : <Sparkles size={15} />}
                      <span>{isAyurveda ? 'Ayurveda Treatment' : 'Yoga Class'}</span>
                    </div>
                    <div className="add-patient-format-pill">
                      {isOnline ? <Video size={14} /> : <MapPin size={14} />}
                      <span>{isOnline ? 'Online (Virtual Consultation)' : 'Offline (In-Clinic in Kottakkal)'}</span>
                    </div>
                  </div>

                  <div className="add-patient-info-table">
                    <div className="add-patient-table-row">
                      <div className="add-patient-table-label">
                        <User size={14} />
                        <span>Patient Name</span>
                      </div>
                      <div className="add-patient-table-value">{name}</div>
                    </div>

                    <div className="add-patient-table-row">
                      <div className="add-patient-table-label">
                        <Phone size={14} />
                        <span>Phone Number</span>
                      </div>
                      <div className="add-patient-table-value">{phone}</div>
                    </div>

                    {email && (
                      <div className="add-patient-table-row">
                        <div className="add-patient-table-label">
                          <Mail size={14} />
                          <span>Email Address</span>
                        </div>
                        <div className="add-patient-table-value">{email}</div>
                      </div>
                    )}

                    <div className="add-patient-table-row">
                      <div className="add-patient-table-label">
                        <Globe size={14} />
                        <span>Language</span>
                      </div>
                      <div className="add-patient-table-value">{language}</div>
                    </div>

                    <div className="add-patient-table-row">
                      <div className="add-patient-table-label">
                        <User size={14} />
                        <span>Demographics</span>
                      </div>
                      <div className="add-patient-table-value">
                        {gender}, {age || '30'} yrs
                      </div>
                    </div>
                  </div>

                  {reason && (
                    <div className="add-patient-concern-card">
                      <div className="add-patient-concern-header">
                        <FileText size={14} />
                        <span>Chief Health Concern &amp; Reason</span>
                      </div>
                      <p className="add-patient-concern-text">{reason}</p>
                    </div>
                  )}

                  <div className="add-patient-assurance-box">
                    <ShieldCheck size={18} className="add-patient-assurance-icon" />
                    <p className="add-patient-assurance-text">
                      Doctor Registered Patient — This record will be created directly in your active directory under Uncompleted status.
                    </p>
                  </div>

                  <div className="add-patient-modal__actions">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('form')}
                      disabled={isSubmitting}
                    >
                      Back to Edit
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleFinalConfirm}
                      disabled={isSubmitting}
                      className="add-patient-confirm-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="add-patient-spinner" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Confirm &amp; Register Patient</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProceedToReview} className="add-patient-modal__form">
                  <div className="add-patient-section-block">
                    <label className="add-patient-field-heading">Care Service Type</label>
                    <div className="add-patient-choice-grid">
                      <button
                        type="button"
                        className={`add-patient-choice-btn ${isAyurveda ? 'active' : ''}`}
                        onClick={() => setType('ayurveda treatment')}
                      >
                        <Leaf size={16} />
                        <span>Ayurveda Treatment</span>
                      </button>
                      <button
                        type="button"
                        className={`add-patient-choice-btn ${!isAyurveda ? 'active' : ''}`}
                        onClick={() => setType('yoga class')}
                      >
                        <Sparkles size={16} />
                        <span>Yoga Class</span>
                      </button>
                    </div>
                  </div>

                  <div className="add-patient-section-block">
                    <label className="add-patient-field-heading">Consultation Format</label>
                    <div className="add-patient-choice-grid">
                      <button
                        type="button"
                        className={`add-patient-choice-btn ${!isOnline ? 'active' : ''}`}
                        onClick={() => setFormat('offline')}
                      >
                        <MapPin size={16} />
                        <span>Offline (In-Clinic in Kottakkal)</span>
                      </button>
                      <button
                        type="button"
                        className={`add-patient-choice-btn ${isOnline ? 'active' : ''}`}
                        onClick={() => setFormat('online')}
                      >
                        <Video size={16} />
                        <span>Online (Virtual Consultation)</span>
                      </button>
                    </div>
                  </div>

                  <div className="add-patient-modal__field">
                    <label htmlFor="patientName">
                      <User size={13} />
                      <span>Patient Full Name *</span>
                    </label>
                    <input
                      id="patientName"
                      type="text"
                      required
                      placeholder="e.g. Ananya Patel"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError('name');
                      }}
                      onBlur={() => handleBlurField('name')}
                      className={fieldErrors.name ? 'has-error' : ''}
                    />
                    {fieldErrors.name && (
                      <span className="add-patient-field-error">
                        <AlertCircle size={12} />
                        <span>{fieldErrors.name}</span>
                      </span>
                    )}
                  </div>

                  <div className="add-patient-modal__field">
                    <label htmlFor="patientPhone">
                      <Phone size={13} />
                      <span>Phone Number *</span>
                    </label>
                    <InternationalPhoneInput
                      id="patientPhone"
                      value={phone}
                      onChange={(val) => {
                        setPhone(val);
                        clearFieldError('phone');
                      }}
                      error={fieldErrors.phone}
                      defaultCountryCode="IN"
                    />
                  </div>

                  <div className="add-patient-modal__field">
                    <label htmlFor="patientEmail">
                      <Mail size={13} />
                      <span>Email Address</span>
                    </label>
                    <input
                      id="patientEmail"
                      type="email"
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError('email');
                      }}
                      onBlur={() => handleBlurField('email')}
                      className={fieldErrors.email ? 'has-error' : ''}
                    />
                    {fieldErrors.email && (
                      <span className="add-patient-field-error">
                        <AlertCircle size={12} />
                        <span>{fieldErrors.email}</span>
                      </span>
                    )}
                  </div>

                  <div className="add-patient-modal__grid-3">
                    <div className="add-patient-modal__field">
                      <label htmlFor="patientLanguage">
                        <Globe size={13} />
                        <span>Language *</span>
                      </label>
                      <select
                        id="patientLanguage"
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          clearFieldError('language');
                        }}
                        onBlur={() => handleBlurField('language')}
                        className={fieldErrors.language ? 'has-error' : ''}
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
                      {fieldErrors.language && (
                        <span className="add-patient-field-error">
                          <AlertCircle size={12} />
                          <span>{fieldErrors.language}</span>
                        </span>
                      )}
                    </div>

                    <div className="add-patient-modal__field">
                      <label htmlFor="patientGender">
                        <User size={13} />
                        <span>Gender *</span>
                      </label>
                      <select
                        id="patientGender"
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                          clearFieldError('gender');
                        }}
                        onBlur={() => handleBlurField('gender')}
                        className={fieldErrors.gender ? 'has-error' : ''}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.gender && (
                        <span className="add-patient-field-error">
                          <AlertCircle size={12} />
                          <span>{fieldErrors.gender}</span>
                        </span>
                      )}
                    </div>

                    <div className="add-patient-modal__field">
                      <label htmlFor="patientAge">
                        <span>Age *</span>
                      </label>
                      <input
                        id="patientAge"
                        type="number"
                        min="1"
                        max="120"
                        placeholder="32"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          clearFieldError('age');
                        }}
                        onBlur={() => handleBlurField('age')}
                        className={fieldErrors.age ? 'has-error' : ''}
                      />
                      {fieldErrors.age && (
                        <span className="add-patient-field-error">
                          <AlertCircle size={12} />
                          <span>{fieldErrors.age}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="add-patient-modal__field">
                    <label htmlFor="patientReason">
                      <FileText size={13} />
                      <span>Chief Health Concern &amp; Reason *</span>
                    </label>
                    <textarea
                      id="patientReason"
                      rows={3}
                      placeholder="Describe primary health concern, symptoms, treatment history, or therapy inquiry (min 5 characters)..."
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        clearFieldError('reason');
                      }}
                      onBlur={() => handleBlurField('reason')}
                      className={fieldErrors.reason ? 'has-error' : ''}
                    />
                    {fieldErrors.reason && (
                      <span className="add-patient-field-error">
                        <AlertCircle size={12} />
                        <span>{fieldErrors.reason}</span>
                      </span>
                    )}
                  </div>

                  <div className="add-patient-modal__actions">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AddPatientModal.displayName = 'AddPatientModal';
