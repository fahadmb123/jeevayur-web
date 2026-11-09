import React, { useState } from 'react';
import { User } from 'lucide-react';
import './PatientAvatar.css';

export interface PatientAvatarProps {
  name: string;
  gender?: string;
  avatarUrl?: string;
  id?: string | number;
  size?: number;
  className?: string;
}

const FEMALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&h=160&q=80',
];

const MALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80',
];

export function getDeterministicAvatar(name: string, gender?: string, id?: string | number): string {
  const cleanName = (name || '').trim();
  const seed = `${cleanName}_${id || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const isFemale =
    gender?.toLowerCase() === 'female' ||
    /^(ananya|sunita|priya|sneha|kavita|divya|pooja|ahalya|lakshmi|meera|radha|deepa|shreya|riya|neha|swati|anita|aarthi|poornima)/i.test(
      cleanName
    );

  const isMale =
    gender?.toLowerCase() === 'male' ||
    /^(rajesh|rahul|vikram|fahad|arjun|rohan|amit|devadarsan|suresh|manoj|sanjay|kiran|vijay|deepak|ajay|karthik|vivek)/i.test(
      cleanName
    );

  if (isFemale) {
    return FEMALE_PORTRAITS[absHash % FEMALE_PORTRAITS.length];
  }
  if (isMale) {
    return MALE_PORTRAITS[absHash % MALE_PORTRAITS.length];
  }
  const combined = [...MALE_PORTRAITS, ...FEMALE_PORTRAITS];
  return combined[absHash % combined.length];
}

export const PatientAvatar: React.FC<PatientAvatarProps> = React.memo(({
  name,
  gender,
  avatarUrl,
  id,
  size = 38,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const src = avatarUrl || getDeterministicAvatar(name, gender, id);

  return (
    <div
      className={`patient-human-avatar ${className}`.trim()}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-label={name}
    >
      {!hasError ? (
        <img
          src={src}
          alt={name}
          className="patient-human-avatar__img"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="patient-human-avatar__fallback">
          <User size={Math.round(size * 0.5)} />
        </div>
      )}
    </div>
  );
});

PatientAvatar.displayName = 'PatientAvatar';
