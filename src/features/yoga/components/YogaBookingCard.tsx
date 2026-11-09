import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, PhoneCall, Calendar } from 'lucide-react';
import { YOGAATHMA_DATA } from '../data/yogaathmaData';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';
import { ROUTES } from '@/shared/config/routes';
import { fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './YogaBookingCard.css';

export const YogaBookingCard: React.FC = React.memo(() => {
  const { booking, philosophy } = YOGAATHMA_DATA;

  return (
    <section className="yoga-journey-bottom-section" aria-label="Begin Your Yoga Journey">
      <div className="yoga-journey-bottom-container">
        {/* Direct Booking & Consultation Banner */}
        <motion.div
          className="yogaathma-booking-card"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="yogaathma-booking-card__content">
            <span className="yogaathma-booking-card__tag">
              {booking.tagline}
            </span>
            <h3 className="yogaathma-booking-card__title">
              {booking.heading}
            </h3>
            <p className="yogaathma-booking-card__desc">
              {booking.description}
            </p>
            <p className="yogaathma-booking-card__options">
              <strong>Session options:</strong> {booking.options}
            </p>
          </div>

          <div className="yogaathma-booking-card__actions">
            <a
              href={CLINIC_CONTACT.getWhatsappUrl('Hello Jeevayurniketan | Yogaathma, I would like to book a yoga session.')}
              target="_blank"
              rel="noopener noreferrer"
              className="yogaathma-booking-btn-whatsapp"
            >
              <MessageCircle size={18} />
              <span>WhatsApp: {CLINIC_CONTACT.phone}</span>
            </a>

            <a href={CLINIC_CONTACT.telUrl} className="yogaathma-booking-btn-call">
              <PhoneCall size={16} />
              <span>Call: {CLINIC_CONTACT.phone}</span>
            </a>

            <Link to={ROUTES.YOGA} className="yogaathma-booking-btn-schedule">
              <Calendar size={16} />
              <span>Full Schedule &amp; Timetable</span>
            </Link>
          </div>
        </motion.div>

        {/* Philosophy & Disclaimer Quote */}
        <div className="yogaathma-philosophy-quote text-center">
          <p className="yogaathma-mantra">
            &ldquo;{philosophy.mantra}&rdquo;
          </p>
          <p className="yogaathma-disclaimer">
            {philosophy.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
});

YogaBookingCard.displayName = 'YogaBookingCard';
