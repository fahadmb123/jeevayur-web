import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './Footer.css';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="footer" id="contact">
      <motion.div
        className="footer-container"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <motion.div className="footer-col footer-col--brand" variants={fadeUpVariants}>
          <BrandLogo linkTo={ROUTES.HOME} size="md" className="footer-brand-logo" />
          <p className="footer-desc">
            Providing authentic Ayurvedic healthcare, personalized consultations with Dr. Ahalya T.S., individualized dietary and lifestyle guidance, and classical healing protocols.
          </p>
          <div className="footer-sanctuary-badge">
            <span>Kottakkal, Kerala • Classical Ayurveda &amp; Psychotherapy</span>
          </div>
        </motion.div>
        
        <motion.div className="footer-col" variants={fadeUpVariants}>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to={ROUTES.HOME}>Home</Link></li>
            <li><Link to={ROUTES.ABOUT}>About Heritage</Link></li>
            <li><Link to={ROUTES.SERVICES}>Healthcare Services</Link></li>
            <li><Link to={ROUTES.TEAM}>Our Team</Link></li>
            <li><Link to={ROUTES.BLOG}>Blog</Link></li>
            <li><Link to={ROUTES.CONTACT}>Contact Us</Link></li>
          </ul>
        </motion.div>
        
        <motion.div className="footer-col" variants={fadeUpVariants}>
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon"><MapPin size={18} /></span>
              <p>Near Ayurveda College, Kottakkal, Malappuram, Pin: 676501, Kerala</p>
            </li>
            <li>
              <span className="contact-icon"><Phone size={18} /></span>
              <a href="tel:+917356702775">+91 73567 02775</a>
            </li>
            <li>
              <span className="contact-icon"><Mail size={18} /></span>
              <a href="mailto:info@jeevayurniketan.com">info@jeevayurniketan.com</a>
            </li>
          </ul>
        </motion.div>
      </motion.div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Jeevayurniketan Ayurveda. All Rights Reserved.</p>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917356702775?text=Hello,%20I%20am%20interested%20in%20an%20Ayurveda%20consultation%20with%20Dr.%20Ahalya%20T.S.%20Could%20you%20please%20share%20more%20details"
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
});

Footer.displayName = 'Footer';
