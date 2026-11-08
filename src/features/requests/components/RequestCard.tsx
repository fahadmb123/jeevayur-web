import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Check, X, Eye, UserCheck, AlertCircle, Phone, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { StatusPill } from '@/shared/ui/status-pill';
import type { PatientRequest } from '../types';
import './RequestCard.css';

export interface RequestCardProps {
  request: PatientRequest;
  index: number;
  onAccept: (request: PatientRequest) => void;
  onReject: (request: PatientRequest) => void;
  onViewDetails: (request: PatientRequest) => void;
  isProcessing?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = React.memo(({
  request,
  index,
  onAccept,
  onReject,
  onViewDetails,
  isProcessing = false,
}) => {
  const statusVariant = React.useMemo(() => {
    switch (request.status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }, [request.status]);

  const initial = React.useMemo(
    () => request.patientName.charAt(0).toUpperCase(),
    [request.patientName]
  );

  return (
    <motion.div
      className={`consult-card consult-card--${request.status}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.05 }}
    >
      <div className="consult-card__top">
        <div className="consult-card__patient-info">
          <div className="consult-card__avatar">
            <span>{initial}</span>
          </div>
          <div>
            <div className="consult-card__name-row">
              <h3 className="consult-card__name">{request.patientName}</h3>
              {request.phone && (
                <span className="consult-card__demographics">
                  <Phone size={12} className="inline mr-1" />
                  {request.phone}
                </span>
              )}
            </div>
            {request.language && (
              <span className="consult-card__location">
                <Globe size={13} /> {request.language}
              </span>
            )}
          </div>
        </div>

        <div className="consult-card__status-wrap">
          <StatusPill
            status={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            variant={statusVariant}
          />
          <span className="consult-card__time">
            <Clock size={12} /> {request.requestedAt}
          </span>
        </div>
      </div>

      <div className="consult-card__service-schedule">
        <div className="consult-card__badge-group">
          <span className="consult-card__service-badge">
            {request.service}
          </span>
          <span className="consult-card__mode-badge">
            {request.mode === 'Video Call' ? <Video size={13} /> : <MapPin size={13} />}
            {request.mode}
          </span>
        </div>

        {request.preferredDate && (
          <div className="consult-card__schedule-item">
            <Calendar size={14} className="consult-card__schedule-icon" />
            <span>Prefers: <strong>{request.preferredDate}</strong> {request.preferredTimeSlot ? `at ${request.preferredTimeSlot}` : ''}</span>
          </div>
        )}
      </div>

      <div className="consult-card__concern-box">
        <p className="consult-card__concern-text">
          <strong className="consult-card__concern-label">Reason / Inquiry:</strong> {request.primaryConcern}
        </p>
        {request.symptoms && request.symptoms.length > 0 && (
          <div className="consult-card__symptom-tags">
            {request.symptoms.map((symptom, idx) => (
              <span key={idx} className="consult-card__symptom-tag">
                {symptom}
              </span>
            ))}
          </div>
        )}
      </div>

      {request.status === 'rejected' && request.rejectionReason && (
        <div className="consult-card__feedback-note consult-card__feedback-note--rejected">
          <AlertCircle size={14} />
          <span>Reason: {request.rejectionReason}</span>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="consult-card__feedback-note consult-card__feedback-note--accepted">
          <UserCheck size={14} />
          <span>Enrolled as an active patient in your clinical directory.</span>
        </div>
      )}

      <div className="consult-card__actions">
        <Button
          variant="outline"
          size="sm"
          className="consult-card__btn-details"
          onClick={() => onViewDetails(request)}
        >
          <Eye size={15} />
          View Details
        </Button>

        {request.status === 'pending' && (
          <div className="consult-card__action-group">
            <Button
              variant="ghost"
              size="sm"
              className="consult-card__btn-reject"
              onClick={() => onReject(request)}
              disabled={isProcessing}
            >
              <X size={15} />
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="consult-card__btn-accept"
              onClick={() => onAccept(request)}
              disabled={isProcessing}
            >
              <Check size={15} />
              Accept Request
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

RequestCard.displayName = 'RequestCard';
export const ConsultationRequestCard = RequestCard;
