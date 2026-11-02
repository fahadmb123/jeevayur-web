import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Compass,
  Award,
  Heart,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Inbox,
  User,
} from 'lucide-react';
import { useYogaSchedule } from '../hooks/useYogaSchedule';
import { YogaProgramShowcaseCard } from '../components/YogaProgramShowcaseCard';
import { YogaBookingCard } from '../components/YogaBookingCard';
import { YOGAATHMA_DATA } from '../data/yogaathmaData';
import { Navbar, Footer } from '@/shared/layout';
import type { DayOfWeek, YogaFormat } from '../types/yoga.types';
import {
  fadeUpVariants,
} from '@/shared/lib/animations';
import './YogaSchedulePage.css';

const PILLAR_ICONS = [Compass, Award, Heart, Sparkles, ShieldCheck];

const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
  { key: 'Monday', label: 'Mon' },
  { key: 'Tuesday', label: 'Tue' },
  { key: 'Wednesday', label: 'Wed' },
  { key: 'Thursday', label: 'Thu' },
  { key: 'Friday', label: 'Fri' },
  { key: 'Saturday', label: 'Sat' },
  { key: 'Sunday', label: 'Sun' },
];

export const YogaSchedulePage: React.FC = React.memo(() => {
  const {
    sessions,
    isLoading,
  } = useYogaSchedule();

  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');
  const [activeFormat, setActiveFormat] = useState<YogaFormat | 'all'>('all');

  const { hero, approach, programs } = YOGAATHMA_DATA;

  const whatsappHeroUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
    hero.whatsappMessage
  )}`;

  // Filter schedule sessions for the customer
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesDay = session.days.includes(activeDay);
      const matchesFormat = activeFormat === 'all' || session.format === activeFormat;
      return matchesDay && matchesFormat;
    });
  }, [sessions, activeDay, activeFormat]);

  return (
    <div className="yoga-page-shell">
      <Navbar />

      <main className="yoga-page">
        {/* ==================================================================
            1. EDITORIAL SANCTUARY HERO
            ================================================================== */}
        <header className="yoga-hero-section">
          <div className="yoga-container">
            <div className="yoga-hero-content">
              <motion.div
                className="yoga-hero-badge"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <Sparkles size={13} className="text-accent-gold" />
                <span>YOGAATHMA &bull; CLASSICAL AYURVEDIC SWASTHYA</span>
              </motion.div>

              <motion.h1
                className="yoga-hero-title"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.08 }}
              >
                Yoga for Mind, Body <span className="yoga-hero-title-accent">&amp; Spirit</span>
              </motion.h1>

              <motion.p
                className="yoga-hero-subtitle"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.14 }}
              >
                Authentic, physician-guided yogic sadhana combining classical Asana alignment, conscious Pranayama breath regulation, and restorative Smriti mindfulness under experienced Yogacharyas.
              </motion.p>

              <motion.div
                className="yoga-hero-actions"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <a
                  href={whatsappHeroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yoga-hero-btn-primary"
                >
                  <MessageCircle size={17} />
                  <span>Reserve Session on WhatsApp</span>
                </a>

                <a href="#yoga-schedule" className="yoga-hero-btn-secondary">
                  <Calendar size={16} />
                  <span>View Weekly Timetable</span>
                </a>
              </motion.div>
            </div>
          </div>
        </header>

        {/* ==================================================================
            2. THE 5 FOUNDATIONAL PILLARS
            ================================================================== */}
        <section className="yoga-pillars-section">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <span className="yoga-eyebrow">OUR YOGIC PHILOSOPHY</span>
              <h2 className="yoga-section-heading">Yoga That Connects Body, Mind &amp; Soul</h2>
              <p className="yoga-section-desc">
                Rooted in authentic shastras, our sessions emphasize mindfulness, movement safety, and constitutional balance tailored to individual needs.
              </p>
            </div>

            <div className="yoga-pillars-grid">
              {approach.pillars.map((pillar, idx) => {
                const IconComp = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                return (
                  <div key={idx} className="yoga-pillar-item">
                    <div className="yoga-pillar-icon-box">
                      <IconComp size={18} />
                    </div>
                    <div className="yoga-pillar-text">
                      <h4>{pillar.title}</h4>
                      <p>{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. CURATED YOGA PATHWAYS (EDITORIAL SHOWCASE)
            ================================================================== */}
        <section id="yoga-programs" className="yoga-programs-section">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <span className="yoga-eyebrow">SIGNATURE DISCIPLINES</span>
              <h2 className="yoga-section-heading">Our Yoga Programs</h2>
              <p className="yoga-section-desc">
                From 1-on-1 personalized sadhana to therapeutic rehabilitation, discover a practice that resonates with your current physical and mental state.
              </p>
            </div>

            <div className="yoga-programs-grid">
              {programs.map((program, index) => (
                <YogaProgramShowcaseCard
                  key={program.id}
                  program={program}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. PATIENT-FACING LIVE & IN-SHALA WEEKLY TIMETABLE
            ================================================================== */}
        <section id="yoga-schedule" className="yoga-schedule-section">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <span className="yoga-eyebrow">PRACTICE TIMINGS</span>
              <h2 className="yoga-section-heading">Weekly Live &amp; Shala Timetable</h2>
              <p className="yoga-section-desc">
                Join us in our tranquil Kottakkal Shala or attend live online sessions from anywhere in the world.
              </p>
            </div>

            {/* Timetable Controls: Day Selector + Format Filter */}
            <div className="yoga-schedule-controls">
              {/* Day Selector Chips */}
              <div className="yoga-day-tabs" role="tablist">
                {DAYS_OF_WEEK.map((d) => {
                  const isActive = activeDay === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`yoga-day-tab ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveDay(d.key)}
                    >
                      <span className="yoga-day-short">{d.label}</span>
                      <span className="yoga-day-full">{d.key}</span>
                    </button>
                  );
                })}
              </div>

              {/* Format Filter */}
              <div className="yoga-format-filter">
                <button
                  type="button"
                  className={`yoga-format-btn ${activeFormat === 'all' ? 'is-active' : ''}`}
                  onClick={() => setActiveFormat('all')}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  className={`yoga-format-btn ${activeFormat === 'offline' ? 'is-active' : ''}`}
                  onClick={() => setActiveFormat('offline')}
                >
                  <MapPin size={12} />
                  <span>In Shala</span>
                </button>
                <button
                  type="button"
                  className={`yoga-format-btn ${activeFormat === 'online' ? 'is-active' : ''}`}
                  onClick={() => setActiveFormat('online')}
                >
                  <Video size={12} />
                  <span>Live Online</span>
                </button>
              </div>
            </div>

            {/* Sessions Grid */}
            {isLoading ? (
              <div className="yoga-schedule-loading">
                <p>Loading weekly timetable...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="yoga-schedule-empty">
                <Inbox size={32} className="text-accent-gold" />
                <h4>No Scheduled Sessions on {activeDay}</h4>
                <p>
                  No classes scheduled for {activeDay} in this format. Try selecting another day or contact our desk for private sessions.
                </p>
                <a
                  href={`https://wa.me/917356702775?text=${encodeURIComponent(
                    `Hello, I would like to enquire about yoga sessions available on ${activeDay}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yoga-empty-whatsapp-btn"
                >
                  <MessageCircle size={15} />
                  <span>Enquire for {activeDay} Sessions</span>
                </a>
              </div>
            ) : (
              <div className="yoga-classes-grid">
                {filteredSessions.map((session) => {
                  const sessionWhatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
                    `Hello Jeevayurniketan | Yogaathma, I would like to book a spot for the "${session.title}" on ${activeDay} (${session.time}).`
                  )}`;

                  return (
                    <article key={session.id} className="yoga-timetable-card">
                      <div className="yoga-timetable-card__header">
                        <div className="yoga-time-chip">
                          <Clock size={13} />
                          <span>{session.time}</span>
                        </div>
                        <span className={`yoga-format-chip yoga-format-chip--${session.format}`}>
                          {session.format === 'online' ? <Video size={11} /> : <MapPin size={11} />}
                          <span>{session.format === 'online' ? 'Live Online' : 'In Shala'}</span>
                        </span>
                      </div>

                      <h3 className="yoga-timetable-card__title">{session.title}</h3>

                      <p className="yoga-timetable-card__desc">{session.description}</p>

                      <div className="yoga-timetable-card__meta">
                        {session.instructor && (
                          <div className="yoga-meta-item">
                            <User size={13} />
                            <span>{session.instructor}</span>
                          </div>
                        )}
                        <div className="yoga-meta-item">
                          <Award size={13} />
                          <span>Level: {session.level}</span>
                        </div>
                      </div>

                      <div className="yoga-timetable-card__footer">
                        <span className="yoga-price-label">
                          {session.price || 'Included in Membership'}
                        </span>
                        <a
                          href={sessionWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="yoga-btn-book-class"
                        >
                          <MessageCircle size={14} />
                          <span>Reserve Spot</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================================
            5. ATMOSPHERE & SHALA PRACTICE GALLERY
            ================================================================== */}
        <section className="yoga-gallery-strip">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <span className="yoga-eyebrow">PRACTICE ATMOSPHERE</span>
              <h2 className="yoga-section-heading">In the Shala &amp; Live Practice</h2>
              <p className="yoga-section-desc">
                Tranquil natural surroundings, traditional teakwood flooring, and compassionate guidance to nurture your sadhana.
              </p>
            </div>

            <div className="yoga-atmosphere-grid">
              <div className="yoga-atmosphere-item">
                <img src="/yoga/yoga-1.jpg" alt="Therapeutic Asana Alignment at Yogaathma" loading="lazy" />
                <div className="atmosphere-caption">
                  <h4>Therapeutic Asana Alignment</h4>
                  <p>Gentle, individualized posture guidance in a tranquil healing setting.</p>
                </div>
              </div>

              <div className="yoga-atmosphere-item">
                <img src="/yoga/yoga-2.jpg" alt="Pranayama & Breath Awareness practice" loading="lazy" />
                <div className="atmosphere-caption">
                  <h4>Pranayama &amp; Breath Awareness</h4>
                  <p>Restorative respiratory techniques to calm autonomic nervous strain.</p>
                </div>
              </div>

              <div className="yoga-atmosphere-item">
                <img src="/yoga/yoga-3.jpg" alt="Restorative Mind-Body Recovery" loading="lazy" />
                <div className="atmosphere-caption">
                  <h4>Restorative Mind-Body Recovery</h4>
                  <p>Harmonizing movement, conscious breathing, and deep relaxation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. SANCTUARY BOOKING CARD BANNER
            ================================================================== */}
        <YogaBookingCard />
      </main>

      <Footer />
    </div>
  );
});

YogaSchedulePage.displayName = 'YogaSchedulePage';
