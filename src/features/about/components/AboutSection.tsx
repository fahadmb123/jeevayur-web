import React, { useEffect, useRef } from 'react';
import cupImg from '@/assets/cup.jpg';
import { Leaf, Brain, Sparkles, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyMotion, domAnimation, m, type Variants } from 'framer-motion';
import { ROUTES } from '@/shared/config/routes';
import './AboutSection.css';

interface AboutPillar {
  id: string;
  title: string;
  description: string;
}

const ABOUT_PILLARS: AboutPillar[] = [
  {
    id: 'heritage',
    title: 'Kottakkal Heritage & Classical Lineage',
    description:
      'Deeply rooted in the revered Ayurvedic heartland of Kottakkal, Kerala, our practice adheres faithfully to original Caraka and Ashtanga Hridaya texts. Every diagnostic evaluation and therapeutic protocol is uniquely customized to an individual’s constitutional Prakriti and current imbalances.',
  },
  {
    id: 'mission',
    title: 'Our Healing Mission',
    description:
      'To provide genuine, root-cause resolution free from synthetic dependency. Through physician-supervised Panchakarma detoxification, ethically harvested medicinal botanicals, and personalized dietetics (Pathya), we guide each seeker toward lasting physical and metabolic balance.',
  },
  {
    id: 'philosophy',
    title: 'Clinical Philosophy & Mind-Body Synergy',
    description:
      'Under the clinical guidance of Dr. Ahalya T.S., we pioneer the synergy of internal Ayurvedic medicine with Satvavajaya Chikitsa (Ayurvedic psychotherapy) and guided Smriti Meditation — resolving the deep subconscious emotional stress and trauma roots of chronic illness.',
  },
];

interface QuickPill {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}

const QUICK_PILLS: QuickPill[] = [
  {
    id: 'herbs',
    label: 'Herbal Purity',
    sub: 'Classical Dravya',
    icon: <Leaf size={20} />,
  },
  {
    id: 'mind',
    label: 'Mind Wellness',
    sub: 'Satvavajaya',
    icon: <Brain size={20} />,
  },
  {
    id: 'meditation',
    label: 'Smriti Process',
    sub: 'Guided Recall',
    icon: <Sparkles size={20} />,
  },
  {
    id: 'vaidya',
    label: 'Doctor Consult',
    sub: 'Prakriti Assessment',
    icon: <UserCheck size={20} />,
  },
  {
    id: 'heritage',
    label: 'Classical Legacy',
    sub: 'Samhita Protocols',
    icon: <ShieldCheck size={20} />,
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.14 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 65 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 } },
};

const railVariants: Variants = {
  hidden: { opacity: 0, y: 65 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, delayChildren: 0.1, staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] } },
};

const principleVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

export const AboutSection: React.FC = React.memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const cupRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '200px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!isVisible) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (cupRef.current) {
            cupRef.current.style.transform = `rotate(${window.scrollY * 0.85}deg)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        ref={sectionRef}
        id="about"
        className="ayurveda-pure-banner-section"
        aria-label="About Jeevayurniketan Heritage"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
        variants={sectionVariants}
      >
        <div className="pure-banner-outer-wrap">
          <m.div className="pure-banner-card" variants={cardVariants}>
          <div className="pure-banner-bowl-anchor">
            <img 
              ref={cupRef}
              src={cupImg} 
              alt="Top-down view of fresh Ayurvedic medicinal Tulsi and Brahmi herbs in a porcelain bowl" 
              className="pure-banner-bowl-img"
              loading="lazy"
              decoding="async"
            />
          </div>

          <m.div className="pure-banner-content-col" variants={contentVariants}>
            {/* About Us Header */}
            <m.div className="pure-banner-about-header" variants={principleVariants}>
              <span className="pure-banner-about-badge">
                <Sparkles size={12} />
                <span>ABOUT JEEVAYURNIKETAN</span>
              </span>
              <h2 className="pure-banner-about-title">
                Rooted in Kottakkal, Dedicated to Constitutional Healing
              </h2>
              <p className="pure-banner-about-lead">
                An authentic Ayurvedic healing sanctuary in Kerala combining classical Samhita medicine, Ayurvedic psychotherapy, and physician-guided holistic restoration.
              </p>
            </m.div>

            {/* About Us Story Pillars */}
            <m.div className="pure-banner-principles-list" variants={sectionVariants}>
              {ABOUT_PILLARS.map((item) => (
                <m.div key={item.id} className="pure-principle-block" variants={principleVariants}>
                  <h3 className="pure-principle-title">{item.title}</h3>
                  <p className="pure-principle-desc">{item.description}</p>
                </m.div>
              ))}
            </m.div>

            <m.div className="pure-banner-action-row" variants={principleVariants}>
              <Link to={ROUTES.ABOUT} className="pure-banner-cta-link">
                <span>Explore Our Full Story &amp; Clinical Heritage</span>
                <ArrowRight size={17} />
              </Link>
            </m.div>
          </m.div>

          <m.div className="pure-banner-rail-col" variants={railVariants}>
            <div className="pure-banner-rail">
              {QUICK_PILLS.map((pill) => (
                <m.div key={pill.id} className="pure-rail-item" title={pill.sub} variants={pillVariants}>
                  <div className="pure-rail-circle">
                    {pill.icon}
                  </div>
                  <span className="pure-rail-label">{pill.label}</span>
                </m.div>
              ))}
            </div>
          </m.div>

          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  );
});

AboutSection.displayName = 'AboutSection';
