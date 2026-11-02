import React from 'react';
import { Clock, MessageCircle, MapPin, Video, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { YogaProgram } from '../data/yogaathmaData';

export interface YogaProgramDetailsCardProps {
  program: YogaProgram;
  programs: YogaProgram[];
  onSelectProgram: (program: YogaProgram) => void;
}

export const YogaProgramDetailsCard: React.FC<YogaProgramDetailsCardProps> = React.memo(({
  program,
  programs,
  onSelectProgram,
}) => {
  const currentIndex = programs.findIndex((p) => p.id === program.id);
  const prevProgram = currentIndex > 0 ? programs[currentIndex - 1] : null;
  const nextProgram = currentIndex >= 0 && currentIndex < programs.length - 1 ? programs[currentIndex + 1] : null;

  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    `Hello Jeevayurniketan | Yogaathma, I would like to book or enquire about the "${program.title}" program.`
  )}`;

  const isOnline = program.format.toLowerCase().includes('online');

  return (
    <article className="yoga-details-card" id="yoga-program-details">
      <div className="yoga-details-card__top">
        <div className="yoga-details-card__badges">
          <span className="yoga-details-card__tag">{program.categoryTag}</span>
          <span className="yoga-details-card__format">
            {isOnline ? <Video size={12} /> : <MapPin size={12} />}
            <span>{program.format}</span>
          </span>
          <span className="yoga-details-card__duration">
            <Clock size={12} />
            <span>{program.duration}</span>
          </span>
        </div>

        <div className="yoga-details-card__nav-arrows">
          <button
            type="button"
            className="yoga-details-nav-btn"
            disabled={!prevProgram}
            onClick={() => prevProgram && onSelectProgram(prevProgram)}
            aria-label="Previous yoga program"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="yoga-details-nav-btn"
            disabled={!nextProgram}
            onClick={() => nextProgram && onSelectProgram(nextProgram)}
            aria-label="Next yoga program"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="yoga-details-card__main">
        <h2 className="yoga-details-card__title">{program.title}</h2>
        {program.tagline && <p className="yoga-details-card__tagline">{program.tagline}</p>}
        <p className="yoga-details-card__desc">{program.description}</p>

        {program.idealFor && program.idealFor.length > 0 && (
          <div className="yoga-details-card__highlights">
            <h3 className="yoga-details-card__highlights-title">
              {program.idealForTitle || 'Program Highlights:'}
            </h3>
            <ul className="yoga-details-card__highlights-list">
              {program.idealFor.map((item, i) => (
                <li key={i} className="yoga-details-highlight-item">
                  <Check size={15} className="yoga-highlight-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {program.focus && (
          <div className="yoga-details-card__focus-box">
            <span className="yoga-focus-label">Program Focus:</span>
            <p className="yoga-focus-text">{program.focus}</p>
          </div>
        )}

        <div className="yoga-details-card__actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="yoga-details-card__whatsapp-btn"
          >
            <MessageCircle size={16} />
            <span>Reserve on WhatsApp</span>
          </a>

          <a href="#yoga-schedule" className="yoga-details-card__timetable-btn">
            <span>View Weekly Timetable</span>
          </a>
        </div>
      </div>

      {programs.length > 1 && (
        <div className="yoga-details-card__tabs">
          <span className="yoga-tabs-label">Switch Program:</span>
          <div className="yoga-tabs-scroll">
            {programs.map((item) => {
              const isActive = item.id === program.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`yoga-quick-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectProgram(item)}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
});

YogaProgramDetailsCard.displayName = 'YogaProgramDetailsCard';
