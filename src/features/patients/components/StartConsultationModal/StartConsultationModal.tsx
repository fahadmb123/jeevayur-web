import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, FileText, CheckCircle2, Sparkles, HeartPulse, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { Appointment } from '@/features/appointments';
import './StartConsultationModal.css';

export interface StartConsultationModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (appointmentId: number | string, notes?: string) => void;
}

const DOSHA_OPTIONS = [
  'Vata (Air/Ether)',
  'Pitta (Fire/Water)',
  'Kapha (Earth/Water)',
  'Vata-Pitta',
  'Pitta-Kapha',
  'Tridoshic',
];

const CONCERN_PRESETS = [
  'Digestive Agni Weakness',
  'Insomnia & Nervous Fatigue',
  'Joint Stiffness / Vata Vyadhi',
  'Skin Inflammation / Pitta',
  'Chronic Stress & Anxiety',
  'Respiratory Kapha Congestion',
];

const THERAPY_PRESETS = [
  'Shirodhara with Warm Herbal Oil',
  'Abhyanga Full-Body Therapy',
  'Swedana Herbal Steam Bath',
  'Smriti Meditation & Pranayama',
  'Kashaya Vasti Protocol',
  'Ahara (Ayurvedic Diet) Prescription',
];

const FOLLOW_UP_OPTIONS = ['In 3 Days', 'In 1 Week', 'In 2 Weeks', 'In 1 Month', 'SOS / As Needed'];

export const StartConsultationModal: React.FC<StartConsultationModalProps> = React.memo(({
  appointment,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [selectedDosha, setSelectedDosha] = useState<string>('Vata-Pitta');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedTherapies, setSelectedTherapies] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState<string>('In 1 Week');
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleConcern = useCallback((item: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  }, []);

  const toggleTherapy = useCallback((item: string) => {
    setSelectedTherapies((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  }, []);

  const handleFinish = useCallback(() => {
    if (!appointment) return;
    setIsCompleted(true);

    const compiledNotes = [
      `Dosha: ${selectedDosha}`,
      selectedConcerns.length > 0 ? `Clinical Focus: ${selectedConcerns.join(', ')}` : '',
      selectedTherapies.length > 0 ? `Recommended Therapies: ${selectedTherapies.join(', ')}` : '',
      `Follow-up: ${followUp}`,
      notes.trim() ? `Physician Observations: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setTimeout(() => {
      onComplete?.(appointment.id, compiledNotes);
      setIsCompleted(false);
      onClose();
    }, 900);
  }, [appointment, selectedDosha, selectedConcerns, selectedTherapies, followUp, notes, onComplete, onClose]);

  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="consult-modal-backdrop" onClick={onClose}>
          <motion.div
            className="consult-modal"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="consult-modal__header">
              <div className="consult-modal__title-wrap">
                {appointment.isVideo ? (
                  <Video size={24} className="consult-modal__icon" />
                ) : (
                  <FileText size={24} className="consult-modal__icon" />
                )}
                <div>
                  <h3 className="consult-modal__title">{appointment.patient}</h3>
                  <span className="consult-modal__type">
                    {appointment.type} • {appointment.time} {appointment.meridian}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="consult-modal__close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {isCompleted ? (
              <div className="consult-modal__success">
                <CheckCircle2 size={48} className="consult-modal__success-icon" />
                <h4>Consultation Concluded</h4>
                <p>Clinical summary & Ayurvedic regimen saved for {appointment.patient}.</p>
              </div>
            ) : (
              <div className="consult-modal__body">
                <div className="consult-modal__section">
                  <label className="consult-modal__label">
                    <Sparkles size={14} className="consult-modal__label-icon" />
                    <span>Prakriti / Current Dosha Imbalance</span>
                  </label>
                  <div className="consult-modal__chips-row">
                    {DOSHA_OPTIONS.map((dosha) => (
                      <button
                        key={dosha}
                        type="button"
                        className={`consult-modal__chip ${selectedDosha === dosha ? 'chip--active' : ''}`}
                        onClick={() => setSelectedDosha(dosha)}
                      >
                        {dosha}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="consult-modal__section">
                  <label className="consult-modal__label">
                    <HeartPulse size={14} className="consult-modal__label-icon" />
                    <span>Key Symptoms & Concerns Identified</span>
                  </label>
                  <div className="consult-modal__chips-row">
                    {CONCERN_PRESETS.map((concern) => {
                      const isSelected = selectedConcerns.includes(concern);
                      return (
                        <button
                          key={concern}
                          type="button"
                          className={`consult-modal__chip ${isSelected ? 'chip--active' : ''}`}
                          onClick={() => toggleConcern(concern)}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {concern}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="consult-modal__section">
                  <label className="consult-modal__label">
                    <ShieldCheck size={14} className="consult-modal__label-icon" />
                    <span>Prescribed Therapy & Interventions</span>
                  </label>
                  <div className="consult-modal__chips-row">
                    {THERAPY_PRESETS.map((therapy) => {
                      const isSelected = selectedTherapies.includes(therapy);
                      return (
                        <button
                          key={therapy}
                          type="button"
                          className={`consult-modal__chip ${isSelected ? 'chip--active' : ''}`}
                          onClick={() => toggleTherapy(therapy)}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {therapy}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="consult-modal__section">
                  <label className="consult-modal__label">Next Follow-up Review</label>
                  <div className="consult-modal__chips-row">
                    {FOLLOW_UP_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`consult-modal__chip ${followUp === opt ? 'chip--active' : ''}`}
                        onClick={() => setFollowUp(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="consult-modal__field">
                  <label htmlFor="consultNotes" className="consult-modal__label">
                    Clinical Observations & Ahara Recommendations
                  </label>
                  <textarea
                    id="consultNotes"
                    rows={3}
                    placeholder="Document specific herbal formulations (kashayam, thailam), dietary modifications, or lifestyle advice..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="consult-modal__actions">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleFinish}>
                    Complete & Save Summary
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

StartConsultationModal.displayName = 'StartConsultationModal';
