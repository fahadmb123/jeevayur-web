import React from 'react';
import { ConfirmationModal } from '@/shared/ui';

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
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete image?"
      message={
        <>
          Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
        </>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      isLoading={isDeleting}
    />
  );
};
