import React from 'react';
import { AlertTriangle, Trash2, X, Cloud } from 'lucide-react';
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
  if (!isOpen) return null;

  return (
    <div
      className="delete-confirm-modal__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="delete-confirm-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="delete-confirm-modal__close-btn"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isDeleting}
        >
          <X size={18} />
        </button>

        <div className="delete-confirm-modal__content">
          <div className="delete-confirm-modal__icon-wrap">
            <AlertTriangle size={28} />
          </div>

          <h3 className="delete-confirm-modal__title">
            Delete Image from Cloud?
          </h3>

          <p className="delete-confirm-modal__message">
            Are you sure you want to remove <strong>"{title}"</strong>? This will permanently delete the image from <strong>Backblaze B2 Cloud Storage</strong> and the clinic database.
          </p>

          <div className="delete-confirm-modal__cloud-notice">
            <Cloud size={16} />
            <span>Files deleted from cloud storage cannot be recovered.</span>
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
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Yes, Delete from Cloud</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
