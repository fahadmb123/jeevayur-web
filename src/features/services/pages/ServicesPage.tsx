import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Clock,
  Search,
  Leaf,
  Info,
  X,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { Navbar, Footer } from '@/shared/layout';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { useTreatments } from '../hooks/useTreatments';
import type { AyurvedaService } from '../types';
import {
  staggerContainerVariants,
  fadeUpVariants,
} from '@/shared/lib/animations';
import './ServicesPage.css';

interface CategoryFilter {
  id: string;
  label: string;
  sanskrit: string;
  tags?: string[];
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All Treatments', sanskrit: 'Sarva Chikitsa' },
  { id: 'metabolic', label: 'Metabolic & Agni', sanskrit: 'Prameha & Agni', tags: ['metabolic-health', 'digestive-health'] },
  { id: 'womens', label: "Women's Health", sanskrit: 'Stree Roga', tags: ['womens-health'] },
  { id: 'joints', label: 'Joints & Spine', sanskrit: 'Sandhi Chikitsa', tags: ['musculoskeletal-care'] },
  { id: 'mind', label: 'Mental Wellbeing', sanskrit: 'Satvavajaya', tags: ['mental-wellbeing', 'neurological-health'] },
  { id: 'skin', label: 'Skin & Hair', sanskrit: 'Twak & Kesa', tags: ['skin-hair-health'] },
  { id: 'preventive', label: 'Preventive & Aging', sanskrit: 'Rasayana', tags: ['preventive-healthcare', 'geriatric-health', 'respiratory-health'] },
];

