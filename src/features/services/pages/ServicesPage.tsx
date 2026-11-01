import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  MessageCircle,
  Clock,
  Search,
  ChevronDown,
  Leaf,
  ShieldCheck,
  HeartPulse,
  Calendar,
} from 'lucide-react';
import { Navbar, Footer } from '@/shared/layout';
import { BookAppointmentButton } from '@/features/appointments';
import { useTreatments } from '../hooks/useTreatments';
import {
  staggerContainerVariants,
  fadeUpVariants,
  standardViewport,
} from '@/shared/lib/animations';
import './ServicesPage.css';

interface CategoryFilter {
  id: string;
  label: string;
  tags?: string[];
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All Treatments' },
  { id: 'metabolic', label: 'Metabolic & Agni', tags: ['metabolic-health', 'digestive-health'] },
  { id: 'womens', label: "Women's Health", tags: ['womens-health'] },
  { id: 'joints', label: 'Joints & Spine', tags: ['musculoskeletal-care'] },
  { id: 'mind', label: 'Mental Wellbeing', tags: ['mental-wellbeing', 'neurological-health'] },
  { id: 'skin', label: 'Skin & Hair', tags: ['skin-hair-health'] },
  { id: 'preventive', label: 'Preventive & Aging', tags: ['preventive-healthcare', 'geriatric-health', 'respiratory-health'] },
];

