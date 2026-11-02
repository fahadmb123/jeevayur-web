import React from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/shared/layout';
import { AboutSection } from '../components/AboutSection';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { Card } from '@/shared/ui/card';
import { useAbout } from '../hooks/useAbout';
import './AboutPage.css';

export const AboutPage: React.FC = React.memo(() => {
  const { pillars } = useAbout();

  return (
    <div className="about-page">
      <Navbar />
      
      <header className="page-hero">
        <div className="page-hero__container">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-hero__badge"
          >
            Ancient Wisdom & Modern Mind
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero__title"
          >
            About Jeevayurniketan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero__desc"
          >
            Specialized center for Ayurvedic Psychotherapy, Smriti Meditation, and psychosomatic healthcare in Kottakkal, Kerala.
          </motion.p>
        </div>
      </header>

      <AboutSection />

      <section className="philosophy-section">
        <div className="philosophy-container">
          <div className="section-header text-center">
            <h4 className="section-subtitle">Our Foundation</h4>
            <h2 className="section-title">The Three Pillars of Healing</h2>
          </div>

          <div className="philosophy-grid">
            {pillars.map((pillar, idx) => (
              <Card key={idx} className="philosophy-card">
                <span className="philosophy-card__icon">{pillar.icon}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </Card>
            ))}
          </div>

          <div className="about-cta text-center">
            <h3>Ready to begin your healing journey?</h3>
            <p>Consult with our experienced Ayurvedic physicians and mental health counselors.</p>
            <BookAppointmentButton size="lg" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

AboutPage.displayName = 'AboutPage';

