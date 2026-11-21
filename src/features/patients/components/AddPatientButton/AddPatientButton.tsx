import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AddPatientModal } from '../AddPatientModal';
import type { Patient } from '../../types';

export interface AddPatientButtonProps {
  onAddPatient?: (patient: Omit<Patient, 'id'>) => void;
}

export const AddPatientButton: React.FC<AddPatientButtonProps> = React.memo(({ onAddPatient }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Button variant="primary" size="md" onClick={handleOpen}>
        <Plus size={18} />
        <span>New Patient</span>
      </Button>

      <AddPatientModal
        isOpen={isOpen}
        onClose={handleClose}
        onAddPatient={onAddPatient}
      />
    </>
  );
});

AddPatientButton.displayName = 'AddPatientButton';
