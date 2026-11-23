import React from 'react';
import { ConfirmationModal } from '@/shared/ui';

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
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Yoga Class?"
      message={
        <>
          Are you sure you want to remove <strong>"{title}"</strong> from the clinic schedule? This class will no longer be visible to doctors or patients.
        </>
      }
      confirmLabel="Delete Class"
      cancelLabel="Cancel"
      variant="danger"
      isLoading={isDeleting}
    />
  );
});

DeleteYogaConfirmModal.displayName = 'DeleteYogaConfirmModal';
