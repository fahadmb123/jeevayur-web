import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';

export interface BookAppointmentButtonProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  className?: string;
  type?: 'ayurveda treatment' | 'yoga class';
  onBookSuccess?: (data?: unknown) => void;
}

export const BookAppointmentButton: React.FC<BookAppointmentButtonProps> = React.memo(({
  label = 'Book Appointment',
  size = 'md',
  variant = 'primary',
  className = '',
  type,
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (type) {
      navigate(`/contact?type=${encodeURIComponent(type)}`);
    } else {
      navigate('/contact');
    }
  }, [navigate, type]);

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
});

BookAppointmentButton.displayName = 'BookAppointmentButton';
