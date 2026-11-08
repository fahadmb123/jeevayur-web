import React from 'react';
import { User, Check, Mail, Phone, MapPin, Award } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import type { DoctorProfile } from '@/features/doctor/types';
import './DoctorProfileCard.css';

export interface DoctorProfileCardProps {
  profile: DoctorProfile;
  onChange: (updates: Partial<DoctorProfile>) => void;
}

export const DoctorProfileCard: React.FC<DoctorProfileCardProps> = React.memo(({
  profile,
  onChange,
}) => {
  return (
    <Card className="doctor-profile-card" id="profile-section">
      <div className="settings-card-header">
        <div className="settings-card-icon-box">
          <User size={22} />
        </div>
        <div className="settings-card-header-text">
          <h3>Practitioner Profile & Clinical Identity</h3>
          <p>Verified doctor credentials, contact details, and clinic sanctuary information</p>
        </div>
      </div>

      <div className="profile-identity-hero">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-circle">
            {profile.name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'DR'}
          </div>
          <span className="profile-verified-badge" title="Verified Ayurvedic Practitioner">
            <Check size={13} strokeWidth={3} />
          </span>
        </div>

        <div className="profile-identity-details">
          <div className="profile-identity-title-row">
            <h4 className="profile-doctor-name">{profile.name}</h4>
            <span className="profile-role-badge">Verified Vaidya</span>
            <span className="profile-role-badge">Reg #AYU-KL-2024-9102</span>
          </div>
          <p className="profile-identity-subtext">
            {profile.specialty} • Jeevayurniketan Smriti Sanctuary
          </p>
        </div>
      </div>

      <div className="profile-fields-grid">
        <div className="modern-form-field">
          <label htmlFor="doc-name" className="modern-field-label">
            Full Professional Name
          </label>
          <input
            id="doc-name"
            type="text"
            className="modern-field-input"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Dr. Ahalya T.S."
          />
        </div>

        <div className="modern-form-field">
          <label htmlFor="doc-license" className="modern-field-label">
            <Award size={14} /> Medical Registration ID
          </label>
          <input
            id="doc-license"
            type="text"
            className="modern-field-input"
            value={profile.licenseNo || 'AYU-KL-2024-9102'}
            onChange={(e) => onChange({ licenseNo: e.target.value })}
            placeholder="AYU-KL-XXXX-XXXX"
          />
        </div>

        <div className="modern-form-field">
          <label htmlFor="doc-specialty" className="modern-field-label">
            Clinical Specialty
          </label>
          <input
            id="doc-specialty"
            type="text"
            className="modern-field-input"
            value={profile.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
            placeholder="e.g. Ayurveda & Wellness Consultant"
          />
        </div>

        <div className="modern-form-field">
          <label htmlFor="doc-email" className="modern-field-label">
            <Mail size={14} /> Official Medical Email
          </label>
          <input
            id="doc-email"
            type="email"
            className="modern-field-input"
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="doctor@jeevayurniketan.com"
          />
        </div>

        <div className="modern-form-field">
          <label htmlFor="doc-phone" className="modern-field-label">
            <Phone size={14} /> Direct Clinic Contact
          </label>
          <input
            id="doc-phone"
            type="tel"
            className="modern-field-input"
            value={profile.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="modern-form-field">
          <label htmlFor="doc-location" className="modern-field-label">
            <MapPin size={14} /> Sanctuary Clinic Branch
          </label>
          <input
            id="doc-location"
            type="text"
            className="modern-field-input"
            value={profile.location || 'Jeevayurniketan Sanctuary, Kozhikode, Kerala'}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Clinic location"
          />
        </div>

        <div className="modern-form-field profile-field-full">
          <label htmlFor="doc-bio" className="modern-field-label">
            Practitioner Clinical Philosophy & Introduction
          </label>
          <textarea
            id="doc-bio"
            rows={3}
            className="modern-field-textarea"
            value={
              profile.bio ||
              'Holistic Ayurvedic consultations specializing in Dosha diagnostics, Nadi Pariksha, and personalized Smriti meditation therapies.'
            }
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="Brief overview shown to patients during online consultation booking..."
          />
          <p className="modern-field-helper">
            This note appears on patient appointment confirmation slips and telehealth waiting screens.
          </p>
        </div>
      </div>
    </Card>
  );
});

DoctorProfileCard.displayName = 'DoctorProfileCard';
