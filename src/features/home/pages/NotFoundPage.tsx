import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Leaf,
  Calendar,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { Navbar, Footer } from '@/shared/layout';
import { fadeUpVariants, staggerContainerVariants } from '@/shared/lib/animations';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = React.memo(() => {
  const whatsappUrl = CLINIC_CONTACT.getWhatsappUrl(
    'Hello Jeevayurniketan, I am looking for assistance finding a page on the website.'
  );

  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-content">
        <motion.div
          className="not-found-card"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="not-found-badge-wrap" variants={fadeUpVariants}>
            <span className="not-found-badge">
              <Sparkles size={13} className="not-found-badge-icon" />
              <span>AYURVEDIC SANCTUARY • 404</span>
            </span>
          </motion.div>

          <motion.div className="not-found-code-wrap" variants={fadeUpVariants}>
            <span className="not-found-code">404</span>
          </motion.div>

          <motion.h1 className="not-found-title" variants={fadeUpVariants}>
            Path Not Found
          </motion.h1>

          <motion.p className="not-found-desc" variants={fadeUpVariants}>
            The pathway you were seeking does not exist or may have been relocated.
            Allow us to guide you back to our classical Ayurvedic therapies, yoga disciplines, or direct clinic consultation.
          </motion.p>

          <motion.div className="not-found-actions" variants={fadeUpVariants}>
            <Link to={ROUTES.HOME} className="not-found-btn not-found-btn--primary">
              <Home size={17} />
              <span>Return to Sanctuary</span>
            </Link>

            <Link to={ROUTES.SERVICES} className="not-found-btn not-found-btn--secondary">
              <Leaf size={16} />
              <span>Explore Treatments</span>
              <ArrowRight size={14} />
            </Link>

            <Link to={ROUTES.YOGA} className="not-found-btn not-found-btn--secondary">
              <Calendar size={16} />
              <span>Yoga Timetable</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div className="not-found-help-banner" variants={fadeUpVariants}>
            <div className="not-found-help-text">
              <span className="not-found-help-lead">Need personal assistance?</span>
              <span className="not-found-help-sub">Our clinical desk is available to guide you directly.</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="not-found-whatsapp-btn"
            >
              <MessageCircle size={15} />
              <span>Enquire on WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
});

NotFoundPage.displayName = 'NotFoundPage';
