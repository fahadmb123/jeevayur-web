import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Leaf, Sparkles, Clock } from 'lucide-react';
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
        <header className="treatments-hero-section">
          <div className="treatments-container">
            <motion.div
              className="treatments-hero-content"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="hero-designer-badge">
                <Sparkles size={13} className="hero-badge-sparkle" />
                <span>Jeevayurniketan Sanctuary &bull; Authentic Chikitsa</span>
              </div>

              <h1 className="treatments-hero__title">
                Ayurvedic Treatments <span className="treatments-hero-title-accent">&amp; Therapies</span>
              </h1>

              <p className="treatments-hero__subtitle">
                Consultations, classical herbal therapies, and personalized healing guided by Dr. Ahalya T.S.
              </p>

              <div className="hero-designer-pills">
                <div className="hero-designer-pill">
                  <Leaf size={12} />
                  <span>Classical Herbal Formulations</span>
                </div>
                <div className="hero-designer-pill">
                  <Sparkles size={12} />
                  <span>Personalized Chikitsa</span>
                </div>
                <div className="hero-designer-pill">
                  <Clock size={12} />
                  <span>Dr. Ahalya T.S. Guided</span>
                </div>
              </div>

              <div className="hero-designer-actions">
                <BookAppointmentButton
                  label="Book Consultation"
                  size="md"
                  variant="primary"
                />
                <a
                  href={CLINIC_CONTACT.getWhatsappUrl('Hello Dr. Ahalya / Jeevayurniketan, I would like to enquire about Ayurvedic treatments.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-designer-btn-secondary"
                >
                  <MessageCircle size={16} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        </header>

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
