import React, { useMemo } from 'react';
import { Eye, Phone, Mail, MapPin, Video, Globe, UserPlus } from 'lucide-react';
import type { Patient } from '../types';
import { StatusPill } from '@/shared/ui/status-pill';
import { PatientAvatar } from './PatientAvatar';
import './PatientListItem.css';

export interface PatientListItemProps {
  patient: Patient;
  index: number;
  onSelect?: (patient: Patient) => void;
  onViewDetails?: (patient: Patient) => void;
}

function parsePatientCondition(rawCondition?: string) {
  if (!rawCondition) {
    return {
      serviceType: null,
      format: null,
      reason: null,
    };
  }

  const match = rawCondition.match(/^([^()]+)\s*\(([^)]+)\)\s*:\s*(.*)$/i);
  if (match) {
    const rawType = match[1].trim();
    const rawFormat = match[2].trim();
    const rawReason = match[3].trim();

    const formatLabel =
      rawFormat.toLowerCase() === 'online'
        ? 'Online'
        : rawFormat.toLowerCase() === 'offline'
        ? 'Offline'
        : rawFormat.charAt(0).toUpperCase() + rawFormat.slice(1);

    const typeLabel = rawType
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      serviceType: typeLabel,
      format: formatLabel,
      reason: rawReason,
    };
  }

  return {
    serviceType: null,
    format: null,
    reason: rawCondition,
  };
}

export const PatientListItem: React.FC<PatientListItemProps> = React.memo(({
  patient,
  index,
  onSelect,
  onViewDetails,
}) => {
  const isRecovered = patient.status === 'Recovered';

  const parsedCondition = useMemo(() => {
    return parsePatientCondition(patient.condition);
  }, [patient.condition]);

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(patient);
    } else {
      onSelect?.(patient);
    }
  };

  const isOnline = parsedCondition.format === 'Online';

  return (
    <tr
      className="doctor-patient-row"
      onClick={() => (onViewDetails ? onViewDetails(patient) : onSelect?.(patient))}
    >
      <td className="patient-cell patient-cell--number">
        <span className="patient-row-number">{index + 1}</span>
      </td>

      <td className="patient-cell patient-cell--profile">
        <div className="patient-profile-wrapper">
          <PatientAvatar
            name={patient.name}
            gender={patient.gender}
            avatarUrl={patient.avatarUrl}
            id={patient.id}
            size={38}
          />
          <div className="patient-profile-meta">
            <strong className="patient-table-name">{patient.name}</strong>
            <div className="patient-table-subline">
              <span className="patient-table-id">#{String(patient.id).slice(-6)}</span>
              <span
                className={`patient-source-tag patient-source-tag--${patient.source || 'doctor'}`}
                title={patient.source === 'website' ? 'Applied via Website Appointment' : 'Added Manually by Doctor'}
              >
                {patient.source === 'website' ? (
                  <>
                    <Globe size={10} />
                    <span>Website</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={10} />
                    <span>Doctor</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="patient-cell patient-cell--contact">
        <div className="patient-contact-wrapper">
          {patient.phone ? (
            <span className="patient-contact-item">
              <Phone size={12} className="patient-contact-icon" />
              <span>{patient.phone}</span>
            </span>
          ) : (
            <span className="patient-contact-item patient-contact-item--empty">No phone</span>
          )}
          {patient.email ? (
            <span className="patient-contact-item">
              <Mail size={12} className="patient-contact-icon" />
              <span className="patient-email-text">{patient.email}</span>
            </span>
          ) : (
            <span className="patient-contact-item patient-contact-item--empty">No email</span>
          )}
        </div>
      </td>

      <td className="patient-cell patient-cell--service">
        <div className="patient-service-wrapper">
          <span className="patient-service-badge">
            {parsedCondition.serviceType || 'Ayurveda Treatment'}
          </span>
          <span className={`patient-format-pill ${isOnline ? 'patient-format-pill--online' : 'patient-format-pill--offline'}`}>
            {isOnline ? <Video size={11} /> : <MapPin size={11} />}
            <span>{parsedCondition.format || 'Offline'}</span>
          </span>
        </div>
      </td>

      <td className="patient-cell patient-cell--concern">
        <div className="patient-concern-wrapper" title={parsedCondition.reason || 'General Consultation'}>
          <span className="patient-concern-text">
            {parsedCondition.reason || 'General Consultation'}
          </span>
        </div>
      </td>

      <td className="patient-cell patient-cell--status">
        <StatusPill
          status={patient.status}
          variant={isRecovered ? 'success' : 'pending'}
        />
      </td>

      <td className="patient-cell patient-cell--action">
        <button
          type="button"
          className="patient-table-view-btn"
          aria-label={`View details for ${patient.name}`}
          onClick={handleOpenDetails}
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
});

PatientListItem.displayName = 'PatientListItem';
