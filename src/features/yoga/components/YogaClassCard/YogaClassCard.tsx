import React from 'react';
import {
  Clock,
  User,
  MapPin,
  Video,
  Edit2,
  Trash2,
  Target,
} from 'lucide-react';
import type { YogaSession, DayOfWeek } from '../../types/yoga.types';
import './YogaClassCard.css';

interface YogaClassCardProps {
  session: YogaSession;
  onEdit: (session: YogaSession) => void;
  onDelete?: (id: string, title: string) => void;
}

const ALL_DAYS_SHORT: { key: DayOfWeek; label: string }[] = [
  { key: 'Monday', label: 'Mon' },
  { key: 'Tuesday', label: 'Tue' },
  { key: 'Wednesday', label: 'Wed' },
  { key: 'Thursday', label: 'Thu' },
  { key: 'Friday', label: 'Fri' },
  { key: 'Saturday', label: 'Sat' },
  { key: 'Sunday', label: 'Sun' },
];

export const YogaClassCard: React.FC<YogaClassCardProps> = React.memo(({
  session,
  onEdit,
  onDelete,
}) => {
  const formatIcon = React.useMemo(() => {
    return session.format === 'online' ? <Video size={13} /> : <MapPin size={13} />;
  }, [session.format]);

  const formatLabel = React.useMemo(() => {
    return session.format === 'online' ? 'Online' : 'Offline';
  }, [session.format]);

  return (
    <article className="yoga-card" aria-label={session.title}>
      <div className="yoga-card__image-container">
        <img
          src={session.imageUrl}
          alt={session.title}
          className="yoga-card__image"
          loading="lazy"
        />
        <div className="yoga-card__image-overlay">
          <div className="yoga-card__badge-group">
            <span
              className={`yoga-card__format-badge yoga-card__format-badge--${session.format}`}
            >
              {formatIcon}
              {formatLabel}
            </span>
            <span className="yoga-card__level-badge">{session.level}</span>
          </div>
          <span className="yoga-card__duration-badge">
            <Clock size={12} />
            {session.duration}
          </span>
        </div>
      </div>

      <div className="yoga-card__body">
        <div className="yoga-card__header">
          <h3 className="yoga-card__title">{session.title}</h3>
          {session.instructor && (
            <div className="yoga-card__instructor">
              <User size={14} />
              <span>{session.instructor}</span>
            </div>
          )}
        </div>

        {/* Days Schedule */}
        <div className="yoga-card__days-schedule">
          <div className="yoga-card__days-row">
            {ALL_DAYS_SHORT.map((day) => {
              const isActive = session.days.includes(day.key);
              return (
                <span
                  key={day.key}
                  className={`yoga-card__day-pill ${isActive ? 'active' : ''}`}
                  title={isActive ? `Active on ${day.key}` : `No class on ${day.key}`}
                >
                  {day.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="yoga-card__meta-tags">
          <div className="yoga-card__meta-item">
            <Target size={14} />
            <span>
              <strong>Suitable for:</strong> {session.suitableFor}
            </span>
          </div>
          {session.location && (
            <div className="yoga-card__meta-item">
              <MapPin size={14} />
              <span>
                <strong>Location:</strong> {session.location}
              </span>
            </div>
          )}
        </div>

        <p className="yoga-card__desc">{session.description}</p>
      </div>

      <div className="yoga-card__footer">
        <div className="yoga-card__price-box">
          <span className="yoga-card__price-label">Session Fee</span>
          <span className="yoga-card__price-value">{session.price || 'Free / Included'}</span>
        </div>

        <div className="yoga-card__actions">
          {onDelete && (
            <button
              type="button"
              className="yoga-card__btn-delete"
              onClick={() => onDelete(session.id, session.title)}
              title="Delete session"
              aria-label={`Delete ${session.title}`}
            >
              <Trash2 size={15} />
            </button>
          )}

          <button
            type="button"
            className="yoga-card__btn-edit"
            onClick={() => onEdit(session)}
            aria-label={`Edit ${session.title}`}
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </article>
  );
});

YogaClassCard.displayName = 'YogaClassCard';
