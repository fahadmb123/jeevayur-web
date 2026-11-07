import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, HeartPulse, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookAppointmentButton } from '@/shared/components/BookAppointmentButton';
import { ROUTES } from '@/shared/config/routes';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import consultationImg from '@/assets/ayurveda_consultation.jpg';
import { DR_AHALYA_DATA } from '../data/drAhalyaData';
import './DoctorIntroSection.css';

// SVG Morphing Coordinate Arrays (11 coordinate values matching the 5 frames)
// Format: [y0, x1, y1, x2, y2, y3, x4, y4, x5, y5, y6]
// M 0 y0 C x1 y1, x2 y2, 50 y3 C x4 y4, x5 y5, 100 y6 L 100 100 L 0 100 Z

// Frame 0 & 5: Completely collapsed at bottom (invisible, height = 0)
const COORDS_START = [100, 25, 100, 25, 100, 100, 75, 100, 75, 100, 100];

// Frame 1: Wave rising with curved crest from bottom-right corner
const COORDS_IN_1 = [96, 25, 96, 40, 88, 78, 68, 68, 85, 48, 38];

// Frame 2: Organic liquid wave surges upwards across ~80% of card
const COORDS_IN_2 = [42, 15, 55, 35, 36, 22, 72, 10, 88, 4, 1];

// Frame 3: Completely covers card in solid color (100% blank) with slight negative margin for full bleed
const COORDS_FULL = [-2, 25, -2, 25, -2, -2, 75, -2, 75, -2, -2];

// Frame 4: Wave drops downwards diagonally, revealing top/center of new image
const COORDS_OUT_1 = [28, 22, 42, 38, 58, 68, 76, 76, 90, 84, 90];

// Format coordinates to SVG path string
const formatPath = (c: number[]) =>
  `M 0 ${c[0].toFixed(2)} C ${c[1].toFixed(2)} ${c[2].toFixed(2)}, ${c[3].toFixed(2)} ${c[4].toFixed(2)}, 50 ${c[5].toFixed(2)} C ${c[6].toFixed(2)} ${c[7].toFixed(2)}, ${c[8].toFixed(2)} ${c[9].toFixed(2)}, 100 ${c[10].toFixed(2)} L 100 100 L 0 100 Z`;

// Smooth cubic ease-in-out
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const interpolateCoords = (from: number[], to: number[], t: number) =>
  from.map((val, i) => lerp(val, to[i], t));

// Frame-by-frame rAF path animator
const animateSvgPath = (
  pathEl: SVGPathElement,
  from: number[],
  to: number[],
  durationMs: number
): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(progress);
      const current = interpolateCoords(from, to, eased);
      pathEl.setAttribute('d', formatPath(current));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
};


