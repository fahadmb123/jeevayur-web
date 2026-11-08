import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Eye } from 'lucide-react';
import type { Patient } from '../types';
import { Avatar } from '@/shared/ui/avatar';
import { StatusPill } from '@/shared/ui/status-pill';
import './PatientListItem.css';

export interface PatientListItemProps {
  patient: Patient;
  index: number;
  onSelect?: (patient: Patient) => void;
  onViewDetails?: (patient: Patient) => void;
}

export const PatientListItem: React.FC<PatientListItemProps> = React.memo(({
  patient,
  index,
  onSelect,
  onViewDetails,
}) => {
  const isRecovered = patient.status === 'Recovered';

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(patient);
    } else {
      onSelect?.(patient);
    }
  };

  return (
    <motion.div
      className="patient-list-item"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      onClick={() => (onViewDetails ? onViewDetails(patient) : onSelect?.(patient))}
    >
      <div className="patient-list-item__info">
        <Avatar
          initials={patient.name.charAt(0)}
          gradientIndex={index}
          size="md"
        />
        <div className="patient-list-item__details">
          <span className="patient-list-item__name">{patient.name}</span>
          <div className="patient-list-item__meta">
            <span>{patient.age} yrs</span>
            <span className="patient-list-item__dot">•</span>
            <span>{patient.lastVisit}</span>
            {patient.condition && (
              <>
                <span className="patient-list-item__dot">•</span>
                <span className="patient-list-item__condition-tag">{patient.condition}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="patient-list-item__status-wrap">
        <StatusPill
          status={patient.status}
          variant={isRecovered ? 'success' : 'pending'}
        />
        <button
          className="patient-list-item__view-btn"
          aria-label={`View full details for ${patient.name}`}
          onClick={handleOpenDetails}
        >
          <Eye size={15} />
          <span>View Details</span>
        </button>
        <button
          className="patient-list-item__action-btn"
          aria-label={`Options for ${patient.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </motion.div>
  );
});

PatientListItem.displayName = 'PatientListItem';
