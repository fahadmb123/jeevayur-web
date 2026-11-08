import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, CheckCircle2, Stethoscope, Video, Globe, Phone, Mail, FileText, User } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { Patient } from '../types';
import './AddPatientModal.css';

export interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient?: (patient: Omit<Patient, 'id'>) => Promise<unknown> | void;
}

const COMMON_LANGUAGES = [
  'English',
  'Malayalam',
  'Hindi',
  'Tamil',
  'Kannada',
  'Telugu',
  'Arabic',
  'French',
  'German',
  'Spanish',
];

export const AddPatientModal: React.FC<AddPatientModalProps> = React.memo(({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [type, setType] = useState('Ayurveda Treatment');
  const [format, setFormat] = useState('Offline (In-Clinic Consultation)');
  const [language, setLanguage] = useState('English');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = React.useCallback(() => {
    setType('Ayurveda Treatment');
    setFormat('Offline (In-Clinic Consultation)');
    setLanguage('English');
    setName('');
    setEmail('');
    setPhone('');
    setReason('');
    setSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const handleClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      setIsSubmitting(true);
      const isOnline = format.toLowerCase().includes('online');
      const conditionString = `${type} (${isOnline ? 'online' : 'offline'}): ${reason.trim() || 'General Consultation'}`;

      try {
        await onAddPatient?.({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          condition: conditionString,
          status: 'Consultation',
          lastVisit: 'Today (New Entry)',
          age: 30,
        });
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 1200);
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, phone, type, format, reason, onAddPatient, handleClose]
  );

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
                <UserPlus size={22} className="add-patient-modal__icon" />
                <h3 className="add-patient-modal__title">Add New Patient</h3>
              </div>
              <button
                className="add-patient-modal__close-btn"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="add-patient-modal__body">
              {submitted ? (
                <div className="add-patient-modal__success">
                  <CheckCircle2 size={48} className="add-patient-modal__success-icon" />
                  <h4>Patient Enrolled Successfully!</h4>
                  <p>{name} has been recorded into the clinical patient register.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="add-patient-modal__form">
                  <div className="add-patient-modal__grid-2">
                    <div className="add-patient-modal__field">
                      <label htmlFor="patientType">
                        <Stethoscope size={13} />
                        <span>Care Service Type</span>
                      </label>
                      <select
                        id="patientType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="Ayurveda Treatment">Ayurveda Treatment</option>
                        <option value="Yoga Class">Yoga Class</option>
                      </select>
                    </div>

                    <div className="add-patient-modal__field">
                      <label htmlFor="patientFormat">
                        <Video size={13} />
                        <span>Consultation Format</span>
                      </label>
                      <select
                        id="patientFormat"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                      >
                        <option value="Offline (In-Clinic Consultation)">Offline (In-Clinic)</option>
                        <option value="Online (Video Consultation)">Online (Video Call)</option>
                      </select>
                    </div>
                  </div>

                  <div className="add-patient-modal__grid-2">
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
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="add-patient-modal__field">
                      <label htmlFor="patientLanguage">
                        <Globe size={13} />
                        <span>Language</span>
                      </label>
                      <select
                        id="patientLanguage"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        {COMMON_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="add-patient-modal__grid-2">
                    <div className="add-patient-modal__field">
                      <label htmlFor="patientEmail">
                        <Mail size={13} />
                        <span>Email Address</span>
                      </label>
                      <input
                        id="patientEmail"
                        type="email"
                        placeholder="patient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="add-patient-modal__field">
                      <label htmlFor="patientPhone">
                        <Phone size={13} />
                        <span>Phone Number</span>
                      </label>
                      <input
                        id="patientPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="add-patient-modal__field">
                    <label htmlFor="patientReason">
                      <FileText size={13} />
                      <span>Reason / Chief Health Concern</span>
                    </label>
                    <textarea
                      id="patientReason"
                      rows={3}
                      placeholder="Specify primary health concerns, symptoms, or therapy requirements..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="add-patient-modal__actions">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Registering...' : 'Add Patient'}
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
