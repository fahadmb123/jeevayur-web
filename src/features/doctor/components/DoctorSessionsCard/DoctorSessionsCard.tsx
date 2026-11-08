import React, { useState, useEffect, useCallback } from 'react';
import {
  Laptop,
  Smartphone,
  Globe,
  RefreshCw,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { authService, type ActiveSession } from '@/features/auth/services/authService';
import './DoctorSessionsCard.css';

function getDeviceIcon(deviceStr?: string | null) {
  const lower = (deviceStr || '').toLowerCase();
  if (lower.includes('iphone') || lower.includes('android') || lower.includes('ios') || lower.includes('mobile')) {
    return <Smartphone size={20} />;
  }
  if (lower.includes('windows') || lower.includes('mac') || lower.includes('linux') || lower.includes('pc') || lower.includes('desktop')) {
    return <Laptop size={20} />;
  }
  return <Globe size={20} />;
}

function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Active just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

function formatLocation(session: ActiveSession): string {
  if (session.city && session.country) {
    return `${session.city}, ${session.country}`;
  }
  if (session.country) {
    return session.country;
  }
  if (session.ipAddress === '127.0.0.1' || session.ipAddress === '::1' || session.ipAddress === 'localhost') {
    return 'Local Network (Dev)';
  }
  return 'Unknown Location';
}

export const DoctorSessionsCard: React.FC = React.memo(() => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSessions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await authService.getSessions();
      setSessions(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve active sessions.';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();

    const handleFocus = () => {
      loadSessions(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadSessions]);

  const handleRevoke = async (sessionId: string, deviceName: string) => {
    if (!window.confirm(`Are you sure you want to sign out "${deviceName}"?`)) {
      return;
    }

    setRevokingId(sessionId);
    try {
      await authService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setStatusMessage({
        type: 'success',
        text: `Successfully signed out "${deviceName}".`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Could not revoke session.';
      setStatusMessage({ type: 'error', text: errorMsg });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <Card className="settings-section-card doctor-sessions-card">
      <div className="sessions-header-wrapper">
        <div className="sessions-header-info">
          <Shield size={22} className="settings-icon" />
          <div>
            <h3>
              Active Devices & Security Sessions
              {sessions.length > 0 && (
                <span className="sessions-count-pill">
                  {sessions.length} {sessions.length === 1 ? 'active session' : 'active sessions'}
                </span>
              )}
            </h3>
            <p>Review and manage all devices currently signed in to your practitioner portal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadSessions(true)}
          disabled={loading || refreshing}
          className="sessions-refresh-btn"
          title="Refresh active sessions"
        >
          <RefreshCw size={14} className={`sessions-refresh-icon ${refreshing ? 'spinning' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className={`sessions-status-alert ${statusMessage.type}`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="sessions-loading-skeleton">
          <div className="skeleton-item" />
          <div className="skeleton-item" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="sessions-empty-state">
          <ShieldCheck size={36} color="var(--primary-green, #059669)" />
          <p>No active remote sessions detected. Only your current browser session is logged in.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session, index) => {
            const isCurrent = typeof session.isCurrent === 'boolean' ? session.isCurrent : index === 0;

            return (
              <div
                key={session.id || index}
                className={`session-row ${isCurrent ? 'current-session' : ''}`}
              >
                <div className="session-left-details">
                  <div className="session-icon-box">
                    {getDeviceIcon(session.device || 'Desktop')}
                  </div>

                  <div className="session-info">
                    <div className="session-name-row">
                      <h4 className="session-device-title">
                        {session.device || 'Web Browser'}
                      </h4>
                      {isCurrent ? (
                        <span className="session-badge-current">
                          <span className="pulse-indicator" />
                          This Device • Active Now
                        </span>
                      ) : (
                        <span className="session-badge-other">
                          Connected & Active
                        </span>
                      )}
                    </div>

                    <div className="session-meta-line">
                      <span className="session-meta-item">
                        <MapPin size={13} />
                        {formatLocation(session)}
                      </span>
                      <span className="session-meta-divider">•</span>
                      <span className="session-meta-item">
                        IP: {session.ipAddress || '127.0.0.1'}
                      </span>
                    </div>

                    <div className="session-time-line">
                      <span className="session-meta-item">
                        <Clock size={12} />
                        Last active: {formatRelativeTime(session.lastActiveAt)}
                        {session.createdAt && (
                          <>
                            {' '}(Signed in{' '}
                            {new Date(session.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            )
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="session-right-action">
                  {isCurrent ? (
                    <span className="session-current-pill">Active Session</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevoke(session.id, session.device)}
                      disabled={revokingId === session.id}
                      className="session-revoke-btn"
                      title="Revoke and sign out this device"
                    >
                      <LogOut size={14} />
                      <span>{revokingId === session.id ? 'Signing out...' : 'Sign Out Device'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="sessions-security-note">
        <ShieldCheck size={18} className="sessions-security-icon" />
        <div className="sessions-security-content">
          <strong>Practitioner Security Advice</strong>
          If you ever suspect an unrecognized device, IP location, or browser, immediately revoke that device's session and update your account password.
        </div>
      </div>
    </Card>
  );
});

DoctorSessionsCard.displayName = 'DoctorSessionsCard';

