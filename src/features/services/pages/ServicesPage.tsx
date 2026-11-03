import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Leaf } from 'lucide-react';
import { Navbar, Footer } from '@/shared/layout';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { useTreatments } from '../hooks/useTreatments';
import type { AyurvedaService } from '../types';
import { TreatmentImageCard } from '../components/TreatmentImageCard';
import { TreatmentDetailsCard } from '../components/TreatmentDetailsCard';
import {
  staggerContainerVariants,
  fadeUpVariants,
} from '@/shared/lib/animations';
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
  const { services, loading } = useTreatments();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

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
                href="https://wa.me/917356702775?text=Hello%20Dr.%20Ahalya%20/%20Jeevayurniketan,%20I%20would%20like%20to%20enquire%20about%20Ayurvedic%20treatments."
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
              <div className="treatments-loading">
                <div className="treatments-spinner" />
                <p>Loading treatments...</p>
              </div>
            ) : filteredServices.length === 0 ? (
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
                    className="treatments-images-grid"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        variants={fadeUpVariants}
                        custom={index}
                        viewport={{ once: true, amount: 0.1 }}
                      >
                        <TreatmentImageCard
                          service={service}
                          isSelected={activeService?.id === service.id}
                          onSelect={() => handleSelectService(service)}
                        />
                      </motion.div>
                    ))}
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
                      services={filteredServices}
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
