import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  Leaf,
  Calendar,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { Navbar } from '@/shared/layout';
import { fadeUpVariants, staggerContainerVariants } from '@/shared/lib/animations';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = React.memo(() => {
  const navigate = useNavigate();

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
          <motion.span className="not-found-badge" variants={fadeUpVariants}>
            Error 404
          </motion.span>

          <motion.div className="not-found-code" variants={fadeUpVariants}>
            404
          </motion.div>

          <motion.h1 className="not-found-title" variants={fadeUpVariants}>
            Page Not Found
          </motion.h1>

          <motion.p className="not-found-desc" variants={fadeUpVariants}>
            The page you are looking for doesn&apos;t exist or may have been moved.
            Return to the sanctuary or jump straight to a section below.
          </motion.p>

          <motion.div className="not-found-actions" variants={fadeUpVariants}>
            <Link to={ROUTES.HOME} className="not-found-btn not-found-btn--primary">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="not-found-btn not-found-btn--ghost"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </motion.div>

          <motion.div className="not-found-links-grid" variants={fadeUpVariants}>
            <Link to={ROUTES.SERVICES} className="not-found-quick-link">
              <span className="not-found-quick-link__icon">
                <Leaf size={16} />
              </span>
              <span className="not-found-quick-link__label">Treatments</span>
              <ChevronRight size={14} className="not-found-quick-link__arrow" />
            </Link>

            <Link to={ROUTES.YOGA} className="not-found-quick-link">
              <span className="not-found-quick-link__icon">
                <Calendar size={16} />
              </span>
              <span className="not-found-quick-link__label">Yoga Schedule</span>
              <ChevronRight size={14} className="not-found-quick-link__arrow" />
            </Link>

            <Link to={ROUTES.CONTACT} className="not-found-quick-link">
              <span className="not-found-quick-link__icon">
                <PhoneCall size={16} />
              </span>
              <span className="not-found-quick-link__label">Contact Desk</span>
              <ChevronRight size={14} className="not-found-quick-link__arrow" />
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
});

NotFoundPage.displayName = 'NotFoundPage';
