import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Check,
  X,
  Eye,
  UserCheck,
  AlertCircle,
  Phone,
  Globe,
  Mail,
  Leaf,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { StatusPill } from '@/shared/ui/status-pill';
import { PatientAvatar } from '@/features/patients';
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
  const statusVariant = useMemo(() => {
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

  const isYoga = request.service.toLowerCase().includes('yoga');
  const isOnline = request.mode === 'Video Call';

  return (
    <motion.div
      className={`consult-card consult-card--${request.status}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
    >
      <div className="consult-card__header">
        <div className="consult-card__patient">
          <PatientAvatar name={request.patientName} id={request.id} size={42} />
          <div className="consult-card__patient-meta">
            <div className="consult-card__patient-name-row">
              <h3 className="consult-card__patient-name">{request.patientName}</h3>
              <span className="consult-card__ref-id">#{request.id.slice(-6)}</span>
            </div>
            <div className="consult-card__contact-chips">
              {request.phone && (
                <span className="consult-card__chip">
                  <Phone size={12} />
                  <span>{request.phone}</span>
                </span>
              )}
              {request.email && (
                <span className="consult-card__chip consult-card__chip--email">
                  <Mail size={12} />
                  <span>{request.email}</span>
                </span>
              )}
              {request.language && (
                <span className="consult-card__chip">
                  <Globe size={12} />
                  <span>{request.language}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="consult-card__header-right">
          <StatusPill
            status={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            variant={statusVariant}
          />
          <span className="consult-card__timestamp">
            <Clock size={12} />
            <span>{request.requestedAt}</span>
          </span>
        </div>
      </div>

      <div className="consult-card__spec-strip">
        <div className="consult-card__spec-pill consult-card__spec-pill--service">
          {isYoga ? <Sparkles size={13} /> : <Leaf size={13} />}
          <span>{request.service}</span>
        </div>

        <div className="consult-card__spec-pill consult-card__spec-pill--mode">
          {isOnline ? <Video size={13} /> : <MapPin size={13} />}
          <span>{isOnline ? 'Online Virtual Consultation' : 'In-Clinic (Kottakkal)'}</span>
        </div>

        {request.preferredDate && (
          <div className="consult-card__spec-pill consult-card__spec-pill--schedule">
            <Calendar size={13} />
            <span>
              Prefers: <strong>{request.preferredDate}</strong>{' '}
              {request.preferredTimeSlot ? `(${request.preferredTimeSlot})` : ''}
            </span>
          </div>
        )}
      </div>

      <div className="consult-card__inquiry-card">
        <div className="consult-card__inquiry-header">
          <FileText size={13} />
          <span>Patient Inquiry &amp; Health Concern</span>
        </div>
        <p className="consult-card__inquiry-body">{request.primaryConcern}</p>
      </div>

      {request.status === 'rejected' && request.rejectionReason && (
        <div className="consult-card__feedback-note consult-card__feedback-note--rejected">
          <AlertCircle size={15} />
          <span>Declined: {request.rejectionReason}</span>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="consult-card__feedback-note consult-card__feedback-note--accepted">
          <UserCheck size={15} />
          <span>Enrolled as an active patient in your clinical directory.</span>
        </div>
      )}

      <div className="consult-card__footer">
        <Button
          variant="outline"
          size="sm"
          className="consult-card__btn-view"
          onClick={() => onViewDetails(request)}
        >
          <Eye size={14} />
          <span>View Details</span>
        </Button>

        <div className="consult-card__actions-group">
          {request.status === 'pending' && (
            <>
              <button
                type="button"
                className="consult-card__btn-decline"
                onClick={() => onReject(request)}
                disabled={isProcessing}
              >
                <X size={14} />
                <span>Decline</span>
              </button>
              <button
                type="button"
                className="consult-card__btn-accept"
                onClick={() => onAccept(request)}
                disabled={isProcessing}
              >
                <Check size={14} />
                <span>Accept Request</span>
              </button>
            </>
          )}

          {request.status === 'accepted' && (
            <span className="consult-card__status-confirmed">
              <Check size={14} /> Confirmed &amp; Active
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

RequestCard.displayName = 'RequestCard';
export const ConsultationRequestCard = RequestCard;
