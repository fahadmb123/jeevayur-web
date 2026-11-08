import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Check,
  CheckCircle2,
  Calendar,
  Search,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AUTH_QUERY_KEY } from '@/features/auth/hooks/useAuthMutation';
import { authService } from '@/features/auth/services/authService';
import { DoctorSessionsCard } from '../components/DoctorSessionsCard/index';
import { DoctorSocialLinksTab } from '../components/DoctorSocialLinksTab/index';
import { socialLinksService, type SocialLink } from '@/shared/services/socialLinksService';
import type { DoctorProfile } from '../types';
import './DoctorSettingsPage.css';

type SettingsTab = 'profile' | 'consultation' | 'social' | 'notifications' | 'devices';

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
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [savedSocial, setSavedSocial] = useState(false);
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<DoctorProfile>(() => ({
    name: user?.name || '',
    username: '',
    specialty: 'Ayurveda & Wellness Consultant',
    email: user?.email || '',
    phone: user?.phone || '',
    licenseNo: 'AYU-KL-2024-9102',
    location: 'Kozhikode Sanctuary',
    bio: '',
    consultDuration: '45 mins',
    emailAlerts: true,
    smsAlerts: false,
    urgentAlerts: true,
    weeklySummary: true,
  }));

  const isDirty = useMemo(() => {
    const curName = profile.name.trim();
    const curEmail = profile.email.trim();
    const curPhone = (profile.phone || '').trim();

    const origName = (user?.name || '').trim();
    const origEmail = (user?.email || '').trim();
    const origPhone = (user?.phone || '').trim();

    return curName !== origName || curEmail !== origEmail || curPhone !== origPhone;
  }, [profile.name, profile.email, profile.phone, user?.name, user?.email, user?.phone]);

  const isDirtyRef = useRef(false);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (user && !isDirtyRef.current) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    authService
      .getSessions()
      .then((sessions) => {
        if (isMounted && Array.isArray(sessions)) {
          setSessionCount(sessions.length || 1);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    socialLinksService
      .getSocialLinks(true)
      .then((links) => {
        if (isMounted && Array.isArray(links)) {
          setSocialLinks(links);
        }
      })
      .catch((err) => {
        console.warn('Failed to load social links in settings:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSocialLinks = useCallback(async (updatedLinks: SocialLink[]) => {
    setIsSavingSocial(true);
    setSocialSaveError(null);
    try {
      const saved = await socialLinksService.bulkSaveSocialLinks(updatedLinks);
      setSocialLinks(saved);
      setSavedSocial(true);
      setTimeout(() => setSavedSocial(false), 2500);
    } catch (err: unknown) {
      console.error('Failed to save social links:', err);
      const message = err instanceof Error ? err.message : 'Failed to save social links';
      setSocialSaveError(message);
    } finally {
      setIsSavingSocial(false);
    }
  }, []);

  const handleSaveGeneral = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isDirty || saving) return;

      setSaving(true);
      setGeneralError(null);
      try {
        const updatedUser = await authService.updateProfile({
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone ? profile.phone.trim() : null,
        });

        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err: unknown) {
        console.error('Failed to update profile:', err);
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        setGeneralError(message);
      } finally {
        setSaving(false);
      }
    },
    [isDirty, saving, profile.name, profile.email, profile.phone, queryClient]
  );

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
      { id: 'social', label: 'Social Links', badge: socialLinks.length > 0 ? socialLinks.length : undefined },
      { id: 'notifications', label: 'Notifications' },
      { id: 'devices', label: 'Account & Devices', badge: sessionCount },
    ],
    [sessionCount, socialLinks.length]
  );

  // Keyword-aware search bar auto navigation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    const lower = q.toLowerCase();
    if (lower.includes('device') || lower.includes('session') || lower.includes('logout') || lower.includes('security') || lower.includes('account')) {
      setActiveTab('devices');
    } else if (lower.includes('social') || lower.includes('instagram') || lower.includes('linkedin') || lower.includes('twitter') || lower.includes('facebook') || lower.includes('youtube') || lower.includes('link')) {
      setActiveTab('social');
    } else if (lower.includes('notif') || lower.includes('sms') || lower.includes('alert') || lower.includes('digest')) {
      setActiveTab('notifications');
    } else if (lower.includes('consult') || lower.includes('duration') || lower.includes('timing') || lower.includes('hour') || lower.includes('buffer')) {
      setActiveTab('consultation');
    } else if (lower.includes('profile') || lower.includes('user') || lower.includes('phone') || lower.includes('email') || lower.includes('name')) {
      setActiveTab('profile');
    }
  };

  return (
    <div className="doctor-page-content doctor-settings-container">
      {/* Unified White Canvas Card: exactly mirroring reference UI arrangement */}
      <div className="settings-canvas-card">
        {/* 1. Header Bar: Settings Title on Left, Search Bar on Right */}
        <div className="settings-card-topbar">
          <h1 className="settings-page-title">Settings</h1>
          <div className="settings-search-pill">
            <input
              type="text"
              className="settings-search-field"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search size={16} className="settings-search-icon" />
          </div>
        </div>

        {/* 2. Horizontal Subnavbar with active underline indicator & badges */}
        <nav className="settings-subnavbar" aria-label="Settings sub-navigation">
          <div className="settings-tabs-row">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`settings-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-text">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`tab-badge-pill ${isActive ? 'active' : ''}`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && <div className="tab-indicator-bar" />}
                </button>
              );
            })}
          </div>
        </nav>

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveGeneral} className="settings-tab-pane">
            <div className="settings-pane-header">
              <div className="pane-header-titles">
                <h2 className="pane-title">Your Profile</h2>
                <p className="pane-subtitle">Please update your profile settings here</p>
              </div>

              <div className="pane-header-actions">
                <div
                  className="tooltip-container"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <button
                    type="button"
                    className="tooltip-trigger-btn"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    aria-label="Profile information"
                  >
                    <Info size={16} />
                  </button>

                  {showTooltip && (
                    <div className="dark-tooltip-bubble" role="tooltip">
                      <div className="tooltip-bubble-title">Practitioner Profile</div>
                      <div className="tooltip-bubble-text">
                        These credentials and contact details appear directly on patient bookings.
                      </div>
                      <div className="tooltip-arrow" />
                    </div>
                  )}
                </div>

                {generalError && (
                  <span className="settings-error-badge" role="alert">
                    {generalError}
                  </span>
                )}

                {saved ? (
                  <span className="saved-status-badge">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                ) : (
                  <button
                    type="submit"
                    disabled={!isDirty || saving}
                    className="btn-primary-action"
                    title={!isDirty ? 'No changes to save' : 'Click to save your profile changes'}
                  >
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="settings-divider-rule" />

            <div className="settings-fields-stack">
              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="name">Name</label>
                </div>
                <div className="field-control-cell">
                  <div className="modern-input-group single">
                    <input
                      id="name"
                      type="text"
                      className="input-group-text"
                      value={profile.name}
                      onChange={(e) => {
                        setGeneralError(null);
                        setProfile({ ...profile, name: e.target.value });
                      }}
                      placeholder="Doctor Name"
                    />
                  </div>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="email">Official Email</label>
                </div>
                <div className="field-control-cell">
                  <div className="modern-input-group single">
                    <input
                      id="email"
                      type="email"
                      className="input-group-text"
                      value={profile.email}
                      onChange={(e) => {
                        setGeneralError(null);
                        setProfile({ ...profile, email: e.target.value });
                      }}
                      placeholder="doctor@jeevayurniketan.com"
                    />
                  </div>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="phone">Phone Number</label>
                </div>
                <div className="field-control-cell">
                  <div className="modern-input-group">
                    <div className="country-selector-pill">
                      <span className="country-emoji">🇮🇳</span>
                      <ChevronDown size={13} className="country-chevron" />
                    </div>
                    <div className="input-vertical-divider" />
                    <input
                      id="phone"
                      type="tel"
                      className="input-group-text"
                      value={profile.phone}
                      onChange={(e) => {
                        setGeneralError(null);
                        setProfile({ ...profile, phone: e.target.value });
                      }}
                      placeholder="+91 73567 02775"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Consultation Tab */}
        {activeTab === 'consultation' && (
          <form onSubmit={handleSave} className="settings-tab-pane">
            <div className="settings-pane-header">
              <div className="pane-header-titles">
                <h2 className="pane-title">Consultation Protocols</h2>
                <p className="pane-subtitle">Manage standard durations, buffers, and scheduling</p>
              </div>

              <div className="pane-header-actions">
                {saved ? (
                  <span className="saved-status-badge">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                ) : (
                  <button type="submit" disabled={saving} className="btn-primary-action">
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="settings-divider-rule" />

            <div className="settings-fields-stack">
              <div className="settings-field-row align-top">
                <div className="field-label-cell">
                  <label>Standard Duration</label>
                </div>
                <div className="field-control-cell">
                  <div className="duration-pill-group">
                    {DURATION_OPTIONS.map((opt) => {
                      const isSelected = profile.consultDuration === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`duration-select-box ${isSelected ? 'selected' : ''}`}
                          onClick={() => setProfile({ ...profile, consultDuration: opt.id })}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setProfile({ ...profile, consultDuration: opt.id });
                            }
                          }}
                        >
                          <div className="duration-select-top">
                            <span className="duration-select-title">{opt.title}</span>
                            {isSelected && <Check size={14} className="duration-select-check" />}
                          </div>
                          <span className="duration-select-type">{opt.type}</span>
                          <p className="duration-select-desc">{opt.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label>Buffer Window</label>
                </div>
                <div className="field-control-cell">
                  <div className="info-callout-pill">
                    <Info size={15} className="callout-icon" />
                    <span>15 minutes automated preparation buffer between consultations</span>
                  </div>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label>Operating Hours</label>
                </div>
                <div className="field-control-cell">
                  <div className="info-callout-pill">
                    <Calendar size={15} className="callout-icon" />
                    <span>Monday – Saturday • 09:00 AM – 05:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSave} className="settings-tab-pane">
            <div className="settings-pane-header">
              <div className="pane-header-titles">
                <h2 className="pane-title">Notification Preferences</h2>
                <p className="pane-subtitle">Choose which alerts and patient notifications you receive</p>
              </div>

              <div className="pane-header-actions">
                {saved ? (
                  <span className="saved-status-badge">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                ) : (
                  <button type="submit" disabled={saving} className="btn-primary-action">
                    <Check size={14} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="settings-divider-rule" />

            <div className="settings-fields-stack">
              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="toggle-email">Email Alerts</label>
                </div>
                <div className="field-control-cell switch-cell">
                  <span className="switch-hint-label">Receive email alerts when patients book or reschedule</span>
                  <label className="sloth-switch">
                    <input
                      id="toggle-email"
                      type="checkbox"
                      checked={profile.emailAlerts}
                      onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
                    />
                    <span className="sloth-switch-track" />
                  </label>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="toggle-sms">SMS Check-In</label>
                </div>
                <div className="field-control-cell switch-cell">
                  <span className="switch-hint-label">Instant SMS notification when patient checks in at the clinic</span>
                  <label className="sloth-switch">
                    <input
                      id="toggle-sms"
                      type="checkbox"
                      checked={profile.smsAlerts}
                      onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                    />
                    <span className="sloth-switch-track" />
                  </label>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="toggle-urgent">Urgent Consultations</label>
                </div>
                <div className="field-control-cell switch-cell">
                  <span className="switch-hint-label">Priority alert delivery for emergency patient inquiries</span>
                  <label className="sloth-switch">
                    <input
                      id="toggle-urgent"
                      type="checkbox"
                      checked={Boolean(profile.urgentAlerts)}
                      onChange={(e) => setProfile({ ...profile, urgentAlerts: e.target.checked })}
                    />
                    <span className="sloth-switch-track" />
                  </label>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="toggle-digest">Weekly Digest</label>
                </div>
                <div className="field-control-cell switch-cell">
                  <span className="switch-hint-label">Summary email of patient volume and clinical metrics</span>
                  <label className="sloth-switch">
                    <input
                      id="toggle-digest"
                      type="checkbox"
                      checked={Boolean(profile.weeklySummary)}
                      onChange={(e) => setProfile({ ...profile, weeklySummary: e.target.checked })}
                    />
                    <span className="sloth-switch-track" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <DoctorSocialLinksTab
            links={socialLinks}
            onSave={handleSaveSocialLinks}
            isSaving={isSavingSocial}
            saved={savedSocial}
            errorMessage={socialSaveError}
          />
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="settings-tab-pane">
            <DoctorSessionsCard />
          </div>
        )}
      </div>
    </div>
  );
});

DoctorSettingsPage.displayName = 'DoctorSettingsPage';
