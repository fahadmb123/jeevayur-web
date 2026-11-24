import React from 'react';
import { Database, ShieldCheck, Download, Activity, RefreshCw } from 'lucide-react';
import './DoctorTelemetryBar.css';

export interface DoctorTelemetryBarProps {
  patientCount: number;
  isSyncing?: boolean;
  onSync?: () => void;
  onExportCSV?: () => void;
  lastSyncedText?: string;
}

export const DoctorTelemetryBar: React.FC<DoctorTelemetryBarProps> = React.memo(({
  patientCount,
  isSyncing = false,
  onSync,
  onExportCSV,
  lastSyncedText = 'Realtime Sync Active',
}) => {
  return (
    <div className="doctor-telemetry-bar">
      <div className="doctor-telemetry-bar__left">
        <div className="doctor-telemetry-badge doctor-telemetry-badge--live">
          <span className="doctor-telemetry-radar-dot" />
          <span className="doctor-telemetry-mono">SYS_ONLINE</span>
        </div>

        <div className="doctor-telemetry-badge doctor-telemetry-badge--muted">
          <Database size={12} className="doctor-telemetry-icon" />
          <span className="doctor-telemetry-mono">TURSO_SQL · 18ms</span>
        </div>

        <div className="doctor-telemetry-badge doctor-telemetry-badge--muted">
          <ShieldCheck size={12} className="doctor-telemetry-icon" />
          <span className="doctor-telemetry-mono">AES_256_GCM</span>
        </div>

        <div className="doctor-telemetry-badge doctor-telemetry-badge--protocol">
          <Activity size={12} className="doctor-telemetry-icon" />
          <span className="doctor-telemetry-mono">AYURVEDA_ENGINE_v2.4</span>
        </div>
      </div>

      <div className="doctor-telemetry-bar__right">
        <span className="doctor-telemetry-sync-label">{lastSyncedText}</span>

        {onSync && (
          <button
            type="button"
            className={`doctor-telemetry-action-btn ${isSyncing ? 'is-syncing' : ''}`}
            onClick={onSync}
            disabled={isSyncing}
            title="Force refresh database state"
          >
            <RefreshCw size={12} className={isSyncing ? 'telemetry-spin' : ''} />
            <span>Telemetry Ping</span>
          </button>
        )}

        {onExportCSV && (
          <button
            type="button"
            className="doctor-telemetry-action-btn doctor-telemetry-action-btn--export"
            onClick={onExportCSV}
            disabled={patientCount === 0}
            title={`Export ${patientCount} clinical records to CSV`}
          >
            <Download size={12} />
            <span>Export Roster (.csv)</span>
          </button>
        )}
      </div>
    </div>
  );
});

DoctorTelemetryBar.displayName = 'DoctorTelemetryBar';
