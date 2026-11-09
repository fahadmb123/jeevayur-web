import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import './ConfirmSignOutModal.css';

export interface ConfirmSignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  isLoading?: boolean;
}

export const ConfirmSignOutModal: React.FC<ConfirmSignOutModalProps> = React.memo(({
  isOpen,
  onClose,
  onConfirm,
  title = 'Sign Out Confirmation',
  description = 'Are you sure you want to sign out of your practitioner account? Any unsaved edits will be discarded.',
  confirmText = 'Sign Out',
  isLoading = false,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="signout-modal-backdrop" onClick={!isLoading ? onClose : undefined}>
          <motion.div
            className="signout-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
            aria-describedby="signout-modal-desc"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="signout-modal__header">
              <div className="signout-modal__badge">
                <AlertTriangle size={20} />
              </div>
              <button
                type="button"
                className="signout-modal__close-btn"
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="signout-modal__body">
              <h3 id="signout-modal-title" className="signout-modal__title">
                {title}
              </h3>
              <p id="signout-modal-desc" className="signout-modal__desc">
                {description}
              </p>
            </div>

            <div className="signout-modal__actions">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="signout-modal__cancel-btn"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="signout-modal__confirm-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="signout-spinner" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ConfirmSignOutModal.displayName = 'ConfirmSignOutModal';
