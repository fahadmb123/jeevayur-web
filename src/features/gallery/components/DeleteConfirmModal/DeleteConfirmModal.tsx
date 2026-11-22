import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="delete-confirm-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div className="delete-confirm-modal__container">
        <button
          type="button"
          className="delete-confirm-modal__close-btn"
          onClick={onClose}
          aria-label="Close"
          disabled={isDeleting}
        >
          <X size={16} />
        </button>

        <div className="delete-confirm-modal__content">
          <div className="delete-confirm-modal__icon-wrap">
            <Trash2 size={20} />
          </div>

          <div className="delete-confirm-modal__text">
            <h3 id="delete-confirm-title" className="delete-confirm-modal__title">
              Delete image?
            </h3>
            <p className="delete-confirm-modal__message">
              Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="delete-confirm-modal__footer">
          <button
            type="button"
            className="delete-confirm-modal__cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-confirm-modal__delete-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
