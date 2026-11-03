import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { BookAppointmentModal } from './BookAppointmentModal';
import type { BookingFormData } from '@/features/appointments/types';

export interface BookAppointmentButtonProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  className?: string;
  onBookSuccess?: (data: BookingFormData) => void;
}

export const BookAppointmentButton: React.FC<BookAppointmentButtonProps> = React.memo(({
  label = 'Book Appointment',
  size = 'md',
  variant = 'primary',
  className = '',
  onBookSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpen}
      >
        {label}
      </Button>

      <BookAppointmentModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={onBookSuccess}
      />
    </>
  );
});

BookAppointmentButton.displayName = 'BookAppointmentButton';

