import React, { useState, useCallback, useMemo } from 'react';
import {
  User,
  Clock,
  Bell,
  Laptop,
  Check,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DoctorSessionsCard } from '../components/DoctorSessionsCard';
import type { DoctorProfile } from '../types';
import './DoctorSettingsPage.css';

type SettingsTab = 'profile' | 'consultation' | 'notifications' | 'devices';

const DURATION_OPTIONS = [
  {
    id: '30 mins',
    title: '30 Minutes',
    type: 'Brief Follow-Up',
    description: 'Patient progress reviews, refill assessments, and dietary adjustments.',
  },
  {
    id: '45 mins',
    title: '45 Minutes',
    type: 'Standard Session',
    description: 'Nadi Pariksha pulse analysis, dosha diagnostics, and Smriti meditation.',
  },
  {
    id: '60 mins',
    title: '60 Minutes',
    type: 'Comprehensive Intake',
    description: 'Detailed constitution mapping and chronic condition planning.',
  },
];

export const DoctorSettingsPage: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const initialProfile = useMemo<DoctorProfile>(
    () => ({
      name: user?.name || 'Dr. Ahalya T.S.',
      specialty: 'Ayurveda & Wellness Consultant',
      email: user?.email || 'dr.ahalya@jeevayurniketan.com',
      phone: '+91 73567 02775',
      licenseNo: 'AYU-KL-2024-9102',
      location: 'Kozhikode Sanctuary',
      bio: 'Holistic Ayurvedic consultations specializing in Dosha diagnostics, Nadi Pariksha, and personalized Smriti meditation therapies.',
      consultDuration: '45 mins',
      emailAlerts: true,
      smsAlerts: false,
      urgentAlerts: true,
      weeklySummary: true,
    }),
    [user?.name, user?.email]
  );

  const [profile, setProfile] = useState<DoctorProfile>(initialProfile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 350);
  }, []);

  const doctorInitials = useMemo(() => {
    return (profile.name || 'Dr. Ahalya')
      .replace(/^Dr\.\s*/i, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'AT';
  }, [profile.name]);

  return (
    <div className="doctor-page-content doctor-settings-page">
      <div className="settings-top-header">
        <h1>Settings</h1>
        <p>Manage your clinical profile, session durations, notifications, and device sessions.</p>
      </div>

      <div className="doctor-settings-layout">
        {/* Left Subnav Sidebar */}
        <nav className="settings-subnav" aria-label="Settings Categories">
          <button
            type="button"
            className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} className="settings-nav-item-icon" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            className={`settings-nav-item ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultation')}
          >
            <Clock size={16} className="settings-nav-item-icon" />
            <span>Consultation</span>
          </button>

          <button
            type="button"
            className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} className="settings-nav-item-icon" />
            <span>Notifications</span>
          </button>

          <button
            type="button"
            className={`settings-nav-item ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <Laptop size={16} className="settings-nav-item-icon" />
            <span>Connected Devices</span>
          </button>

          <div className="settings-subnav-divider" />

          <div className="settings-subnav-footer">
            <div className="subnav-footer-avatar">{doctorInitials}</div>
            <div className="subnav-footer-info">
              <span className="subnav-footer-name">{profile.name}</span>
              <span className="subnav-footer-role">Verified Doctor</span>
            </div>
          </div>
        </nav>

        {/* Right Main Content Panel */}
        <div className="settings-content-wrapper">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="settings-main-card">
              <div className="settings-pane-header">
                <div className="settings-pane-title-group">
                  <h2>Practitioner Profile</h2>
                  <p>Your official credentials and clinic contact information</p>
                </div>
                <div className="settings-header-action">
                  {saved && (
                    <span className="save-status-indicator">
                      <CheckCircle2 size={15} /> Saved
                    </span>
                  )}
                  <button type="submit" disabled={saving} className="btn-clean-save">
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              <div className="profile-avatar-row">
                <div className="profile-avatar-box">{doctorInitials}</div>
                <div className="profile-avatar-meta">
                  <h3>{profile.name}</h3>
                  <p>{profile.specialty} • {profile.email}</p>
                </div>
              </div>

              <div className="clean-form-grid">
                <div className="clean-field">
                  <label htmlFor="name">Display Name</label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="clean-field">
                  <label htmlFor="license">Medical Registration No.</label>
                  <input
                    id="license"
                    type="text"
                    value={profile.licenseNo || ''}
                    onChange={(e) => setProfile({ ...profile, licenseNo: e.target.value })}
                  />
                </div>

                <div className="clean-field">
                  <label htmlFor="specialty">Clinical Specialty</label>
                  <input
                    id="specialty"
                    type="text"
                    value={profile.specialty}
                    onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  />
                </div>

                <div className="clean-field">
                  <label htmlFor="email">Official Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="clean-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="clean-field">
                  <label htmlFor="location">Sanctuary Location</label>
                  <input
                    id="location"
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>

                <div className="clean-field full-span">
                  <label htmlFor="bio">Professional Introduction</label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                  <p className="clean-field-hint">Displayed to patients when confirming appointments.</p>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'consultation' && (
            <form onSubmit={handleSave} className="settings-main-card">
              <div className="settings-pane-header">
                <div className="settings-pane-title-group">
                  <h2>Consultation Protocols</h2>
                  <p>Standard appointment durations and clinic scheduling rules</p>
                </div>
                <div className="settings-header-action">
                  {saved && (
                    <span className="save-status-indicator">
                      <CheckCircle2 size={15} /> Saved
                    </span>
                  )}
                  <button type="submit" disabled={saving} className="btn-clean-save">
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Protocols'}</span>
                  </button>
                </div>
              </div>

              <div className="duration-pills-row">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = profile.consultDuration === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`duration-pill-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setProfile({ ...profile, consultDuration: opt.id })}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setProfile({ ...profile, consultDuration: opt.id });
                        }
                      }}
                    >
                      <div className="pill-card-top">
                        <span className="pill-card-title">{opt.title}</span>
                        {isSelected && <Check size={14} className="pill-card-check" />}
                      </div>
                      <span className="pill-card-type">{opt.type}</span>
                      <p className="pill-card-desc">{opt.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="clean-info-strip">
                <Calendar size={16} />
                <span>Operating Schedule: Monday – Saturday • 09:00 AM – 05:00 PM IST (15-min buffers included)</span>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="settings-main-card">
              <div className="settings-pane-header">
                <div className="settings-pane-title-group">
                  <h2>Notification Preferences</h2>
                  <p>Choose which alerts and patient notifications you receive</p>
                </div>
                <div className="settings-header-action">
                  {saved && (
                    <span className="save-status-indicator">
                      <CheckCircle2 size={15} /> Saved
                    </span>
                  )}
                  <button type="submit" disabled={saving} className="btn-clean-save">
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </div>
              </div>

              <div className="clean-toggle-list">
                <div className="clean-toggle-item">
                  <div className="toggle-item-info">
                    <span className="toggle-item-title">Email Appointment Alerts</span>
                    <span className="toggle-item-desc">Get an email whenever a patient books or reschedules an appointment.</span>
                  </div>
                  <label className="clean-switch">
                    <input
                      type="checkbox"
                      checked={profile.emailAlerts}
                      onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
                    />
                    <span className="clean-switch-track" />
                  </label>
                </div>

                <div className="clean-toggle-item">
                  <div className="toggle-item-info">
                    <span className="toggle-item-title">SMS Patient Check-In</span>
                    <span className="toggle-item-desc">Receive an instant SMS when a patient checks in at the clinic.</span>
                  </div>
                  <label className="clean-switch">
                    <input
                      type="checkbox"
                      checked={profile.smsAlerts}
                      onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                    />
                    <span className="clean-switch-track" />
                  </label>
                </div>

                <div className="clean-toggle-item">
                  <div className="toggle-item-info">
                    <span className="toggle-item-title">Urgent Consultations</span>
                    <span className="toggle-item-desc">Priority alert delivery for emergency patient requests.</span>
                  </div>
                  <label className="clean-switch">
                    <input
                      type="checkbox"
                      checked={Boolean(profile.urgentAlerts)}
                      onChange={(e) => setProfile({ ...profile, urgentAlerts: e.target.checked })}
                    />
                    <span className="clean-switch-track" />
                  </label>
                </div>

                <div className="clean-toggle-item">
                  <div className="toggle-item-info">
                    <span className="toggle-item-title">Weekly Clinical Digest</span>
                    <span className="toggle-item-desc">Weekly recap of completed consultations and patient metrics.</span>
                  </div>
                  <label className="clean-switch">
                    <input
                      type="checkbox"
                      checked={Boolean(profile.weeklySummary)}
                      onChange={(e) => setProfile({ ...profile, weeklySummary: e.target.checked })}
                    />
                    <span className="clean-switch-track" />
                  </label>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'devices' && <DoctorSessionsCard />}
        </div>
      </div>
    </div>
  );
});

DoctorSettingsPage.displayName = 'DoctorSettingsPage';
