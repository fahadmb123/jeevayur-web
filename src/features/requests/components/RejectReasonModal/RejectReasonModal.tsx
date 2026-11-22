import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { PatientRequest } from '../../types';
import './RejectReasonModal.css';

export interface RejectReasonModalProps {
  request: PatientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (request: PatientRequest, reason: string) => void;
  isProcessing?: boolean;
}

const COMMON_REASONS = [
  'Doctor appointment slots are fully booked for requested dates',
  'Condition requires urgent tertiary emergency care',
  'Outside Ayurvedic psychiatry / clinical scope',
  'Patient requested cancellation or scheduling conflict',
  'Insufficient clinical information provided',
];

export const RejectReasonModal: React.FC<RejectReasonModalProps> = React.memo(({
  request,
  isOpen,
  onClose,
  onConfirmReject,
  isProcessing = false,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleConfirm = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!request) return;
      const finalReason = isCustom && customReason.trim() ? customReason.trim() : selectedReason;
      onConfirmReject(request, finalReason);
    },
    [request, isCustom, customReason, selectedReason, onConfirmReject]
  );

  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="reject-modal-backdrop">
          <motion.div
            className="reject-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="reject-modal__header">
              <div className="reject-modal__title-wrap">
                <div className="reject-modal__icon-wrap">
                  <AlertTriangle size={20} className="reject-modal__icon" />
                </div>
                <div>
                  <h3 className="reject-modal__title">Decline Consultation Request</h3>
                  <p className="reject-modal__subtitle">
                    Request for <strong>{request.patientName}</strong> ({request.id})
                  </p>
                </div>
              </div>
              <button className="reject-modal__close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirm} className="reject-modal__form">
              <div className="reject-modal__body">
                <p className="reject-modal__instruction">
                  Please select or specify a reason for declining. This note will be recorded in the clinic audit log.
                </p>

                <div className="reject-modal__reasons-list">
                  {COMMON_REASONS.map((reason, idx) => (
                    <label key={idx} className="reject-modal__radio-label">
                      <input
                        type="radio"
                        name="rejectReason"
                        checked={!isCustom && selectedReason === reason}
                        onChange={() => {
                          setSelectedReason(reason);
                          setIsCustom(false);
                        }}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}

                  <label className="reject-modal__radio-label">
                    <input
                      type="radio"
                      name="rejectReason"
                      checked={isCustom}
                      onChange={() => setIsCustom(true)}
                    />
                    <span>Other (specify custom reason)</span>
                  </label>
                </div>

                {isCustom && (
                  <div className="reject-modal__custom-box">
                    <textarea
                      rows={3}
                      placeholder="Enter specific clinical or administrative reason..."
                      required={isCustom}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="reject-modal__footer">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="reject-modal__confirm-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Decline Request...' : 'Confirm Decline'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

RejectReasonModal.displayName = 'RejectReasonModal';