export const ServicesPage: React.FC = React.memo(() => {
  const { services, faqs, loading } = useTreatments();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(0);

  // Filter treatments by category and search query
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const activeFilter = CATEGORY_FILTERS.find((f) => f.id === selectedCategory);
        if (activeFilter && activeFilter.tags) {
          matchesCategory = activeFilter.tags.includes(service.id);
        }
      }

      // Search match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = service.title.toLowerCase().includes(query);
        const inDesc = service.description.toLowerCase().includes(query);
        const inTag = (service.categoryTag || '').toLowerCase().includes(query);
        const inBenefits = (service.benefits || []).some((b) => b.toLowerCase().includes(query));
        matchesSearch = inTitle || inDesc || inTag || inBenefits;
      }

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="services-page-shell">
      <Navbar />

      <main className="services-page">
        {/* ==================================================================
            1. PAGE HERO
            ================================================================== */}
        <header className="services-page-hero">
          <div className="services-hero-container">
            <motion.div
              className="services-hero-badge"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <Sparkles size={14} className="badge-sparkle" />
              <span>AUTHENTIC AYURVEDIC CHIKITSA</span>
            </motion.div>

            <motion.h1
              className="services-hero-title"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              Classical Treatments &amp; <span className="text-primary-green">Therapeutic Care</span>
            </motion.h1>

            <motion.p
              className="services-hero-desc"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
            >
              Root-cause clinical healthcare adhering faithfully to classical Samhita wisdom, personalized Prakriti constitution analysis, and doctor-guided herbal restoration under Dr. Ahalya T.S.
            </motion.p>

            {/* Quick Action Button */}
            <motion.div
              className="services-hero-actions"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <BookAppointmentButton
                label="Schedule Clinical Consultation"
                size="lg"
                variant="primary"
              />
              <a
                href="https://wa.me/918590807138?text=Hello,%20I%20would%20like%20to%20enquire%20about%20Ayurvedic%20treatments%20at%20Jeevayurniketan."
                target="_blank"
                rel="noopener noreferrer"
                className="services-hero-whatsapp-btn"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </header>

        {/* ==================================================================
            2. FILTER & SEARCH CONTROL STRIP
            ================================================================== */}
        <section className="services-filter-section">
          <div className="services-container">
            <div className="services-control-bar">
              {/* Category Pills (Horizontally scrollable on mobile) */}
              <div className="services-category-tabs" role="tablist">
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`services-category-pill ${isActive ? 'is-active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span>{cat.label}</span>
                      {cat.id === 'all' && (
                        <span className="services-pill-count">{services.length}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="services-search-box">
                <Search size={16} className="services-search-icon" />
                <input
                  type="text"
                  placeholder="Search by condition, treatment, or symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="services-search-input"
                  aria-label="Search treatments"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="services-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. TREATMENTS CATALOG GRID (Images + Full Details)
            ================================================================== */}
        <section className="services-catalog-section">
          <div className="services-container">
            {loading ? (
              <div className="services-loading-state">
                <div className="services-loading-spinner" />
                <p>Loading classical treatment catalog...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="services-empty-state">
                <Leaf size={36} className="services-empty-icon" />
                <h3>No treatments found</h3>
                <p>No Ayurvedic treatments matched your search &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.</p>
                <button
                  type="button"
                  className="services-reset-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div
                className="services-detail-grid"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredServices.map((service, index) => {
                  const whatsappUrl = `https://wa.me/918590807138?text=${encodeURIComponent(
                    `Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatment for: ${service.title}.`
                  )}`;

                  return (
                    <motion.article
                      key={service.id}
                      className="treatment-detail-card"
                      variants={fadeUpVariants}
                      custom={index}
                      viewport={{ once: true, amount: 0.15 }}
                    >
                      {/* Image Header with Badge Overlays */}
                      <div className="treatment-detail-card__media">
                        <img
                          src={service.image}
                          alt={`${service.title} - Ayurvedic treatment at Jeevayurniketan`}
                          className="treatment-detail-card__img"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="treatment-detail-card__gradient-overlay" />

                        {/* Category Tag Badge */}
                        {service.categoryTag && (
                          <span className="treatment-detail-card__category-badge">
                            <Sparkles size={11} />
                            <span>{service.categoryTag}</span>
                          </span>
                        )}

                        {/* Duration Pill */}
                        <span className="treatment-detail-card__duration-badge">
                          <Clock size={12} />
                          <span>{service.duration}</span>
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="treatment-detail-card__body">
                        <h2 className="treatment-detail-card__title">
                          {service.title}
                        </h2>

                        <p className="treatment-detail-card__desc">
                          {service.description}
                        </p>

                        {/* Therapeutic Benefits Checklist */}
                        {service.benefits && service.benefits.length > 0 && (
                          <div className="treatment-detail-card__benefits-wrap">
                            <span className="treatment-detail-card__benefits-title">
                              Clinical Benefits &amp; Focus:
                            </span>
                            <ul className="treatment-detail-card__benefits-list">
                              {service.benefits.map((benefit, i) => (
                                <li key={i}>
                                  <Check size={14} className="treatment-detail-card__check-icon" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="treatment-detail-card__actions">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="treatment-detail-btn-whatsapp"
                          >
                            <MessageCircle size={17} />
                            <span>Enquire on WhatsApp</span>
                          </a>

                          <BookAppointmentButton
                            label="Book Consultation"
                            size="md"
                            variant="primary"
                            className="treatment-detail-btn-book"
                          />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* ==================================================================
            4. CLINICAL PILLARS STRIP
            ================================================================== */}
        <section className="services-pillars-strip">
          <div className="services-container">
            <div className="services-pillars-grid">
              <div className="services-pillar-item">
                <div className="services-pillar-icon">
                  <Leaf size={22} />
                </div>
                <h3>Classical Herbal Formulations</h3>
                <p>Authentic Kashayams, Arishtams, and medicated oils adhering strictly to ancient Samhita texts.</p>
              </div>

              <div className="services-pillar-item">
                <div className="services-pillar-icon">
                  <ShieldCheck size={22} />
                </div>
                <h3>Root-Cause Prakriti Assessment</h3>
                <p>Evaluating unique Dosha baselines, metabolic fire (Agni), and tissue imbalances for tailored healing.</p>
              </div>

              <div className="services-pillar-item">
                <div className="services-pillar-icon">
                  <HeartPulse size={22} />
                </div>
                <h3>Yoga &amp; Lifestyle Integration</h3>
                <p>Doctor-prescribed therapeutic movement, Dinacharya routines, and mindful recovery practices.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            5. FREQUENTLY ASKED QUESTIONS
            ================================================================== */}
        <section className="services-faq-section" id="faq">
          <div className="services-container services-container--narrow">
            <div className="text-center services-faq-header">
              <span className="services-section-tag">CLINICAL INQUIRIES</span>
              <h2 className="services-section-title">Frequently Asked Questions</h2>
              <p className="services-section-subtitle">
                Clear answers regarding our consultation process, medicine safety, and holistic treatment methodology.
              </p>
            </div>

            <div className="services-faq-list">
              {faqs.map((item, index) => {
                const isOpen = expandedFaqId === index;
                return (
                  <div
                    key={index}
                    className={`services-faq-card ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="services-faq-question-btn"
                      onClick={() => setExpandedFaqId(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="services-faq-q-text">{item.q}</span>
                      <span className="services-faq-chevron-wrap">
                        <ChevronDown
                          size={18}
                          className={`services-faq-chevron ${isOpen ? 'is-rotated' : ''}`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="services-faq-answer-wrap"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="services-faq-answer-text">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. BOTTOM CONSULTATION BANNER
            ================================================================== */}
        <section className="services-bottom-cta">
          <div className="services-container">
            <motion.div
              className="services-cta-card"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={standardViewport}
            >
              <div className="services-cta-content">
                <span className="services-cta-pill">
                  <Calendar size={13} />
                  <span>START YOUR RECOVERY</span>
                </span>
                <h2 className="services-cta-title">
                  Begin Your Personalized Ayurvedic Healing Journey
                </h2>
                <p className="services-cta-desc">
                  Schedule an in-depth video or in-clinic consultation with Dr. Ahalya T.S. to evaluate your constitution and receive a structured treatment protocol.
                </p>
              </div>

              <div className="services-cta-actions">
                <BookAppointmentButton
                  size="lg"
                  variant="primary"
                  label="Schedule Consultation Now"
                />
                <a
                  href="https://wa.me/918590807138?text=Hello,%20I%20would%20like%20to%20schedule%20an%20Ayurveda%20consultation%20with%20Dr.%20Ahalya%20T.S."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="services-cta-whatsapp-link"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

ServicesPage.displayName = 'ServicesPage';
