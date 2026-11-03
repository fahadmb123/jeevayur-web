import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, Sparkles, ShieldCheck, HeartPulse, Leaf } from 'lucide-react';
import type { AyurvedaService } from '../types';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import './ServiceDetailModal.css';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: AyurvedaService | null;
  iconComponent: React.ComponentType<{ size?: number; className?: string }>;
  themeTag?: string;
  accentColor?: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = React.memo(({
  isOpen,
  onClose,
  service,
  iconComponent: IconComponent,
  themeTag,
  accentColor = '#1B6B50',
}) => {
  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      <div className="svc-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          className="svc-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="svc-modal-close"
            onClick={onClose}
            aria-label="Close Service Overview"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="svc-modal-header">
            <div
              className="svc-modal-icon-pod"
              style={{
                background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <IconComponent size={30} />
            </div>

            <div className="svc-modal-header-info">
              <div className="svc-modal-pills-row">
                {themeTag && (
                  <span className="svc-modal-pill svc-modal-pill--tag">
                    <Sparkles size={12} />
                    <span>{themeTag}</span>
                  </span>
                )}
                <span className="svc-modal-pill svc-modal-pill--duration">
                  <Clock size={12} />
                  <span>{service.duration || 'Personalized Care'}</span>
                </span>
              </div>

              <h2 className="svc-modal-title">{service.title}</h2>
              <p className="svc-modal-lead">Clinical Ayurveda &amp; Holistic Protocol</p>
            </div>
          </div>

          {/* Modal Content */}
          <div className="svc-modal-body">
            {/* Clinical Overview Block */}
            <div className="svc-modal-section">
              <h3 className="svc-modal-section-title">
                <Leaf size={16} />
                <span>Clinical Scope &amp; Ayurvedic Perspective</span>
              </h3>
              <p className="svc-modal-para">{service.description}</p>
              <p className="svc-modal-para">
                Under the clinical guidance of Dr. Ahalya T.S., treatments are personalized through foundational Prakriti (constitutional) analysis, evaluating digestive metabolic fire (Agni), tissue vitality (Dhatu), and chronic Dosha imbalances. Rather than symptomatic suppression, therapies address root causality with authentic Kerala Ayurvedic formulations, custom Ahara (dietary) regimens, and mindful lifestyle adaptations.
              </p>
            </div>

            {/* Key Clinical Focus / Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="svc-modal-section">
                <h3 className="svc-modal-section-title">
                  <ShieldCheck size={16} />
                  <span>Therapeutic Focus &amp; Expected Outcomes</span>
                </h3>
                <div className="svc-modal-benefits-grid">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="svc-modal-benefit-item">
                      <div className="svc-modal-check-wrap">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="svc-modal-benefit-text">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treatment Methodology Banner */}
            <div className="svc-modal-method-banner">
              <div className="svc-modal-method-item">
                <HeartPulse size={18} />
                <div>
                  <h4>Individualized Diagnosis</h4>
                  <p>In-depth Prakriti, Nadi Pariksha, and lifestyle history evaluation.</p>
                </div>
              </div>
              <div className="svc-modal-method-item">
                <Leaf size={18} />
                <div>
                  <h4>Classical Therapeutics</h4>
                  <p>Pure herbal formulations, Ahara guidelines, and holistic recovery.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer with Direct Consultation Booking */}
          <div className="svc-modal-footer">
            <button type="button" className="svc-modal-cancel-btn" onClick={onClose}>
              Explore More
            </button>
            <div className="svc-modal-cta-wrap">
              <BookAppointmentButton
                size="md"
                variant="primary"
                label={`Consult Dr. Ahalya for ${service.title.split('(')[0].trim()}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

ServiceDetailModal.displayName = 'ServiceDetailModal';
