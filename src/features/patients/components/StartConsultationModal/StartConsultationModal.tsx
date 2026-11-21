import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { Appointment } from '@/features/appointments';
import './StartConsultationModal.css';

export interface StartConsultationModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (appointmentId: number) => void;
}

export const StartConsultationModal: React.FC<StartConsultationModalProps> = React.memo(({
  appointment,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFinish = React.useCallback(() => {
    if (!appointment) return;
    setIsCompleted(true);
    setTimeout(() => {
      onComplete?.(appointment.id);
      setIsCompleted(false);
      onClose();
    }, 1000);
  }, [appointment, onComplete, onClose]);

  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="consult-modal-backdrop" onClick={onClose}>
          <motion.div
            className="consult-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="consult-modal__header">
              <div className="consult-modal__title-wrap">
                {appointment.isVideo ? (
                  <Video size={22} className="consult-modal__icon" />
                ) : (
                  <FileText size={22} className="consult-modal__icon" />
                )}
                <div>
                  <h3 className="consult-modal__title">{appointment.patient}</h3>
                  <span className="consult-modal__type">{appointment.type} • {appointment.time} {appointment.meridian}</span>
                </div>
              </div>
              <button
                className="consult-modal__close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {isCompleted ? (
              <div className="consult-modal__success">
                <CheckCircle2 size={44} className="consult-modal__success-icon" />
                <h4>Session Concluded</h4>
                <p>Clinical notes saved for {appointment.patient}.</p>
              </div>
            ) : (
              <div className="consult-modal__body">
                <div className="consult-modal__field">
                  <label htmlFor="consultNotes">Clinical Consultation Notes</label>
                  <textarea
                    id="consultNotes"
                    rows={4}
                    placeholder="Document symptoms, Smriti meditation progress, or prescribed herbal recommendations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="consult-modal__actions">
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleFinish}>
                    Complete & Save
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
