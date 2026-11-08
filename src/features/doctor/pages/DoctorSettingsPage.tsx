import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  Calendar,
  Search,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';
import { DoctorSessionsCard } from '../components/DoctorSessionsCard';
import type { DoctorProfile } from '../types';
import './DoctorSettingsPage.css';

type SettingsTab = 'profile' | 'consultation' | 'notifications' | 'devices';

interface TabItem {
  id: SettingsTab;
  label: string;
  badge?: number | string;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionCount, setSessionCount] = useState<number>(1);

  // Fetch session count for subnavbar badge (similar to "Account 12" in reference)
  useEffect(() => {
    let isMounted = true;
    authService
      .getSessions()
      .then((sessions) => {
        if (isMounted && Array.isArray(sessions)) {
          setSessionCount(sessions.length || 1);
        }
      })
      .catch(() => {
        // Fallback default
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const initialProfile = useMemo<DoctorProfile>(
    () => ({
      name: user?.name || 'Dr. Ahalya T.S.',
      username: 'ahalya-ayur',
      specialty: 'Ayurveda & Wellness Consultant',
      email: user?.email || 'dr.ahalya@jeevayurniketan.com',
      phone: '73567 02775',
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

  const tabs: TabItem[] = useMemo(
    () => [
      { id: 'profile', label: 'General' },
      { id: 'consultation', label: 'Consultation' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'devices', label: 'Connected Devices', badge: sessionCount },
    ],
    [sessionCount]
  );

  // Auto-switch tab if search matches specific section keywords
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    const lower = q.toLowerCase();
    if (lower.includes('device') || lower.includes('session') || lower.includes('logout') || lower.includes('security')) {
      setActiveTab('devices');
    } else if (lower.includes('notif') || lower.includes('sms') || lower.includes('alert') || lower.includes('digest')) {
      setActiveTab('notifications');
    } else if (lower.includes('consult') || lower.includes('duration') || lower.includes('timing') || lower.includes('hour')) {
      setActiveTab('consultation');
    } else if (lower.includes('profile') || lower.includes('user') || lower.includes('phone') || lower.includes('email') || lower.includes('license')) {
      setActiveTab('profile');
    }
  };

  return (
    <div className="doctor-page-content doctor-settings-page">
      {/* 1. Top Header Row: Settings Title + Search Pill */}
      <header className="settings-header-bar">
        <h1 className="settings-main-title">Settings</h1>
        <div className="settings-search-wrapper">
          <input
            type="text"
            className="settings-search-input"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search size={15} className="settings-search-icon" />
        </div>
      </header>

      {/* 2. Horizontal Subnavbar with active underline indicator & badges */}
      <nav className="settings-subnavbar" aria-label="Settings sub-navigation">
        <div className="settings-subnavbar-track">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`settings-subnav-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`tab-badge ${isActive ? 'tab-badge-active' : ''}`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && <span className="tab-active-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Settings Card Content (Arranged horizontally like reference UI) */}
      <main className="settings-body-container">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="settings-section-panel">
            <div className="settings-panel-header">
              <div className="panel-header-copy">
                <h2>Your Profile</h2>
                <p>Please update your clinical profile and practitioner details here</p>
              </div>
              <div className="panel-header-actions">
                {saved && (
                  <span className="save-feedback-pill">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                )}
                <button type="submit" disabled={saving} className="btn-brand-save">
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </div>

            <div className="settings-panel-divider" />

            <div className="settings-rows-list">
              {/* Row: Practitioner Name */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="name">Practitioner Name</label>
                  <span className="row-hint-text">Your official clinical title and full name</span>
                </div>
                <div className="row-control-col">
                  <input
                    id="name"
                    type="text"
                    className="row-text-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Row: Username / Public Link (Arranged with prefix like reference) */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="username">Username & Profile URL</label>
                  <span className="row-hint-text">Used for direct patient booking links</span>
                </div>
                <div className="row-control-col">
                  <div className="input-prefix-box">
                    <span className="prefix-tag">jeevayur.in/dr/</span>
                    <input
                      id="username"
                      type="text"
                      className="prefix-input-field"
                      value={profile.username || 'ahalya-ayur'}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      placeholder="username"
                    />
                    <a
                      href={`https://jeevayurniketan.com/dr/${profile.username || 'ahalya-ayur'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="prefix-action-link"
                      title="Preview public profile"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Row: Phone Number (With country flag tag like reference) */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="phone">Phone Number</label>
                  <span className="row-hint-text">Primary contact for clinic communications</span>
                </div>
                <div className="row-control-col">
                  <div className="input-country-box">
                    <span className="country-badge">🇮🇳 +91</span>
                    <input
                      id="phone"
                      type="tel"
                      className="country-input-field"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="73567 02775"
                    />
                  </div>
                </div>
              </div>

              {/* Row: Official Email */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="email">Official Email</label>
                  <span className="row-hint-text">Used for sign-in and security notifications</span>
                </div>
                <div className="row-control-col">
                  <input
                    id="email"
                    type="email"
                    className="row-text-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row: Medical License */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="license">Medical Registration No.</label>
                  <span className="row-hint-text">State Ayurvedic Council registration</span>
                </div>
                <div className="row-control-col">
                  <input
                    id="license"
                    type="text"
                    className="row-text-input"
                    value={profile.licenseNo || ''}
                    onChange={(e) => setProfile({ ...profile, licenseNo: e.target.value })}
                  />
                </div>
              </div>

              {/* Row: Clinical Specialty */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="specialty">Clinical Specialty</label>
                  <span className="row-hint-text">Your primary Ayurvedic discipline</span>
                </div>
                <div className="row-control-col">
                  <input
                    id="specialty"
                    type="text"
                    className="row-text-input"
                    value={profile.specialty}
                    onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  />
                </div>
              </div>

              {/* Row: Sanctuary Location */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="location">Sanctuary Location</label>
                  <span className="row-hint-text">Physical practice or clinic center</span>
                </div>
                <div className="row-control-col">
                  <input
                    id="location"
                    type="text"
                    className="row-text-input"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Row: Bio */}
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="bio">Professional Bio</label>
                  <span className="row-hint-text">Clinical summary visible on patient portals</span>
                </div>
                <div className="row-control-col">
                  <textarea
                    id="bio"
                    rows={3}
                    className="row-textarea-input"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'consultation' && (
          <form onSubmit={handleSave} className="settings-section-panel">
            <div className="settings-panel-header">
              <div className="panel-header-copy">
                <h2>Consultation Protocols</h2>
                <p>Standard appointment durations and clinic scheduling rules</p>
              </div>
              <div className="panel-header-actions">
                {saved && (
                  <span className="save-feedback-pill">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                )}
                <button type="submit" disabled={saving} className="btn-brand-save">
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Save Protocols'}</span>
                </button>
              </div>
            </div>

            <div className="settings-panel-divider" />

            <div className="settings-rows-list">
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label>Standard Session Duration</label>
                  <span className="row-hint-text">Default slot allocated per patient appointment</span>
                </div>
                <div className="row-control-col">
                  <div className="duration-options-grid">
                    {DURATION_OPTIONS.map((opt) => {
                      const isSelected = profile.consultDuration === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`duration-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setProfile({ ...profile, consultDuration: opt.id })}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setProfile({ ...profile, consultDuration: opt.id });
                            }
                          }}
                        >
                          <div className="duration-card-header">
                            <span className="duration-title">{opt.title}</span>
                            {isSelected && <Check size={14} className="duration-check" />}
                          </div>
                          <span className="duration-type">{opt.type}</span>
                          <p className="duration-desc">{opt.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="settings-form-row">
                <div className="row-label-col">
                  <label>Clinical Buffer Time</label>
                  <span className="row-hint-text">Automatic buffer between consecutive patients</span>
                </div>
                <div className="row-control-col">
                  <div className="buffer-info-row">
                    <Info size={16} className="buffer-icon" />
                    <span>15 minutes included automatically between consultations for pulse analysis note preparation.</span>
                  </div>
                </div>
              </div>

              <div className="settings-form-row">
                <div className="row-label-col">
                  <label>Operating Timings</label>
                  <span className="row-hint-text">Weekly regular clinic consultation hours</span>
                </div>
                <div className="row-control-col">
                  <div className="schedule-info-box">
                    <Calendar size={16} className="schedule-icon" />
                    <span>Monday – Saturday • 09:00 AM – 05:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleSave} className="settings-section-panel">
            <div className="settings-panel-header">
              <div className="panel-header-copy">
                <h2>Notification Preferences</h2>
                <p>Choose which alerts and patient notifications you receive</p>
              </div>
              <div className="panel-header-actions">
                {saved && (
                  <span className="save-feedback-pill">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                )}
                <button type="submit" disabled={saving} className="btn-brand-save">
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </div>

            <div className="settings-panel-divider" />

            <div className="settings-rows-list">
              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="toggle-email">Email Appointment Alerts</label>
                  <span className="row-hint-text">Get an email whenever a patient books or reschedules</span>
                </div>
                <div className="row-control-col">
                  <label className="clean-toggle-switch">
                    <input
                      id="toggle-email"
                      type="checkbox"
                      checked={profile.emailAlerts}
                      onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="toggle-sms">SMS Patient Check-In</label>
                  <span className="row-hint-text">Instant SMS message when a patient arrives at the clinic</span>
                </div>
                <div className="row-control-col">
                  <label className="clean-toggle-switch">
                    <input
                      id="toggle-sms"
                      type="checkbox"
                      checked={profile.smsAlerts}
                      onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="toggle-urgent">Urgent Consultations</label>
                  <span className="row-hint-text">Priority notifications for emergency patient inquiries</span>
                </div>
                <div className="row-control-col">
                  <label className="clean-toggle-switch">
                    <input
                      id="toggle-urgent"
                      type="checkbox"
                      checked={Boolean(profile.urgentAlerts)}
                      onChange={(e) => setProfile({ ...profile, urgentAlerts: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-form-row">
                <div className="row-label-col">
                  <label htmlFor="toggle-digest">Weekly Clinical Digest</label>
                  <span className="row-hint-text">Weekly recap of completed treatments and patient metrics</span>
                </div>
                <div className="row-control-col">
                  <label className="clean-toggle-switch">
                    <input
                      id="toggle-digest"
                      type="checkbox"
                      checked={Boolean(profile.weeklySummary)}
                      onChange={(e) => setProfile({ ...profile, weeklySummary: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'devices' && (
          <div className="settings-section-panel">
            <DoctorSessionsCard />
          </div>
        )}
      </main>
    </div>
  );
});

DoctorSettingsPage.displayName = 'DoctorSettingsPage';
