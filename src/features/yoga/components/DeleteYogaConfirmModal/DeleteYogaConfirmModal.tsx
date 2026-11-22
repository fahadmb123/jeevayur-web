import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import './DeleteYogaConfirmModal.css';

interface DeleteYogaConfirmModalProps {
  isOpen: boolean;
  title: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteYogaConfirmModal: React.FC<DeleteYogaConfirmModalProps> = React.memo(({
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
      className="delete-yoga-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-yoga-title"
    >
      <div className="delete-yoga-modal__container">
        <button
          type="button"
          className="delete-yoga-modal__close-btn"
          onClick={onClose}
          aria-label="Close dialog"
          disabled={isDeleting}
        >
          <X size={18} />
        </button>

        <div className="delete-yoga-modal__content">
          <div className="delete-yoga-modal__icon-wrap">
            <Trash2 size={22} />
          </div>

          <div className="delete-yoga-modal__text">
            <h3 id="delete-yoga-title" className="delete-yoga-modal__title">
              Delete Yoga Class?
            </h3>
            <p className="delete-yoga-modal__message">
              Are you sure you want to remove <strong>"{title}"</strong> from the clinic schedule? This class will no longer be visible to doctors or patients.
            </p>
          </div>
        </div>

        <div className="delete-yoga-modal__footer">
          <button
            type="button"
            className="delete-yoga-modal__cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-yoga-modal__delete-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Class'}
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteYogaConfirmModal.displayName = 'DeleteYogaConfirmModal';
