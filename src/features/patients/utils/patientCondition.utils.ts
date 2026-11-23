export interface ParsedPatientCondition {
  serviceType: string | null;
  format: string | null;
  formatDetail: string | null;
  reason: string | null;
}

export function parsePatientCondition(rawCondition?: string): ParsedPatientCondition {
  if (!rawCondition) {
    return {
      serviceType: null,
      format: null,
      formatDetail: null,
      reason: null,
    };
  }

  const match = rawCondition.match(/^([^()]+)\s*\(([^)]+)\)\s*:\s*(.*)$/i);
  if (match) {
    const rawType = match[1].trim();
    const rawFormat = match[2].trim();
    const rawReason = match[3].trim();

    const isOnline = rawFormat.toLowerCase() === 'online';
    const isOffline = rawFormat.toLowerCase() === 'offline';

    const format = isOnline
      ? 'Online'
      : isOffline
      ? 'Offline'
      : rawFormat.charAt(0).toUpperCase() + rawFormat.slice(1);

    const formatDetail = isOnline
      ? 'Online (Video Consultation)'
      : isOffline
      ? 'Offline (In-Clinic Consultation)'
      : format;

    const serviceType = rawType
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      serviceType,
      format,
      formatDetail,
      reason: rawReason,
    };
  }

  return {
    serviceType: null,
    format: null,
    formatDetail: null,
    reason: rawCondition,
  };
}
