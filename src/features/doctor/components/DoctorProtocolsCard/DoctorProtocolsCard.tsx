import React from 'react';
import { Clock, Check, Calendar, Coffee, Video } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import './DoctorProtocolsCard.css';

export interface DoctorProtocolsCardProps {
  consultDuration: string;
  onChangeDuration: (duration: string) => void;
  bufferTime?: string;
}

const DURATION_OPTIONS = [
  {
    id: '30 mins',
    title: '30 Minutes',
    type: 'Follow-Up / Brief Dosha',
    description: 'Optimal for routine patient progress reviews, prescription refills, and dietary tune-ups.',
  },
  {
    id: '45 mins',
    title: '45 Minutes',
    type: 'Standard Smriti Protocol (Recommended)',
    description: 'Thorough Nadi Pariksha pulse reading, doshic imbalance diagnosis, and meditation therapy.',
  },
  {
    id: '60 mins',
    title: '60 Minutes',
    type: 'Comprehensive / Panchakarma',
    description: 'In-depth initial constitution mapping, detailed lifestyle prescription, and chronic disease analysis.',
  },
];

export const DoctorProtocolsCard: React.FC<DoctorProtocolsCardProps> = React.memo(({
  consultDuration,
  onChangeDuration,
}) => {
  return (
    <Card className="doctor-protocols-card" id="protocols-section">
      <div className="settings-card-header">
        <div className="settings-card-icon-box">
          <Clock size={22} />
        </div>
        <div className="settings-card-header-text">
          <h3>Consultation Protocols & Scheduling Rules</h3>
          <p>Configure appointment durations, patient consultation buffers, and clinic availability</p>
        </div>
      </div>

      <div className="protocol-duration-options">
        {DURATION_OPTIONS.map((opt) => {
          const isSelected = consultDuration === opt.id;
          return (
            <div
              key={opt.id}
              className={`duration-option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onChangeDuration(opt.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChangeDuration(opt.id);
                }
              }}
            >
              <div className="duration-top-row">
                <h4 className="duration-title">{opt.title}</h4>
                <div className="duration-check-indicator">
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </div>
              <p className="duration-type-tag">{opt.type}</p>
              <p className="duration-desc">{opt.description}</p>
            </div>
          );
        })}
      </div>

      <div className="protocol-summary-banner">
        <div className="protocol-summary-item">
          <Calendar size={18} className="protocol-summary-icon" />
          <span>Active Clinic Hours: Mon – Sat • 09:00 AM – 05:00 PM IST</span>
        </div>
        <div className="protocol-summary-item">
          <Coffee size={18} className="protocol-summary-icon" />
          <span>Automatic 15-minute sanctuary buffer between sessions</span>
        </div>
        <div className="protocol-summary-item">
          <Video size={18} className="protocol-summary-icon" />
          <span>HD Tele-Consultations Enabled</span>
        </div>
      </div>
    </Card>
  );
});

DoctorProtocolsCard.displayName = 'DoctorProtocolsCard';
