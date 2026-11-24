import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Award,
  MessageCircle,
  Inbox,
  User,
  Leaf,
} from 'lucide-react';
import { useYogaSchedule } from '../hooks/useYogaSchedule';
import { YogaProgramImageCard } from '../components/YogaProgramImageCard';
import { YogaProgramDetailsCard } from '../components/YogaProgramDetailsCard';
import { YogaBookingCard } from '../components/YogaBookingCard';
import { YogaTimetableCardSkeleton } from '../components/YogaScheduleSkeleton';
import { YOGAATHMA_DATA } from '../data/yogaathmaData';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { galleryService } from '@/features/gallery/services/galleryService';
import type { YogaProgram } from '../data/yogaathmaData';
import { Navbar, Footer } from '@/shared/layout';
import type { DayOfWeek, YogaFormat } from '../types/yoga.types';
import {
  fadeUpVariants,
  rowContainerVariants,
  rowFadeUpVariants,
} from '@/shared/lib/animations';
import { useGridColumns } from '@/shared/lib/useGridColumns';
import './YogaSchedulePage.css';

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
  const [programs, setPrograms] = useState<YogaProgram[]>(YOGAATHMA_DATA.programs);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    YOGAATHMA_DATA.programs[0]?.id || ''
  );
  const yogaGridRef = useRef<HTMLDivElement>(null);
  const yogaCols = useGridColumns(yogaGridRef, 4);

  const { hero } = YOGAATHMA_DATA;

  useEffect(() => {
    let mounted = true;
    const loadPrograms = async () => {
      try {
        const galleryResult = await galleryService.getItems('yoga');
        if (mounted && galleryResult.items.length > 0) {
          const mapped: YogaProgram[] = galleryResult.items.map((item, index) => ({
            id: item.id,
            number: String(index + 1).padStart(2, '0'),
            title: item.title,
            tagline: '',
            categoryTag: '',
            accentColor: '#1B6B50',
            description: item.description?.trim() || '',
            image: item.imageUrl,
            idealForTitle: '',
            idealFor: [],
            focus: '',
            format: '',
            duration: '',
          }));
          setPrograms(mapped);
          setSelectedProgramId((prev) => {
            return mapped.some((p) => p.id === prev) ? prev : (mapped[0]?.id || '');
          });
          return;
        }
      } catch {
      }
      if (mounted) {
        setPrograms(YOGAATHMA_DATA.programs);
        setSelectedProgramId((prev) => {
          return YOGAATHMA_DATA.programs.some((p) => p.id === prev) ? prev : (YOGAATHMA_DATA.programs[0]?.id || '');
        });
      }
    };

    loadPrograms();
    const unsubscribe = galleryService.subscribe(loadPrograms);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const whatsappHeroUrl = CLINIC_CONTACT.getWhatsappUrl(hero.whatsappMessage);

  const activeProgram = useMemo(() => {
    return programs.find((p) => p.id === selectedProgramId) || programs[0] || null;
  }, [programs, selectedProgramId]);

  const handleSelectProgram = (program: YogaProgram) => {
    setSelectedProgramId(program.id);
    const element = document.getElementById('yoga-program-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        <header className="yoga-hero-section">
          <div className="yoga-container">
            <div className="yoga-hero-content">
              <motion.h1
                className="yoga-hero-title"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                Yoga for Mind, Body <span className="yoga-hero-title-accent">&amp; Spirit</span>
              </motion.h1>

              <motion.p
                className="yoga-hero-subtitle"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.08 }}
              >
                Personalized yoga practices, therapeutic movement, and breath awareness guided by experienced Yogacharyas.
              </motion.p>
            </div>
          </div>
        </header>

        <section id="yoga-programs" className="yoga-programs-section">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <h2 className="yoga-section-heading">Our Yoga Programs</h2>
              <p className="yoga-section-desc">
                Select a program to view full details and practice structure below.
              </p>
            </div>

            {programs.length === 0 ? (
              <div className="yoga-empty-state-large">
                <Leaf size={48} className="yoga-empty-icon-large" />
                <h3 className="yoga-empty-title-large">No Yoga Programs Available</h3>
                <p className="yoga-empty-desc-large">
                  There are currently no yoga programs available.
                </p>
              </div>
            ) : (
              <>
                <motion.div
                  ref={yogaGridRef}
                  className="yoga-images-grid"
                  variants={rowContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {programs.map((program, index) => {
                    const rowIndex = Math.floor(index / (yogaCols || 1));
                    return (
                      <motion.div
                        key={program.id}
                        variants={rowFadeUpVariants}
                        custom={rowIndex}
                        viewport={{ once: true, amount: 0.1 }}
                      >
                        <YogaProgramImageCard
                          program={program}
                          isSelected={activeProgram?.id === program.id}
                          onSelect={() => handleSelectProgram(program)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>

                {activeProgram && (
                  <div className="yoga-program-details-wrap">
                    <div className="yoga-section-header text-center">
                      <h2 className="yoga-section-heading">Program Details</h2>
                      <p className="yoga-section-desc">
                        Full curriculum, therapeutic focus, and reservation options.
                      </p>
                    </div>

                    <YogaProgramDetailsCard
                      program={activeProgram}
                      programs={programs}
                      onSelectProgram={handleSelectProgram}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="yoga-bottom-cta">
          <div className="yoga-container">
            <div className="yoga-bottom-cta__inner">
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
            </div>
          </div>
        </section>

        <section id="yoga-schedule" className="yoga-schedule-section">
          <div className="yoga-container">
            <div className="yoga-section-header text-center">
              <h2 className="yoga-section-heading">Weekly Class Timetable</h2>
              <p className="yoga-section-desc">
                Filter by day and preferred format to find the session that fits your rhythm.
              </p>
            </div>

            <div className="yoga-filter-bar">
              <div className="yoga-days-nav" role="tablist" aria-label="Days of week">
                {DAYS_OF_WEEK.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeDay === key}
                    className={`yoga-day-btn ${activeDay === key ? 'is-active' : ''}`}
                    onClick={() => setActiveDay(key)}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="yoga-format-toggle" role="group" aria-label="Session format">
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

            {isLoading ? (
              <div className="yoga-classes-grid" role="status" aria-label="Loading timetable">
                <YogaTimetableCardSkeleton />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="yoga-schedule-empty">
                <Inbox size={32} className="text-accent-gold" />
                <h4>No Scheduled Sessions on {activeDay}</h4>
                <p>
                  No classes scheduled for {activeDay} in this format. Try selecting another day or contact our desk for private sessions.
                </p>
                <a
                  href={CLINIC_CONTACT.getWhatsappUrl(`Hello, I would like to enquire about yoga sessions available on ${activeDay}.`)}
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
                  const sessionWhatsappUrl = CLINIC_CONTACT.getWhatsappUrl(
                    `Hello Jeevayurniketan | Yogaathma, I would like to book a spot for "${session.title}" on ${activeDay} (${session.time}).`
                  );

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

        <YogaBookingCard />
      </main>

      <Footer />
    </div>
  );
});

YogaSchedulePage.displayName = 'YogaSchedulePage';
