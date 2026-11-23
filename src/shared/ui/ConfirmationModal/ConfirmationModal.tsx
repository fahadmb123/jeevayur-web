import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { useModalDismiss } from '@/shared/lib/useModalDismiss';
import './ConfirmationModal.css';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = React.memo(({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon,
  isLoading = false,
}) => {
  useModalDismiss(isOpen, onClose, isLoading);

  if (!isOpen) return null;

  const defaultIcon = variant === 'danger' ? <Trash2 size={22} /> : <AlertTriangle size={22} />;

  return (
    <div
      className="confirmation-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="confirmation-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="confirmation-modal__close-btn"
          onClick={onClose}
          aria-label="Close dialog"
          disabled={isLoading}
        >
          <X size={18} />
        </button>

        <div className="confirmation-modal__content">
          <div className={`confirmation-modal__icon-wrap confirmation-modal__icon-wrap--${variant}`}>
            {icon || defaultIcon}
          </div>

          <div className="confirmation-modal__text">
            <h3 id="confirmation-modal-title" className="confirmation-modal__title">
              {title}
            </h3>
            {message && (
              <div className="confirmation-modal__message">
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            )}
          </div>
        </div>

        <div className="confirmation-modal__footer">
          <button
            type="button"
            className="confirmation-modal__cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirmation-modal__confirm-btn confirmation-modal__confirm-btn--${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="confirmation-modal__btn-loading">
                <Loader2 size={16} className="confirmation-modal__spinner" />
                <span>Processing...</span>
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmationModal.displayName = 'ConfirmationModal';
