import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface LiquidWavePortraitProps {
  primarySrc: string;
  secondarySrc: string;
  alt: string;
  secondaryAlt?: string;
  credentials?: string;
  imageY?: MotionValue<number>;
  className?: string;
}

const COORDS_START = [100, 25, 100, 25, 100, 100, 75, 100, 75, 100, 100];
const COORDS_IN_1 = [96, 25, 96, 40, 88, 78, 68, 68, 85, 48, 38];
const COORDS_IN_2 = [42, 15, 55, 35, 36, 22, 72, 10, 88, 4, 1];
const COORDS_FULL = [-2, 25, -2, 25, -2, -2, 75, -2, 75, -2, -2];
const COORDS_OUT_1 = [28, 22, 42, 38, 58, 68, 76, 76, 90, 84, 90];

const formatPath = (c: number[]) =>
  `M 0 ${c[0].toFixed(2)} C ${c[1].toFixed(2)} ${c[2].toFixed(2)}, ${c[3].toFixed(2)} ${c[4].toFixed(2)}, 50 ${c[5].toFixed(2)} C ${c[6].toFixed(2)} ${c[7].toFixed(2)}, ${c[8].toFixed(2)} ${c[9].toFixed(2)}, 100 ${c[10].toFixed(2)} L 100 100 L 0 100 Z`;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const interpolateCoords = (from: number[], to: number[], t: number) =>
  from.map((val, i) => lerp(val, to[i], t));

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

export const LiquidWavePortrait: React.FC<LiquidWavePortraitProps> = React.memo(({
  primarySrc,
  secondarySrc,
  alt,
  secondaryAlt,
  credentials,
  imageY,
  className = '',
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const primaryImgRef = useRef<HTMLImageElement>(null);
  const secondaryImgRef = useRef<HTMLImageElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentModeRef = useRef<'primary' | 'secondary'>('primary');
  const desiredModeRef = useRef<'primary' | 'secondary'>('primary');
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute('d', formatPath(COORDS_START));
      pathRef.current.style.opacity = '0';
    }
  }, []);

  const startWipeCycle = useCallback(async () => {
    if (isAnimatingRef.current) return;
    const pathEl = pathRef.current;
    const primaryImg = primaryImgRef.current;
    const secondaryImg = secondaryImgRef.current;
    if (!pathEl || !primaryImg || !secondaryImg) return;

    isAnimatingRef.current = true;

    while (currentModeRef.current !== desiredModeRef.current) {
      pathEl.style.opacity = '1';

      await animateSvgPath(pathEl, COORDS_START, COORDS_IN_1, 110);
      await animateSvgPath(pathEl, COORDS_IN_1, COORDS_IN_2, 110);
      await animateSvgPath(pathEl, COORDS_IN_2, COORDS_FULL, 100);

      const targetMode = desiredModeRef.current;
      if (targetMode === 'secondary') {
        secondaryImg.style.opacity = '1';
        primaryImg.style.opacity = '0';
      } else {
        primaryImg.style.opacity = '1';
        secondaryImg.style.opacity = '0';
      }
      currentModeRef.current = targetMode;

      await new Promise((r) => setTimeout(r, 35));

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
    <motion.div
      className={`doctor-intro-section__portrait-wrap ${className}`.trim()}
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
      <motion.div
        className="doctor-intro-section__portrait-motion"
        style={imageY ? { y: imageY } : undefined}
      >
        <img
          ref={primaryImgRef}
          src={primarySrc}
          alt={alt}
          className="doctor-intro-section__portrait doctor-intro-section__portrait--primary"
          loading="eager"
          decoding="async"
        />
        <img
          ref={secondaryImgRef}
          src={secondarySrc}
          alt={secondaryAlt || alt}
          className="doctor-intro-section__portrait doctor-intro-section__portrait--secondary"
          loading="eager"
          decoding="async"
          style={{ opacity: 0 }}
        />
      </motion.div>

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

      {credentials && (
        <div className="doctor-intro-section__credential">
          <CheckCircle2 size={15} />
          <span>{credentials}</span>
        </div>
      )}
    </motion.div>
  );
});

LiquidWavePortrait.displayName = 'LiquidWavePortrait';
