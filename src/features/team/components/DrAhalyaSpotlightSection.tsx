import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Compass, CheckCircle2, Activity, Brain, Leaf } from 'lucide-react';
import { DR_AHALYA_DATA } from '../data/drAhalyaData';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import './DrAhalyaSpotlightSection.css';

const DEVADARSAN_SPOTLIGHT_DATA = {
  name: 'Devadarsan T.S.',
  role: 'Yoga & Meditation Teacher',
  degreesBadge: 'PhD Scholar in Yoga • MSc Yoga, MA',
  qualificationLine1: 'PhD Scholar in Yoga',
  qualificationLine2: 'MSc Yoga, MA',
  image: 'https://res.cloudinary.com/liccrmic/image/upload/v1792913029/Devadersan_T.S.jpg',
  tagline: 'Harmonizing conscious breath, mindful movement, and restorative inner stillness.',
  shortIntroTitle: 'Classical Yogic Discipline Integrated with Ayurvedic Health',
  shortIntro:
    'Rooted in traditional Yogic scriptures and therapeutic alignment, structuring mindful movement and breath regulation that complement Ayurvedic constitutional care.',
  aboutBio: [
    'Devadarsan T.S. is a PhD Scholar in Yoga holding an MSc in Yoga and MA. He brings an authentic, scholarly foundation to classical yoga sadhana, Sukshma Vyayama (joint-freeing subtle movements), and Pranayama breath regulation, bridging traditional Yogic science with constitutional wellness.',
    'His teaching philosophy emphasizes body awareness, structural spinal integrity, and conscious relaxation. Sessions are systematically tailored to individual needs—helping practitioners release chronic musculoskeletal stiffness, relieve anxiety, and establish a steady, life-affirming daily practice (Dinacharya).',
  ],
  philosophyOfPractice:
    'Yoga is an inward discipline of awareness, alignment, and vital energy regulation. By synchronizing breath with gentle movement, the nervous system settles and natural biological balance is effortlessly restored.',
  vision:
    'To empower individuals with practical, self-sustaining yoga and meditation routines that nurture physical lightness, mental calm, and deep constitutional harmony for life.',
  disciplines: [
    {
      title: 'Sukshma Vyayama',
      desc: 'Gentle micro-movements targeting cervical, spinal, and peripheral joints to release accumulated stiffness and improve circulation.',
    },
    {
      title: 'Pranayama Breath Science',
      desc: 'Systematic vital breath regulation including Nadi Shodhana and cooling practices to balance bio-energies (Vata & Pitta).',
    },
    {
      title: 'Restorative Dhyana',
      desc: 'Guided meditation and mindfulness techniques designed to soothe nervous system fatigue, dissolve stress, and promote mental peace.',
    },
    {
      title: 'Tridosha Balancing Asanas',
      desc: 'Mindful postural sequences customized to respect individual bodily constitution and musculoskeletal comfort.',
    },
    {
      title: 'Dinacharya Integration',
      desc: 'Practical, accessible daily morning routines that reinforce digestive vitality (Agni), natural immunity, and restful sleep.',
    },
  ],
  yogicSteps: [
    {
      step: 1,
      category: 'Foundation',
      title: 'Deha Sthairyam (Body Steadiness)',
      focus: 'Structural Alignment & Joint Opening',
      description: 'Initial assessment of body flexibility and breath rhythm, followed by gentle Sukshma Vyayama to open joints and ease muscular tension.',
      principles: ['Posture Awareness', 'Joint Freedom', 'Gentle Warming'],
    },
    {
      step: 2,
      category: 'Vital Energy',
      title: 'Prana Samyama (Breath Regulation)',
      focus: 'Diaphragmatic Rhythm & Channel Cleansing',
      description: 'Gradual introduction to classical Pranayama techniques, calming the nervous system and harmonizing vital life-force flow.',
      principles: ['Nadi Shodhana', 'Rhythmic Breathing', 'Vata Pacification'],
    },
    {
      step: 3,
      category: 'Mindful Stillness',
      title: 'Chitta Shanti (Mental Calmitude)',
      focus: 'Sensory Inwardness & Guided Dhyana',
      description: 'Deep restorative meditation and breath awareness practices that quiet mental fluctuations and cultivate steady emotional resilience.',
      principles: ['Mindful Presence', 'Stress Dissolution', 'Inner Silence'],
    },
    {
      step: 4,
      category: 'Integration',
      title: 'Swastha Jeevan (Daily Integration)',
      focus: 'Sustainable Home Practice & Lifestyle Synergy',
      description: 'Personalized movement and meditation schedule harmonized with daily Ayurvedic routines for lasting vitality and balance.',
      principles: ['Dinacharya Routine', 'Seasonal Adaptability', 'Lifelong Wellbeing'],
    },
  ],
  education: [
    {
      degree: 'PhD Scholar in Yoga',
      institution: 'Doctoral Research in Yogic Science',
      badge: 'Advanced Academic Research',
    },
    {
      degree: 'MSc Yoga',
      institution: 'Master of Science in Yoga',
      badge: 'Postgraduate Yoga Science',
    },
    {
      degree: 'MA',
      institution: 'Master of Arts',
      badge: 'Postgraduate Degree',
    },
  ],
};

