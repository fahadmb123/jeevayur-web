import React from 'react';
import { User } from 'lucide-react';
import './PatientAvatar.css';

export interface PatientAvatarProps {
  name?: string;
  gender?: string;
  avatarUrl?: string;
  id?: string | number;
  size?: number;
  className?: string;
}

export const PatientAvatar: React.FC<PatientAvatarProps> = React.memo(({
  name,
  size = 38,
  className = '',
}) => {
  const iconSize = Math.max(14, Math.round(size * 0.46));

  return (
    <div
      className={`patient-human-avatar ${className}`.trim()}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-label={name ? `Patient avatar for ${name}` : 'Patient avatar'}
    >
      <User size={iconSize} strokeWidth={2} />
    </div>
  );
});

PatientAvatar.displayName = 'PatientAvatar';
