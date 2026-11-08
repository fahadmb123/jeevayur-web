import React, { useState, useCallback, useMemo } from 'react';
import {
  Shield,
  CheckCircle2,
  User,
  Clock,
  Bell,
  Laptop,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  DoctorProfileCard,
  DoctorProtocolsCard,
  DoctorNotificationsCard,
  DoctorSessionsCard,
} from '../components';
import type { DoctorProfile } from '../types';
import './DoctorSettingsPage.css';

type SettingsTab = 'all' | 'profile' | 'protocols' | 'notifications' | 'devices';

export const DoctorSettingsPage: React.FC = React.memo(() => {
  const { user } = useAuth();

  const initialProfile = useMemo<DoctorProfile>(
    () => ({
      name: user?.name || 'Dr. Ahalya T.S.',
      specialty: 'Ayurveda & Wellness Consultant',
      email: user?.email || 'dr.ahalya@jeevayurniketan.com',
      phone: '+91 73567 02775',
      licenseNo: 'AYU-KL-2024-9102',
      location: 'Jeevayurniketan Sanctuary, Kozhikode, Kerala',
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
  const [activeTab, setActiveTab] = useState<SettingsTab>('all');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = useCallback((updates: Partial<DoctorProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleToggleNotification = useCallback(
    (key: 'emailAlerts' | 'smsAlerts' | 'urgentAlerts' | 'weeklySummary', value: boolean) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleDurationChange = useCallback((duration: string) => {
    setProfile((prev) => ({ ...prev, consultDuration: duration }));
  }, []);

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }, 400);
    },
    []
  );

  const handleDiscard = useCallback(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  return (
    <div className="doctor-page-content">
      <div className="doctor-settings-wrapper">
        {/* Modern Settings Header */}
        <div className="settings-header-section">
          <div>
            <span className="settings-header-breadcrumb">
              <Sparkles size={13} />
              Ayurvedic Medical Sanctuary • Doctor Settings
            </span>
            <h1 className="settings-header-title">Practitioner Workspace Settings</h1>
            <p className="settings-header-subtitle">
              Manage your clinical credentials, patient consultation protocols, alert channels, and authorized device sessions.
            </p>
          </div>

          <div className="settings-header-badge">
            <span className="pulse-indicator" />
            <span>Cloud Synchronized</span>
          </div>
        </div>

        {/* Segmented Filter Navigation */}
        <div className="settings-nav-tabs">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Layers size={15} />
            <span>All Settings</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={15} />
            <span>Practitioner Profile</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'protocols' ? 'active' : ''}`}
            onClick={() => setActiveTab('protocols')}
          >
            <Clock size={15} />
            <span>Consultation Protocols</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={15} />
            <span>Notification Alerts</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <Laptop size={15} />
            <span>Connected Devices</span>
          </button>
        </div>

        {/* Main Settings Content */}
        <form onSubmit={handleSave} className="doctor-settings-form">
          <div className="doctor-settings-grid">
            {(activeTab === 'all' || activeTab === 'profile') && (
              <DoctorProfileCard
                profile={profile}
                onChange={handleUpdateProfile}
              />
            )}

            {(activeTab === 'all' || activeTab === 'protocols') && (
              <DoctorProtocolsCard
                consultDuration={profile.consultDuration}
                onChangeDuration={handleDurationChange}
              />
            )}

            {(activeTab === 'all' || activeTab === 'notifications') && (
              <DoctorNotificationsCard
                emailAlerts={profile.emailAlerts}
                smsAlerts={profile.smsAlerts}
                urgentAlerts={profile.urgentAlerts}
                weeklySummary={profile.weeklySummary}
                onToggle={handleToggleNotification}
              />
            )}

            {(activeTab === 'all' || activeTab === 'devices') && (
              <DoctorSessionsCard />
            )}
          </div>

          {/* Sticky SaaS Save Bar */}
          <div className="settings-floating-action-bar">
            <div className={`action-bar-status ${saved ? 'saved' : ''}`}>
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>All settings successfully updated & synchronized</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Changes apply to your verified practitioner profile across all clinics</span>
                </>
              )}
            </div>

            <div className="action-bar-buttons">
              <button
                type="button"
                onClick={handleDiscard}
                className="btn-discard-settings"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-save-settings"
              >
                <Check size={16} />
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

DoctorSettingsPage.displayName = 'DoctorSettingsPage';
