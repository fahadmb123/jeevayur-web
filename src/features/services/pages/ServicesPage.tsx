import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Leaf } from 'lucide-react';
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

interface CategoryFilter {
  id: string;
  label: string;
  tags?: string[];
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All Treatments' },
  { id: 'metabolic', label: 'Metabolic & Digestion', tags: ['metabolic-health', 'digestive-health'] },
  { id: 'womens', label: "Women's Health", tags: ['womens-health'] },
  { id: 'joints', label: 'Joints & Spine', tags: ['musculoskeletal-care'] },
  { id: 'mind', label: 'Mental Well-being', tags: ['mental-wellbeing', 'neurological-health'] },
  { id: 'skin', label: 'Skin & Hair', tags: ['skin-hair-health'] },
  { id: 'preventive', label: 'Preventive Care', tags: ['preventive-healthcare', 'geriatric-health', 'respiratory-health'] },
];

export const ServicesPage: React.FC = React.memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { services, loading } = useTreatments(selectedCategory, searchQuery);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns(gridRef, 4);

  useEffect(() => {
    if (services.length > 0) {
      const exists = services.some((s) => s.id === selectedServiceId);
      if (!exists) {
        setSelectedServiceId(services[0].id);
      }
    } else {
      setSelectedServiceId(null);
    }
  }, [services, selectedServiceId]);

  const activeService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0] || null;
  }, [services, selectedServiceId]);

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
        <header className="treatments-hero">
          <div className="treatments-hero__inner">
            <motion.h1
              className="treatments-hero__title"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              Ayurvedic Treatments &amp; Therapies
            </motion.h1>

            <motion.p
              className="treatments-hero__subtitle"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
            >
              Consultations, classical herbal therapies, and personalized care guided by Dr. Ahalya T.S.
            </motion.p>

            <motion.div
              className="treatments-hero__actions"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.14 }}
            >
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
            </motion.div>
          </div>
        </header>

        <section className="treatments-filter-strip">
          <div className="treatments-container">
            <div className="treatments-filter-row">
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
                    </button>
                  );
                })}
              </div>

              <div className="treatments-search-box">
                <Search size={16} className="treatments-search-icon" />
                <input
                  type="text"
                  placeholder="Search treatments or conditions..."
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
                  <TreatmentCardSkeleton count={6} />
                </div>
                <div className="treatments-details-section">
                  <TreatmentDetailsCardSkeleton />
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="treatments-empty-state">
                <Leaf size={40} className="treatments-empty-icon" />
                <h3>No treatments found</h3>
                <p>No treatments matched &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.</p>
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
                    key={selectedCategory}
                    className="treatments-images-grid"
                    variants={rowContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {services.map((service, index) => {
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
                  <div className="treatments-details-section">
                    <div className="treatments-section-title-wrap">
                      <h2 className="treatments-section-title">Treatment Details</h2>
                      <p className="treatments-section-subtitle">
                        Detailed indications, clinical methodology, and consultation booking.
                      </p>
                    </div>

                    <TreatmentDetailsCard
                      service={activeService}
                      services={services}
                      onSelectService={handleSelectService}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

ServicesPage.displayName = 'ServicesPage';