export const DrAhalyaSpotlightSection: React.FC = React.memo(() => {
  const [activePractitioner, setActivePractitioner] = useState<'dr-ahalya' | 'devadarsan'>('dr-ahalya');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'Diagnostic Foundation' | 'Therapeutic Prescription' | 'Integrative Wellness'>('all');

  const filteredSteps = selectedPhase === 'all'
    ? DR_AHALYA_DATA.treatmentSteps
    : DR_AHALYA_DATA.treatmentSteps.filter((s) => s.category === selectedPhase);

  return (
    <section id="practitioners-spotlight" className="ahalya-spotlight-section" aria-label="Practitioner Spotlight and Clinical Methodologies">
      <div className="ahalya-spotlight-container">
        
        {/* Top Header Badge & Switcher */}
        <div className="ahalya-spotlight-top text-center">
          <motion.div
            className="section-pill"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={14} />
            <span>Ayurveda • Yoga • Meditation • Holistic Wellness</span>
          </motion.div>

          <h2 className="spotlight-main-title">
            In-Depth <span className="text-primary-green">Practitioner Spotlight</span>
          </h2>

          <p className="spotlight-tagline" style={{ marginBottom: '24px' }}>
            Explore the clinical philosophy, credentials, and methodologies of our dedicated healthcare leaders.
          </p>

          {/* Interactive Practitioner Toggle */}
          <div className="practitioner-toggle-bar" role="tablist" aria-label="Select Practitioner Profile">
            <button
              type="button"
              role="tab"
              aria-selected={activePractitioner === 'dr-ahalya'}
              className={`practitioner-toggle-btn ${activePractitioner === 'dr-ahalya' ? 'active' : ''}`}
              onClick={() => setActivePractitioner('dr-ahalya')}
            >
              <Sparkles size={16} />
              <span>Dr. Ahalya T.S. (Ayurveda &amp; Wellness Consultant)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePractitioner === 'devadarsan'}
              className={`practitioner-toggle-btn ${activePractitioner === 'devadarsan' ? 'active' : ''}`}
              onClick={() => setActivePractitioner('devadarsan')}
            >
              <Compass size={16} />
              <span>Devadarsan T.S. (Yoga &amp; Meditation Teacher)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content based on Active Practitioner */}
        <AnimatePresence mode="wait">
          {activePractitioner === 'dr-ahalya' ? (
            <motion.div
              key="dr-ahalya"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}
            >
              {/* Doctor Hero Card with Bio & Visual */}
              <div className="ahalya-hero-card">
                <div className="ahalya-hero-media">
                  <div className="ahalya-portrait-frame">
                    <img
                      src={DR_AHALYA_DATA.image}
                      alt="Dr. Ahalya T.S. - Ayurveda & Wellness Consultant"
                      className="ahalya-portrait-img"
                      loading="lazy"
                    />
                    <div className="ahalya-frame-badge">
                      <CheckCircle2 size={16} />
                      <span>BAMS • YIC • CSAMT</span>
                    </div>
                  </div>
                </div>

                <div className="ahalya-hero-details">
                  <h3 className="ahalya-details-name">{DR_AHALYA_DATA.name}</h3>
                  <h4 className="ahalya-details-role">{DR_AHALYA_DATA.role}</h4>
                  
                  <div className="ahalya-intro-quote-card">
                    <p className="quote-intro-title">{DR_AHALYA_DATA.shortIntroTitle}</p>
                    <p className="quote-intro-body">{DR_AHALYA_DATA.shortIntro}</p>
                  </div>

                  <div className="ahalya-bio-paragraphs">
                    {DR_AHALYA_DATA.aboutBio.map((p, i) => (
                      <p key={i} className="ahalya-bio-p">{p}</p>
                    ))}
                  </div>

                  {/* Philosophy & Vision Callout Cards */}
                  <div className="ahalya-pillars-duo">
                    <div className="ahalya-pillar-item">
                      <div className="pillar-icon-box">
                        <Heart size={18} />
                      </div>
                      <div>
                        <h5>Philosophy of Care</h5>
                        <p>{DR_AHALYA_DATA.philosophyOfCare}</p>
                      </div>
                    </div>

                    <div className="ahalya-pillar-item">
                      <div className="pillar-icon-box">
                        <Compass size={18} />
                      </div>
                      <div>
                        <h5>My Vision</h5>
                        <p>{DR_AHALYA_DATA.vision}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Areas of Interest Strip */}
              <div className="ahalya-interests-section">
                <div className="interests-header text-center">
                  <h4 className="section-subtitle">Clinical Focus</h4>
                  <h3 className="section-title">Areas of Professional Interest</h3>
                </div>

                <div className="interests-grid">
                  {DR_AHALYA_DATA.areasOfInterest.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="interest-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      <div className="interest-card__icon">
                        {idx === 0 && <Activity size={22} />}
                        {idx === 1 && <Heart size={22} />}
                        {idx === 2 && <Brain size={22} />}
                        {idx === 3 && <Compass size={22} />}
                        {idx === 4 && <Leaf size={22} />}
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 10-Step Ayurvedic Treatment Approach Section */}
              <div className="treatment-approach-section">
                <div className="treatment-header text-center">
                  <div className="section-pill">
                    <Compass size={14} />
                    <span>Evidence-Informed Methodology</span>
                  </div>
                  <h3 className="section-title">My 10-Step Ayurvedic Treatment Approach</h3>
                  <p className="treatment-subtitle">
                    Every healing protocol is rooted in a structured clinical evaluation of your Prakriti, Vikriti, Agni,
                    and psychological harmony, guiding you into sustainable vitality.
                  </p>
                </div>

                {/* Phase Filter Controls */}
                <div className="phase-filter-bar">
                  <button
                    type="button"
                    className={`phase-btn ${selectedPhase === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedPhase('all')}
                  >
                    All 10 Steps
                  </button>
                  <button
                    type="button"
                    className={`phase-btn ${selectedPhase === 'Diagnostic Foundation' ? 'active' : ''}`}
                    onClick={() => setSelectedPhase('Diagnostic Foundation')}
                  >
                    Diagnostic Foundation
                  </button>
                  <button
                    type="button"
                    className={`phase-btn ${selectedPhase === 'Therapeutic Prescription' ? 'active' : ''}`}
                    onClick={() => setSelectedPhase('Therapeutic Prescription')}
                  >
                    Therapeutic Prescription
                  </button>
                  <button
                    type="button"
                    className={`phase-btn ${selectedPhase === 'Integrative Wellness' ? 'active' : ''}`}
                    onClick={() => setSelectedPhase('Integrative Wellness')}
                  >
                    Integrative Wellness
                  </button>
                </div>

                <div className="steps-matrix-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredSteps.map((step) => (
                      <motion.div
                        key={step.step}
                        layout
                        className="step-matrix-card"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="step-matrix-card__top">
                          <span className="step-matrix-number">{String(step.step).padStart(2, '0')}</span>
                          <span className="step-matrix-cat">{step.category}</span>
                        </div>

                        <h4 className="step-matrix-title">{step.title}</h4>
                        <span className="step-matrix-focus">{step.focus}</span>
                        <p className="step-matrix-desc">{step.description}</p>

                        <div className="step-matrix-principles">
                          {step.principles.map((pr, pIdx) => (
                            <span key={pIdx} className="step-principle-tag">
                              <CheckCircle2 size={12} />
                              {pr}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Education & Accreditations */}
              <div className="ahalya-education-section">
                <div className="education-header text-center">
                  <h4 className="section-subtitle">Academic Pedigree</h4>
                  <h3 className="section-title">Education & Additional Training</h3>
                </div>

                <div className="education-grid">
                  {DR_AHALYA_DATA.educationAndTraining.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="education-card"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                    >
                      <div className="education-badge-tag">{item.badge}</div>
                      <h4>{item.degree}</h4>
                      <p>{item.institution}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Consultation Callout Banner */}
              <div className="spotlight-cta-banner">
                <div className="spotlight-cta-text">
                  <h3>Ready to Experience Personalized Ayurvedic Healing?</h3>
                  <p>
                    Book your comprehensive consultation with Dr. Ahalya T.S. to discover your Prakriti
                    and receive a tailored treatment protocol.
                  </p>
                </div>
                <BookAppointmentButton size="lg" variant="primary" label="Consult with Dr. Ahalya T.S." />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="devadarsan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}
            >
              {/* Devadarsan Hero Card with Bio & Visual */}
              <div className="ahalya-hero-card">
                <div className="ahalya-hero-media">
                  <div className="ahalya-portrait-frame">
                    <img
                      src={DEVADARSAN_SPOTLIGHT_DATA.image}
                      alt="Devadarsan T.S. - Yoga & Meditation Teacher"
                      className="ahalya-portrait-img"
                      loading="lazy"
                    />
                    <div className="ahalya-frame-badge">
                      <CheckCircle2 size={16} />
                      <span>{DEVADARSAN_SPOTLIGHT_DATA.degreesBadge}</span>
                    </div>
                  </div>
                </div>

                <div className="ahalya-hero-details">
                  <h3 className="ahalya-details-name">{DEVADARSAN_SPOTLIGHT_DATA.name}</h3>
                  <h4 className="ahalya-details-role">{DEVADARSAN_SPOTLIGHT_DATA.role}</h4>
                  
                  <div className="ahalya-intro-quote-card">
                    <p className="quote-intro-title">{DEVADARSAN_SPOTLIGHT_DATA.shortIntroTitle}</p>
                    <p className="quote-intro-body">{DEVADARSAN_SPOTLIGHT_DATA.shortIntro}</p>
                  </div>

                  <div className="ahalya-bio-paragraphs">
                    {DEVADARSAN_SPOTLIGHT_DATA.aboutBio.map((p, i) => (
                      <p key={i} className="ahalya-bio-p">{p}</p>
                    ))}
                  </div>

                  {/* Philosophy & Vision Callout Cards */}
                  <div className="ahalya-pillars-duo">
                    <div className="ahalya-pillar-item">
                      <div className="pillar-icon-box">
                        <Compass size={18} />
                      </div>
                      <div>
                        <h5>Philosophy of Practice</h5>
                        <p>{DEVADARSAN_SPOTLIGHT_DATA.philosophyOfPractice}</p>
                      </div>
                    </div>

                    <div className="ahalya-pillar-item">
                      <div className="pillar-icon-box">
                        <Heart size={18} />
                      </div>
                      <div>
                        <h5>Yogic Vision</h5>
                        <p>{DEVADARSAN_SPOTLIGHT_DATA.vision}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Disciplines Strip */}
              <div className="ahalya-interests-section">
                <div className="interests-header text-center">
                  <h4 className="section-subtitle">Yogic Sadhana</h4>
                  <h3 className="section-title">Core Disciplines & Practices</h3>
                </div>

                <div className="interests-grid">
                  {DEVADARSAN_SPOTLIGHT_DATA.disciplines.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      className="interest-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      <div className="interest-card__icon">
                        {idx === 0 && <Activity size={22} />}
                        {idx === 1 && <Leaf size={22} />}
                        {idx === 2 && <Brain size={22} />}
                        {idx === 3 && <Compass size={22} />}
                        {idx === 4 && <Heart size={22} />}
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Structured 4-Phase Yogic Pathway */}
              <div className="treatment-approach-section">
                <div className="treatment-header text-center">
                  <div className="section-pill">
                    <Compass size={14} />
                    <span>Mindful Practice Progression</span>
                  </div>
                  <h3 className="section-title">The 4-Phase Yogic Pathway</h3>
                  <p className="treatment-subtitle">
                    A balanced progression transitioning from physical posture alignment to deep internal stillness,
                    designed to restore nervous system balance and joint lightness.
                  </p>
                </div>

                <div className="steps-matrix-grid">
                  {DEVADARSAN_SPOTLIGHT_DATA.yogicSteps.map((step) => (
                    <div key={step.step} className="step-matrix-card">
                      <div className="step-matrix-card__top">
                        <span className="step-matrix-number">{String(step.step).padStart(2, '0')}</span>
                        <span className="step-matrix-cat">{step.category}</span>
                      </div>

                      <h4 className="step-matrix-title">{step.title}</h4>
                      <span className="step-matrix-focus">{step.focus}</span>
                      <p className="step-matrix-desc">{step.description}</p>

                      <div className="step-matrix-principles">
                        {step.principles.map((pr, pIdx) => (
                          <span key={pIdx} className="step-principle-tag">
                            <CheckCircle2 size={12} />
                            {pr}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Accreditations */}
              <div className="ahalya-education-section">
                <div className="education-header text-center">
                  <h4 className="section-subtitle">Qualifications & Credentials</h4>
                  <h3 className="section-title">Education & Certification</h3>
                </div>

                <div className="education-grid">
                  {DEVADARSAN_SPOTLIGHT_DATA.education.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="education-card"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                    >
                      <div className="education-badge-tag">{item.badge}</div>
                      <h4>{item.degree}</h4>
                      <p>{item.institution}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Yoga Session Callout Banner */}
              <div className="spotlight-cta-banner">
                <div className="spotlight-cta-text">
                  <h3>Begin Your Classical Yoga &amp; Meditation Journey</h3>
                  <p>
                    Join Devadarsan T.S. for guided Sukshma Vyayama, restorative Pranayama, and mindful meditation sessions.
                  </p>
                </div>
                <BookAppointmentButton size="lg" variant="primary" label="Inquire with Devadarsan T.S." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
});

DrAhalyaSpotlightSection.displayName = 'DrAhalyaSpotlightSection';
