import React from 'react';
import { Activity, TrendingUp, Sliders, CheckCircle2 } from 'lucide-react';
import './DoctorClinicalInsights.css';

export interface DoctorClinicalInsightsProps {
  doshaMetrics: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  activeCount: number;
  completedCount: number;
  totalCount: number;
  onFilterActive?: () => void;
  onFilterCompleted?: () => void;
}

export const DoctorClinicalInsights: React.FC<DoctorClinicalInsightsProps> = React.memo(({
  doshaMetrics,
  activeCount,
  completedCount,
  totalCount,
  onFilterActive,
  onFilterCompleted,
}) => {
  const efficacyRate = totalCount > 0
    ? Math.min(100, Math.round(((completedCount + Math.floor(activeCount * 0.75)) / Math.max(1, totalCount)) * 100))
    : 96;

  return (
    <div className="doctor-clinical-insights">
      <div className="doctor-insight-card doctor-insight-card--dosha">
        <div className="doctor-insight-card__header">
          <div className="doctor-insight-card__title-box">
            <Activity size={16} className="doctor-insight-card__icon" />
            <h3 className="doctor-insight-card__title">Dosha Diagnostics Spectrum</h3>
          </div>
          <span className="doctor-insight-card__badge doctor-insight-card__badge--mono">
            PRAKRITI_LIVE
          </span>
        </div>

        <div className="doctor-dosha-bar" role="meter" aria-label="Dosha Distribution">
          <div
            className="doctor-dosha-segment doctor-dosha-segment--vata"
            style={{ width: `${doshaMetrics.vata}%` }}
            title={`Vata: ${doshaMetrics.vata}%`}
          />
          <div
            className="doctor-dosha-segment doctor-dosha-segment--pitta"
            style={{ width: `${doshaMetrics.pitta}%` }}
            title={`Pitta: ${doshaMetrics.pitta}%`}
          />
          <div
            className="doctor-dosha-segment doctor-dosha-segment--kapha"
            style={{ width: `${doshaMetrics.kapha}%` }}
            title={`Kapha: ${doshaMetrics.kapha}%`}
          />
        </div>

        <div className="doctor-dosha-legend">
          <div className="doctor-dosha-legend-item">
            <span className="doctor-dosha-dot doctor-dosha-dot--vata" />
            <span className="doctor-dosha-name">Vata (Nerves / Joints)</span>
            <span className="doctor-dosha-value">{doshaMetrics.vata}%</span>
          </div>

          <div className="doctor-dosha-legend-item">
            <span className="doctor-dosha-dot doctor-dosha-dot--pitta" />
            <span className="doctor-dosha-name">Pitta (Agni / Metabolic)</span>
            <span className="doctor-dosha-value">{doshaMetrics.pitta}%</span>
          </div>

          <div className="doctor-dosha-legend-item">
            <span className="doctor-dosha-dot doctor-dosha-dot--kapha" />
            <span className="doctor-dosha-name">Kapha (Structural / Fluids)</span>
            <span className="doctor-dosha-value">{doshaMetrics.kapha}%</span>
          </div>
        </div>

        <div className="doctor-insight-card__note">
          <span>Seasonal Directives: Vata balancing via warm unctuous therapies recommended.</span>
        </div>
      </div>

      <div className="doctor-insight-card doctor-insight-card--velocity">
        <div className="doctor-insight-card__header">
          <div className="doctor-insight-card__title-box">
            <TrendingUp size={16} className="doctor-insight-card__icon" />
            <h3 className="doctor-insight-card__title">Clinical Progression Velocity</h3>
          </div>
          <span className="doctor-insight-card__badge doctor-insight-card__badge--green">
            {efficacyRate}% EFFICACY
          </span>
        </div>

        <div className="doctor-velocity-stages">
          <div className="doctor-stage-step doctor-stage-step--active">
            <span className="doctor-stage-index">01</span>
            <span className="doctor-stage-name">Nadi Pariksha</span>
          </div>
          <div className="doctor-stage-step doctor-stage-step--active">
            <span className="doctor-stage-index">02</span>
            <span className="doctor-stage-name">Purva Karma</span>
          </div>
          <div className="doctor-stage-step doctor-stage-step--active">
            <span className="doctor-stage-index">03</span>
            <span className="doctor-stage-name">Pradhana Karma</span>
          </div>
          <div className="doctor-stage-step">
            <span className="doctor-stage-index">04</span>
            <span className="doctor-stage-name">Rasayana Rejuv</span>
          </div>
        </div>

        <div className="doctor-velocity-bar-wrap">
          <div className="doctor-velocity-bar">
            <div className="doctor-velocity-fill" style={{ width: `${efficacyRate}%` }} />
          </div>
        </div>

        <div className="doctor-velocity-stats">
          <button
            type="button"
            className="doctor-velocity-stat-pill doctor-velocity-stat-pill--interactive"
            onClick={onFilterActive}
          >
            <span className="doctor-velocity-stat-dot doctor-velocity-stat-dot--blue" />
            <span><strong>{activeCount}</strong> In Active Care</span>
          </button>

          <button
            type="button"
            className="doctor-velocity-stat-pill doctor-velocity-stat-pill--interactive"
            onClick={onFilterCompleted}
          >
            <CheckCircle2 size={12} className="doctor-velocity-stat-icon--green" />
            <span><strong>{completedCount}</strong> Concluded</span>
          </button>
        </div>
      </div>

      <div className="doctor-insight-card doctor-insight-card--modality">
        <div className="doctor-insight-card__header">
          <div className="doctor-insight-card__title-box">
            <Sliders size={16} className="doctor-insight-card__icon" />
            <h3 className="doctor-insight-card__title">Clinical Modalities & Telemetry</h3>
          </div>
          <span className="doctor-insight-card__badge doctor-insight-card__badge--mono">
            GATEWAY_OK
          </span>
        </div>

        <div className="doctor-modality-list">
          <div className="doctor-modality-row">
            <div className="doctor-modality-info">
              <span className="doctor-modality-label">In-Clinic Panchakarma</span>
              <span className="doctor-modality-percent">68%</span>
            </div>
            <div className="doctor-modality-progress">
              <div className="doctor-modality-fill doctor-modality-fill--green" style={{ width: '68%' }} />
            </div>
          </div>

          <div className="doctor-modality-row">
            <div className="doctor-modality-info">
              <span className="doctor-modality-label">Virtual Tele-Ayurveda</span>
              <span className="doctor-modality-percent">24%</span>
            </div>
            <div className="doctor-modality-progress">
              <div className="doctor-modality-fill doctor-modality-fill--blue" style={{ width: '24%' }} />
            </div>
          </div>

          <div className="doctor-modality-row">
            <div className="doctor-modality-info">
              <span className="doctor-modality-label">Yoga & Pranayama Rehab</span>
              <span className="doctor-modality-percent">8%</span>
            </div>
            <div className="doctor-modality-progress">
              <div className="doctor-modality-fill doctor-modality-fill--orange" style={{ width: '8%' }} />
            </div>
          </div>
        </div>

        <div className="doctor-telemetry-chips">
          <span className="doctor-telemetry-chip">[NADI_CALIBRATED]</span>
          <span className="doctor-telemetry-chip">[SHIRODHARA_OK]</span>
          <span className="doctor-telemetry-chip">[KIZHI_ACTIVE]</span>
        </div>
      </div>
    </div>
  );
});

DoctorClinicalInsights.displayName = 'DoctorClinicalInsights';
