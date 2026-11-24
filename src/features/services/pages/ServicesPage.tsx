import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Leaf, Search } from 'lucide-react';
import { Navbar, Footer } from '@/shared/layout';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { useTreatments } from '../hooks/useTreatments';
import type { AyurvedaService } from '../types';
import { TreatmentImageCard } from '../components/TreatmentImageCard';
import { TreatmentDetailsCard } from '../components/TreatmentDetailsCard';
import { TreatmentCardSkeleton, TreatmentDetailsCardSkeleton } from '../components/TreatmentCardSkeleton';
import {
  fadeUpVariants,
  rowContainerVariants,
  rowFadeUpVariants,
} from '@/shared/lib/animations';
import { useGridColumns } from '@/shared/lib/useGridColumns';
import './ServicesPage.css';

export const ServicesPage: React.FC = React.memo(() => {
  const { services, loading } = useTreatments();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns(gridRef, 4);

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.categoryTag && s.categoryTag.trim()) {
        set.add(s.categoryTag.trim());
      }
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (s.categoryTag && s.categoryTag.toLowerCase() === activeCategory.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query)) ||
        (s.categoryTag && s.categoryTag.toLowerCase().includes(query)) ||
        (s.benefits && s.benefits.some((b) => b.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  useEffect(() => {
    if (filteredServices.length > 0) {
      const exists = filteredServices.some((s) => s.id === selectedServiceId);
      if (!exists) {
        setSelectedServiceId(filteredServices[0].id);
      }
    } else {
      setSelectedServiceId(null);
    }
  }, [filteredServices, selectedServiceId]);

  const activeService = useMemo(() => {
    return filteredServices.find((s) => s.id === selectedServiceId) || filteredServices[0] || null;
  }, [filteredServices, selectedServiceId]);

  const handleSelectService = (service: AyurvedaService) => {
    setSelectedServiceId(service.id);
    const element = document.getElementById('treatment-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="services-page-shell">
      <Navbar />

      <main className="services-page">
        <header className="treatments-hero-section">
          <div className="treatments-container">
            <motion.div
              className="treatments-editorial-header"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="editorial-eyebrow">
                <span className="editorial-eyebrow-text">Ayurvedic Chikitsa</span>
                <span className="editorial-eyebrow-line" />
              </div>

              <div className="editorial-grid">
                <div className="editorial-left">
                  <h1 className="editorial-headline">
                    Ayurvedic Treatments <span className="editorial-italic">&amp; Therapies</span>
                  </h1>
                </div>

                <div className="editorial-right">
                  <p className="editorial-description">
                    Consultations, classical herbal therapies, and personalized healing guided by Dr. Ahalya T.S.
                  </p>
                  <div className="editorial-action">
                    <BookAppointmentButton
                      label="Book Consultation"
                      size="md"
                      variant="primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {services.length > 0 && (
          <div className="treatments-filter-strip">
            <div className="treatments-container">
              <div className="treatments-filter-row">
                <div className="treatments-tabs" role="tablist" aria-label="Treatment categories">
                  <button
                    type="button"
                    className={`treatments-tab-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    <span className="treatments-tab-label">All Treatments ({services.length})</span>
                  </button>
                  {categories.map((cat) => {
                    const count = services.filter((s) => s.categoryTag?.toLowerCase() === cat.toLowerCase()).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`treatments-tab-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'is-active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        <span className="treatments-tab-label">{cat} ({count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="treatments-search-box">
                  <Search size={16} className="treatments-search-icon" />
                  <input
                    type="text"
                    className="treatments-search-input"
                    placeholder="Search treatments or benefits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search treatments"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="treatments-search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="treatments-catalog-section">
          <div className="treatments-container">
            {loading ? (
              <div className="treatments-images-section" role="status" aria-label="Loading treatments">
                <div className="treatments-section-title-wrap">
                  <h2 className="treatments-section-title">Treatments &amp; Therapies</h2>
                  <p className="treatments-section-subtitle">
                    Select a treatment to view full clinical details below.
                  </p>
                </div>
                <div className="treatments-images-grid">
                  <TreatmentCardSkeleton />
                </div>
                <div className="treatments-details-section">
                  <TreatmentDetailsCardSkeleton />
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="treatments-empty-state">
                <Leaf size={40} className="treatments-empty-icon" />
                <h3>No treatments available</h3>
                <p>New treatments and clinical therapies will be updated shortly.</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="treatments-empty-state">
                <Leaf size={40} className="treatments-empty-icon" />
                <h3>No treatments match your search</h3>
                <p>Try searching with another keyword or resetting the category filter.</p>
                <button
                  type="button"
                  className="editorial-action-btn"
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  style={{ marginTop: '16px' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="treatments-images-section">
                  <div className="treatments-section-title-wrap">
                    <h2 className="treatments-section-title">Treatments &amp; Therapies</h2>
                    <p className="treatments-section-subtitle">
                      Select a treatment to view full clinical details below.
                    </p>
                  </div>

                  <motion.div
                    ref={gridRef}
                    className="treatments-images-grid"
                    variants={rowContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredServices.map((service, index) => {
                      const rowIndex = Math.floor(index / (cols || 1));
                      return (
                        <motion.div
                          key={service.id}
                          variants={rowFadeUpVariants}
                          custom={rowIndex}
                          viewport={{ once: true, amount: 0.1 }}
                        >
                          <TreatmentImageCard
                            service={service}
                            isSelected={activeService?.id === service.id}
                            onSelect={() => handleSelectService(service)}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {activeService && (
                  <div id="treatment-details" className="treatments-details-section">
                    <div className="treatments-section-title-wrap">
                      <h2 className="treatments-section-title">Treatment Details</h2>
                      <p className="treatments-section-subtitle">
                        Detailed indications, clinical methodology, and consultation booking.
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeService.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22 }}
                      >
                        <TreatmentDetailsCard
                          service={activeService}
                          services={filteredServices}
                          onSelectService={handleSelectService}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="treatments-bottom-cta">
          <div className="treatments-container">
            <div className="treatments-bottom-cta__inner">
              <BookAppointmentButton
                label="Book Consultation"
                size="lg"
                variant="primary"
              />
              <a
                href={CLINIC_CONTACT.getWhatsappUrl('Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatments.')}
                target="_blank"
                rel="noopener noreferrer"
                className="treatments-hero__whatsapp-btn"
              >
                <MessageCircle size={17} />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

ServicesPage.displayName = 'ServicesPage';
