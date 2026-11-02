import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './FAQSection.css';

const faqItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 65,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: (i % 3) * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'personalized-approach',
    question: 'How does Dr. Ahalya personalize an Ayurvedic consultation?',
    answer: 'Each consultation begins with understanding your unique constitutional baseline (Prakriti), assessing present Dosha imbalances (Vikriti), evaluating digestive and metabolic fire (Agni), tissue health (Dhatu), and waste elimination (Mala). Based on this holistic picture, a tailored care plan including diet, lifestyle modifications, and classical herbal formulations is formulated.',
    category: 'Consultations',
  },
  {
    id: 'online-consult',
    question: 'Do you offer online video consultations for patients outside Kerala or abroad?',
    answer: 'Yes. We provide comprehensive one-on-one video consultations for patients across India and internationally. Following your consultation, Dr. Ahalya prepares a personalized healthcare schedule, dietary and lifestyle recommendations, and coordinates delivery of authentic, classical Ayurvedic medicines directly to your address.',
    category: 'Consultations',
  },
  {
    id: 'medication-safety',
    question: 'Can Ayurvedic care be taken alongside my current conventional medications?',
    answer: 'Yes. Our clinical care emphasizes patient safety and collaborative healthcare. During your consultation, we review your current medical history and prescriptions carefully to ensure compatibility, non-interference, and ongoing safety. We advise maintaining open communication with your primary care physician, and referral for further medical evaluation is recommended whenever clinically indicated.',
    category: 'Safety & Medicine',
  },
  {
    id: 'conditions-addressed',
    question: 'What health conditions can be evaluated and supported through consultation?',
    answer: 'We provide consultations for metabolic health (Prameha, lipid imbalances), digestive disorders (IBS, acidity, bloating), musculoskeletal conditions (joint pain, spine stiffness), women’s health (hormonal harmony, menstrual rhythms), stress management, respiratory allergies, and general preventive healthcare (Swasthavritta).',
    category: 'Conditions',
  },
  {
    id: 'diet-yoga-role',
    question: 'What role do diet, lifestyle, and yoga play in the treatment process?',
    answer: 'Ayurveda views Ahara (wholesome nutrition) and Vihara (daily lifestyle and movement) as primary pillars of healing. Dr. Ahalya provides practical daily routines (Dinacharya), seasonal care (Ritucharya), and doctor-prescribed restorative Asanas, Pranayama, and meditation to address root causes and sustain lasting vitality.',
    category: 'Lifestyle & Yoga',
  },
];

export const FAQSection: React.FC = React.memo(() => {
  const [openId, setOpenId] = useState<string | null>('personalized-approach');

  const toggleFAQ = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <motion.div
          className="faq-header text-center"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <motion.div className="section-pill" variants={fadeUpVariants}>
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </motion.div>
          <motion.h2 className="faq-title" variants={fadeUpVariants}>
            Answers To Help You <span className="text-primary-green">Choose With Confidence</span>
          </motion.h2>
          <motion.p className="faq-subtitle" variants={fadeUpVariants}>
            Have questions about Ayurvedic consultations, personalized treatment, diet, or safety? Here are clear answers from our clinical care team.
          </motion.p>
        </motion.div>

        <div className="faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div 
                key={faq.id} 
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                variants={faqItemVariants}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon-wrap">
                    <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="faq-answer-text">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="faq-support-strip"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="faq-support-text">
            <h4>Have a specific medical query or condition?</h4>
            <p>Our Ayurvedic clinical team is available to assist you with initial consultation guidance.</p>
          </div>
          <a
            href="https://wa.me/917356702775?text=Hello,%20I%20am%20interested%20in%20an%20Ayurveda%20consultation%20with%20Dr.%20Ahalya%20T.S.%20Could%20you%20please%20share%20more%20details"
            target="_blank"
            rel="noopener noreferrer"
            className="faq-whatsapp-btn"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';