export const DoctorIntroSection: React.FC = React.memo(() => {
  const cardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const primaryImgRef = useRef<HTMLImageElement>(null);
  const secondaryImgRef = useRef<HTMLImageElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // References for managing smooth queueing during rapid hover transitions
  const currentModeRef = useRef<'primary' | 'secondary'>('primary');
  const desiredModeRef = useRef<'primary' | 'secondary'>('primary');
  const isAnimatingRef = useRef(false);

  // Initialize SVG path once on mount
  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute('d', formatPath(COORDS_START));
      pathRef.current.style.opacity = '0';
    }
  }, []);

  // Parallax subtle glide inside the frame
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Liquid Wave Cycle: Wipe in (Frames 1-3) -> Swap Image -> Wipe out (Frames 4-5)
  const startWipeCycle = useCallback(async () => {
    if (isAnimatingRef.current) return;
    const pathEl = pathRef.current;
    const primaryImg = primaryImgRef.current;
    const secondaryImg = secondaryImgRef.current;
    if (!pathEl || !primaryImg || !secondaryImg) return;

    isAnimatingRef.current = true;

    while (currentModeRef.current !== desiredModeRef.current) {
      pathEl.style.opacity = '1';

      // Phase 1: Draw wave in from bottom-right (Frame 1 -> Frame 2 -> Frame 3 100% blank)
      await animateSvgPath(pathEl, COORDS_START, COORDS_IN_1, 110);
      await animateSvgPath(pathEl, COORDS_IN_1, COORDS_IN_2, 110);
      await animateSvgPath(pathEl, COORDS_IN_2, COORDS_FULL, 100);

      // Phase 2: Instant swap while fully covered in solid green
      const targetMode = desiredModeRef.current;
      if (targetMode === 'secondary') {
        secondaryImg.style.opacity = '1';
        primaryImg.style.opacity = '0';
      } else {
        primaryImg.style.opacity = '1';
        secondaryImg.style.opacity = '0';
      }
      currentModeRef.current = targetMode;

      // Brief hold at peak coverage (Frame 3 "solid blank")
      await new Promise((r) => setTimeout(r, 35));

      // Phase 3: Liquid wave wipes away downwards, revealing new image (Frame 4 -> Frame 5)
      await animateSvgPath(pathEl, COORDS_FULL, COORDS_OUT_1, 120);
      await animateSvgPath(pathEl, COORDS_OUT_1, COORDS_START, 120);

      pathEl.setAttribute('d', formatPath(COORDS_START));
      pathEl.style.opacity = '0';
    }

    isAnimatingRef.current = false;
  }, []);

  const handleMouseEnter = () => {
    desiredModeRef.current = 'secondary';
    startWipeCycle();
  };

  const handleMouseLeave = () => {
    desiredModeRef.current = 'primary';
    startWipeCycle();
  };

  const handleCardClick = () => {
    desiredModeRef.current = currentModeRef.current === 'primary' ? 'secondary' : 'primary';
    startWipeCycle();
  };

  return (
    <section id="practitioner" className="doctor-intro-section" aria-label={`${DR_AHALYA_DATA.name} introduction`}>
      <div className="doctor-intro-section__glow" />
      <div className="doctor-intro-section__container">
        {/* Outer media container animated with fade-up */}
        <motion.div
          className="doctor-intro-section__media"
          ref={cardRef}
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
        >
          <div className="doctor-intro-section__shadow-carrier">
            <motion.div
              className="doctor-intro-section__portrait-wrap"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label="Click or hover to reveal consultation preview"
              initial={{ clipPath: 'inset(25% 0% 0% 0% round 32px)', opacity: 0.9 }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 32px)', opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => setIsRevealed(true)}
              style={isRevealed ? { clipPath: 'none' } : undefined}
            >
              {/* Smooth animated image container with zero-rerender dual images */}
              <motion.div
                className="doctor-intro-section__portrait-motion"
                style={{ y: imageY }}
              >
                <img
                  ref={primaryImgRef}
                  src={"https://res.cloudinary.com/liccrmic/image/upload/v1792910336/athalya-cmprsd.jpg"}
                  alt={`${DR_AHALYA_DATA.name} — ${DR_AHALYA_DATA.role}`}
                  className="doctor-intro-section__portrait doctor-intro-section__portrait--primary"
                  loading="eager"
                  decoding="async"
                />
                <img
                  ref={secondaryImgRef}
                  src={consultationImg}
                  alt={`${DR_AHALYA_DATA.name} — Personalized Consultations`}
                  className="doctor-intro-section__portrait doctor-intro-section__portrait--secondary"
                  loading="eager"
                  decoding="async"
                  style={{ opacity: 0 }}
                />
              </motion.div>

              {/* Organic Liquid Wave Wipe Curtain Overlay */}
              <svg
                className="doctor-intro-section__liquid-wipe-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  id="doctor-liquid-path"
                  ref={pathRef}
                  fill="var(--primary-green, #1B6B50)"
                />
              </svg>

              <div className="doctor-intro-section__credential">
                <CheckCircle2 size={15} />
                <span>{DR_AHALYA_DATA.degrees}</span>
              </div>
            </motion.div>
          </div>
          <div className="doctor-intro-section__stamp" aria-hidden="true">
            <Leaf size={18} />
            <span>Personalized<br />Ayurvedic Care</span>
          </div>
        </motion.div>

        <motion.div
          className="doctor-intro-section__content"
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerContainerVariants}
        >
          <motion.div className="doctor-intro-section__eyebrow" variants={fadeUpVariants}>
            <Sparkles size={15} />
            <span>Meet your practitioner</span>
          </motion.div>
          <motion.h2 className="doctor-intro-section__title" variants={fadeUpVariants}>
            {DR_AHALYA_DATA.name}
          </motion.h2>
          <motion.p className="doctor-intro-section__role" variants={fadeUpVariants}>{DR_AHALYA_DATA.role}</motion.p>
          <motion.p className="doctor-intro-section__tagline" variants={fadeUpVariants} style={{ margin: '10px 0 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Care that sees the person, not just the symptoms.
          </motion.p>
          <motion.p className="doctor-intro-section__summary" variants={fadeUpVariants}>{DR_AHALYA_DATA.shortIntro}</motion.p>

          <motion.div className="doctor-intro-section__principles" variants={fadeUpVariants}>
            <div className="doctor-intro-section__principle">
              <HeartPulse size={18} />
              <span>Personalized consultations</span>
            </div>
            <div className="doctor-intro-section__principle">
              <Leaf size={18} />
              <span>Ayurveda, yoga & meditation</span>
            </div>
          </motion.div>

          <motion.div className="doctor-intro-section__actions" variants={fadeUpVariants}>
            <BookAppointmentButton size="md" variant="primary" label="Book a consultation" />
            <Link to={ROUTES.TEAM} className="doctor-intro-section__link">
              <span>Read full profile</span>
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

DoctorIntroSection.displayName = 'DoctorIntroSection';