export const ServicesPage: React.FC = React.memo(() => {
  const { services, loading } = useTreatments();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailService, setActiveDetailService] = useState<AyurvedaService | null>(null);

  // Filter treatments by category and search query
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const activeFilter = CATEGORY_FILTERS.find((f) => f.id === selectedCategory);
        if (activeFilter?.tags) {
          matchesCategory = activeFilter.tags.includes(service.id);
        }
      }

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
            1. REFINED EDITORIAL HERO
            ================================================================== */}
        <header className="treatments-hero">
          <div className="treatments-hero__inner">
            <motion.div
              className="treatments-hero__lineage-pill"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <Leaf size={13} className="text-accent-gold" />
              <span>Classical Kottakkal Heritage &bull; Ashtanga Hridaya Tradition</span>
            </motion.div>

            <motion.h1
              className="treatments-hero__title"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
            >
              Ayurvedic Treatments &amp; <span className="treatments-hero__title-accent">Constitutional Healing</span>
            </motion.h1>

            <motion.p
              className="treatments-hero__subtitle"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.14 }}
            >
              Root-cause clinical healthcare under the guidance of Dr. Ahalya T.S. Every protocol integrates personalized Prakriti analysis, classical Samhita herbal formulations, and therapeutic rejuvenation.
            </motion.p>

            <motion.div
              className="treatments-hero__actions"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <BookAppointmentButton
                label="Book Clinical Consultation"
                size="lg"
                variant="primary"
              />
              <a
                href="https://wa.me/917356702775?text=Hello%20Dr.%20Ahalya%20/%20Jeevayurniketan,%20I%20would%20like%20to%20enquire%20about%20Ayurvedic%20treatments."
                target="_blank"
                rel="noopener noreferrer"
                className="treatments-hero__whatsapp-btn"
              >
                <MessageCircle size={17} />
                <span>Physician Desk on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </header>

        {/* ==================================================================
            2. BOTANICAL CATEGORY STRIP & SEARCH
            ================================================================== */}
        <section className="treatments-filter-strip">
          <div className="treatments-container">
            <div className="treatments-filter-row">
              {/* Category Segmented Tabs */}
              <div className="treatments-tabs" role="tablist">
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`treatments-tab-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="treatments-tab-label">{cat.label}</span>
                      <span className="treatments-tab-sanskrit">{cat.sanskrit}</span>
                    </button>
                  );
                })}
              </div>

              {/* Keyword Search */}
              <div className="treatments-search-box">
                <Search size={16} className="treatments-search-icon" />
                <input
                  type="text"
                  placeholder="Search by condition, dosha, or therapy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="treatments-search-input"
                  aria-label="Search treatments"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="treatments-search-clear"
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
            3. EDITORIAL TREATMENTS CATALOG
            ================================================================== */}
        <section className="treatments-catalog-section">
          <div className="treatments-container">
            {loading ? (
              <div className="treatments-loading">
                <div className="treatments-spinner" />
                <p>Curating authentic treatment protocols...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="treatments-empty-state">
                <Leaf size={40} className="treatments-empty-icon" />
                <h3>No treatments found</h3>
                <p>No Ayurvedic treatments matched &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.</p>
                <button
                  type="button"
                  className="treatments-reset-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  View All Treatments
                </button>
              </div>
            ) : (
              <motion.div
                className="treatments-grid"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredServices.map((service, index) => {
                  const whatsappUrl = `https://wa.me/917356702775?text=${encodeURIComponent(
                    `Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatment for: ${service.title}.`
                  )}`;

                  return (
                    <motion.article
                      key={service.id}
                      className="treatment-editorial-card"
                      variants={fadeUpVariants}
                      custom={index}
                      viewport={{ once: true, amount: 0.12 }}
                    >
                      {/* Media Image with Organic Crop */}
                      <div className="treatment-card-media">
                        <img
                          src={service.image}
                          alt={`${service.title} - Classical Ayurvedic treatment`}
                          className="treatment-card-img"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="treatment-card-media-overlay" />

                        {/* Top Classical Discipline Tag */}
                        {service.categoryTag && (
                          <div className="treatment-card-tag">
                            <span>{service.categoryTag}</span>
                          </div>
                        )}

                        {/* Duration Pill */}
                        <div className="treatment-card-duration">
                          <Clock size={12} />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="treatment-card-content">
                        <h2 className="treatment-card-title">
                          {service.title}
                        </h2>

                        <p className="treatment-card-desc">
                          {service.description}
                        </p>

                        {/* Botanical Key Focus Chips (clean tags instead of repetitive bullet points) */}
                        {service.benefits && service.benefits.length > 0 && (
                          <div className="treatment-card-chips">
                            {service.benefits.slice(0, 3).map((benefit, i) => (
                              <span key={i} className="treatment-chip">
                                <em>✦</em> {benefit}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="treatment-card-footer">
                          <BookAppointmentButton
                            label="Book Consultation"
                            size="md"
                            variant="primary"
                            className="treatment-btn-book"
                          />

                          <div className="treatment-footer-secondary">
                            <button
                              type="button"
                              className="treatment-btn-details"
                              onClick={() => setActiveDetailService(service)}
                            >
                              <span>Clinical Details</span>
                              <Info size={14} />
                            </button>

                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="treatment-btn-whatsapp-icon"
                              title="Enquire on WhatsApp"
                              aria-label={`Enquire about ${service.title} on WhatsApp`}
                            >
                              <MessageCircle size={16} />
                            </a>
                          </div>
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
            4. THE 3-STEP SAMHITA CARE PATHWAY
            ================================================================== */}
        <section className="treatments-journey-strip">
          <div className="treatments-container">
            <div className="journey-header text-center">
              <span className="journey-pretitle">OUR CLINICAL METHODOLOGY</span>
              <h2 className="journey-title">The Three Pillars of Ayurvedic Chikitsa</h2>
              <p className="journey-lead">
                Every consultation adheres strictly to the authentic diagnostic principles laid down in Charaka Samhita and Ashtanga Hridaya.
              </p>
            </div>

            <div className="journey-steps-grid">
              <div className="journey-step-card">
                <span className="journey-step-num">01</span>
                <div className="journey-step-icon">
                  <Stethoscope size={22} />
                </div>
                <h3>Prakriti &amp; Dosha Diagnostic</h3>
                <p>
                  Comprehensive pulse examination (Nadi Pariksha), constitution assessment (Prakriti vs. Vikriti), and identifying metabolic toxin accumulation (Ama).
                </p>
              </div>

              <div className="journey-step-card">
                <span className="journey-step-num">02</span>
                <div className="journey-step-icon">
                  <Leaf size={22} />
                </div>
                <h3>Classical Samhita Formulations</h3>
                <p>
                  Prescription of authentic medicinal oils (Thailams), decoctions (Kashayams), and arishtams sourced from the revered Kottakkal lineage.
                </p>
              </div>

              <div className="journey-step-card">
                <span className="journey-step-num">03</span>
                <div className="journey-step-icon">
                  <HeartPulse size={22} />
                </div>
                <h3>Guided Ahara &amp; Smriti Healing</h3>
                <p>
                  Integrating therapeutic dietary guidance (Ahara), lifestyle harmonization (Vihara), and guided Smriti meditation for root-cause psychosomatic wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            5. DIRECT CLINICAL CONCIERGE BANNER
            ================================================================== */}
        <section className="treatments-concierge-strip">
          <div className="treatments-container">
            <div className="treatments-concierge-card">
              <div className="concierge-content">
                <div className="concierge-badge">
                  <ShieldCheck size={14} />
                  <span>DIRECT PHYSICIAN DESK</span>
                </div>
                <h2>Unsure which treatment suits your condition?</h2>
                <p>
                  Discuss your symptoms, lab reports, or health history directly with Dr. Ahalya T.S. to receive an honest, personalized Ayurvedic treatment evaluation.
                </p>
              </div>
              <div className="concierge-actions">
                <BookAppointmentButton
                  label="Schedule Consultation"
                  size="lg"
                  variant="primary"
                />
                <a
                  href="https://wa.me/917356702775?text=Hello%20Dr.%20Ahalya,%20I%20would%20like%20guidance%20on%20which%20treatment%20is%20suitable%20for%20my%20health%20condition."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="concierge-whatsapp-btn"
                >
                  <MessageCircle size={18} />
                  <span>Direct WhatsApp Guidance</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. MODAL: DETAILED CLINICAL PROTOCOL
            ================================================================== */}
        <AnimatePresence>
          {activeDetailService && (
            <div
              className="treatment-modal-backdrop"
              onClick={() => setActiveDetailService(null)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                className="treatment-modal-card"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="treatment-modal-close"
                  onClick={() => setActiveDetailService(null)}
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>

                <div className="treatment-modal-media">
                  <img
                    src={activeDetailService.image}
                    alt={activeDetailService.title}
                  />
                  <div className="treatment-modal-tag">
                    {activeDetailService.categoryTag || 'Ayurvedic Chikitsa'}
                  </div>
                </div>

                <div className="treatment-modal-body">
                  <div className="treatment-modal-meta">
                    <span className="modal-duration">
                      <Clock size={13} /> {activeDetailService.duration}
                    </span>
                    <span className="modal-doctor">Guided by Dr. Ahalya T.S.</span>
                  </div>

                  <h2 className="treatment-modal-title">{activeDetailService.title}</h2>
                  <p className="treatment-modal-desc">{activeDetailService.description}</p>

                  <div className="treatment-modal-section">
                    <h4>Clinical Benefits &amp; Therapeutic Targets:</h4>
                    <ul className="treatment-modal-list">
                      {(activeDetailService.benefits || []).map((b, i) => (
                        <li key={i}>
                          <span className="modal-bullet">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="treatment-modal-actions">
                    <BookAppointmentButton
                      label="Book Clinical Consultation"
                      size="lg"
                      variant="primary"
                    />
                    <a
                      href={`https://wa.me/917356702775?text=${encodeURIComponent(
                        `Hello Dr. Ahalya, I am enquiring about clinical treatment details for ${activeDetailService.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="treatment-modal-whatsapp"
                    >
                      <MessageCircle size={16} />
                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
});

ServicesPage.displayName = 'ServicesPage';
