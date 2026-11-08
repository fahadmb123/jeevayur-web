import React from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, FileText } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import './DoctorNotificationsCard.css';

export interface DoctorNotificationsCardProps {
  emailAlerts: boolean;
  smsAlerts: boolean;
  urgentAlerts?: boolean;
  weeklySummary?: boolean;
  onToggle: (key: 'emailAlerts' | 'smsAlerts' | 'urgentAlerts' | 'weeklySummary', value: boolean) => void;
}

export const DoctorNotificationsCard: React.FC<DoctorNotificationsCardProps> = React.memo(({
  emailAlerts,
  smsAlerts,
  urgentAlerts = true,
  weeklySummary = true,
  onToggle,
}) => {
  return (
    <Card className="doctor-notifications-card" id="notifications-section">
      <div className="settings-card-header">
        <div className="settings-card-icon-box">
          <Bell size={22} />
        </div>
        <div className="settings-card-header-text">
          <h3>Notification Preferences & Alerts</h3>
          <p>Choose how and when you receive appointment updates, check-ins, and emergency patient pings</p>
        </div>
      </div>

      <div className="notifications-toggles-list">
        <div className="notification-toggle-row">
          <div className="notification-row-text">
            <h4 className="notification-row-title">
              <Mail size={16} color="var(--primary-green, #059669)" />
              Email Notifications for Patient Consultations
            </h4>
            <p className="notification-row-desc">
              Receive instant clinical briefing emails whenever a patient reserves, confirms, or reschedules an appointment.
            </p>
          </div>
          <label className="modern-switch-container">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => onToggle('emailAlerts', e.target.checked)}
            />
            <span className="modern-switch-slider" />
          </label>
        </div>

        <div className="notification-toggle-row">
          <div className="notification-row-text">
            <h4 className="notification-row-title">
              <MessageSquare size={16} color="var(--primary-green, #059669)" />
              SMS Patient Check-In & Arrival Alerts
            </h4>
            <p className="notification-row-desc">
              Get an immediate text alert on your direct mobile phone when a patient checks in at the sanctuary front desk.
            </p>
          </div>
          <label className="modern-switch-container">
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => onToggle('smsAlerts', e.target.checked)}
            />
            <span className="modern-switch-slider" />
          </label>
        </div>

        <div className="notification-toggle-row">
          <div className="notification-row-text">
            <h4 className="notification-row-title">
              <AlertTriangle size={16} color="#D97706" />
              Urgent Consultation Requests
            </h4>
            <p className="notification-row-desc">
              Priority push notification channel for emergency doshic aggravations or post-therapy flare-up inquiries.
            </p>
          </div>
          <label className="modern-switch-container">
            <input
              type="checkbox"
              checked={urgentAlerts}
              onChange={(e) => onToggle('urgentAlerts', e.target.checked)}
            />
            <span className="modern-switch-slider" />
          </label>
        </div>

        <div className="notification-toggle-row">
          <div className="notification-row-text">
            <h4 className="notification-row-title">
              <FileText size={16} color="var(--primary-green, #059669)" />
              Weekly Clinical Healing Digest
            </h4>
            <p className="notification-row-desc">
              A comprehensive weekly summary of completed patient therapies, progress milestones, and upcoming Smriti sessions.
            </p>
          </div>
          <label className="modern-switch-container">
            <input
              type="checkbox"
              checked={weeklySummary}
              onChange={(e) => onToggle('weeklySummary', e.target.checked)}
            />
            <span className="modern-switch-slider" />
          </label>
        </div>
      </div>
    </Card>
  );
});

DoctorNotificationsCard.displayName = 'DoctorNotificationsCard';
