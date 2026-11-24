import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Inbox,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRequests } from '@/features/requests';
import type { PatientRequest } from '@/features/requests';
import { ROUTES } from '@/shared/config/routes';
import { Button } from '@/shared/ui/button';
import './DoctorQuickRequestsDrawer.css';

export interface DoctorQuickRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccepted?: (request: PatientRequest) => void;
}

export const DoctorQuickRequestsDrawer: React.FC<DoctorQuickRequestsDrawerProps> = React.memo(({
  isOpen,
  onClose,
  onAccepted,
}) => {
  const navigate = useNavigate();
  const { requests, loading, acceptRequest, rejectRequest, refresh } = useRequests({ status: 'pending' });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const pendingList = React.useMemo(() => {
    return requests.filter((r) => r.status === 'pending');
  }, [requests]);

  const handleAccept = async (req: PatientRequest) => {
    try {
      setProcessingId(req.id);
      await acceptRequest(req.id);
      setActionMessage(`Accepted request for ${req.patientName}`);
      onAccepted?.(req);
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setActionMessage('Failed to accept request. Please try again.');
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: PatientRequest) => {
    const confirmed = window.confirm(`Decline consultation request from ${req.patientName}?`);
    if (!confirmed) return;

    try {
      setProcessingId(req.id);
      await rejectRequest(req.id, 'Declined by consulting physician');
      setActionMessage(`Declined request for ${req.patientName}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setActionMessage('Failed to decline request.');
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate(ROUTES.DOCTOR_REQUESTS);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="requests-drawer-backdrop" onClick={onClose}>
          <motion.aside
            className="requests-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Inbound Consultation Requests"
          >
            <div className="requests-drawer__header">
              <div className="requests-drawer__title-wrap">
                <div className="requests-drawer__icon-box">
                  <Inbox size={20} />
                </div>
                <div>
                  <h3 className="requests-drawer__title">Inbound Requests</h3>
                  <span className="requests-drawer__subtitle">
                    {pendingList.length} patient requests pending review
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="requests-drawer__close-btn"
                onClick={onClose}
                aria-label="Close requests drawer"
              >
                <X size={20} />
              </button>
            </div>

            {actionMessage && (
              <div className="requests-drawer__alert">
                <CheckCircle2 size={16} />
                <span>{actionMessage}</span>
              </div>
            )}

            <div className="requests-drawer__body">
              {loading && pendingList.length === 0 ? (
                <div className="requests-drawer__loading">
                  <Loader2 size={28} className="spin-icon" />
                  <p>Fetching inbound clinic requests...</p>
                </div>
              ) : pendingList.length === 0 ? (
                <div className="requests-drawer__empty">
                  <div className="requests-drawer__empty-circle">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4>All Caught Up!</h4>
                  <p>There are no pending consultation requests waiting for review right now.</p>
                  <Button variant="outline" size="sm" onClick={() => refresh()}>
                    Check for Updates
                  </Button>
                </div>
              ) : (
                <div className="requests-drawer__list">
                  {pendingList.map((req) => {
                    const isBusy = processingId === req.id;
                    const cleanPhone = req.phone ? req.phone.replace(/[^0-9+]/g, '') : '';
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;
                    const isVideo = req.mode === 'Video Call';

                    return (
                      <div key={req.id} className="requests-drawer__card">
                        <div className="requests-drawer__card-top">
                          <div>
                            <h4 className="requests-drawer__patient-name">{req.patientName}</h4>
                            <div className="requests-drawer__patient-meta">
                              {req.age && <span>{req.age} yrs</span>}
                              {req.gender && <span>• {req.gender}</span>}
                              {req.city && <span>• {req.city}</span>}
                            </div>
                          </div>
                          <span
                            className={`requests-drawer__format-tag ${
                              isVideo ? 'format--online' : 'format--inperson'
                            }`}
                          >
                            {isVideo ? (
                              <>
                                <Video size={12} />
                                <span>Online</span>
                              </>
                            ) : (
                              <>
                                <MapPin size={12} />
                                <span>{req.mode || 'In-Clinic'}</span>
                              </>
                            )}
                          </span>
                        </div>

                        {(req.preferredDate || req.preferredTimeSlot) && (
                          <div className="requests-drawer__card-time">
                            {req.preferredDate && (
                              <span className="requests-drawer__time-item">
                                <Calendar size={13} />
                                <span>{req.preferredDate}</span>
                              </span>
                            )}
                            {req.preferredTimeSlot && (
                              <span className="requests-drawer__time-item">
                                <Clock size={13} />
                                <span>{req.preferredTimeSlot}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {req.primaryConcern && (
                          <div className="requests-drawer__concern-box">
                            <span className="requests-drawer__concern-label">Health Concern:</span>
                            <p className="requests-drawer__concern-text">{req.primaryConcern}</p>
                          </div>
                        )}

                        <div className="requests-drawer__contact-row">
                          {req.phone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="requests-drawer__contact-chip"
                              title="Call"
                            >
                              <Phone size={12} />
                              <span>{req.phone}</span>
                            </a>
                          )}
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="requests-drawer__contact-chip chip--wa"
                              title="Chat on WhatsApp"
                            >
                              <span>WhatsApp</span>
                            </a>
                          )}
                          {req.email && (
                            <a
                              href={`mailto:${req.email}`}
                              className="requests-drawer__contact-chip"
                              title="Send Email"
                            >
                              <Mail size={12} />
                              <span>Email</span>
                            </a>
                          )}
                        </div>

                        <div className="requests-drawer__card-actions">
                          <button
                            type="button"
                            className="requests-drawer__decline-btn"
                            disabled={isBusy}
                            onClick={() => handleReject(req)}
                          >
                            <UserX size={14} />
                            <span>Decline</span>
                          </button>

                          <button
                            type="button"
                            className="requests-drawer__accept-btn"
                            disabled={isBusy}
                            onClick={() => handleAccept(req)}
                          >
                            {isBusy ? (
                              <Loader2 size={14} className="spin-icon" />
                            ) : (
                              <UserCheck size={14} />
                            )}
                            <span>{isBusy ? 'Processing...' : 'Accept Request'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="requests-drawer__footer">
              <Button
                variant="primary"
                className="requests-drawer__full-btn"
                onClick={handleViewAll}
              >
                <span>Open Full Requests Portal</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
});

DoctorQuickRequestsDrawer.displayName = 'DoctorQuickRequestsDrawer';
