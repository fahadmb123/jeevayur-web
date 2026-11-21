import React from 'react';
import catCircle1 from '@/assets/cat_circle_1.png';
import catCircle2 from '@/assets/cat_circle_2.png';
import catCircle3 from '@/assets/cat_circle_3.png';
import catCircle4 from '@/assets/cat_circle_4.png';
import catCircle5 from '@/assets/cat_circle_5.png';
import catCircle6 from '@/assets/cat_circle_6.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/shared/config/routes';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import { useInitialLoading } from '@/shared/ui/LoadingScreen';
import './CategoryCirclesRail.css';

interface CategoryItem {
  id: string;
  img: string;
  alt: string;
  link: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'haridra', img: catCircle1, alt: 'Classical Haridra and raw botanical preparations', link: ROUTES.SERVICES },
  { id: 'kashaya', img: catCircle2, alt: 'Therapeutic herbal infusions and digestive kwathas', link: ROUTES.SERVICES },
  { id: 'taila', img: catCircle3, alt: 'Medicated classical thailams and external oils', link: ROUTES.SERVICES },
  { id: 'lepa', img: catCircle4, alt: 'Natural therapeutic lepas and cleansing botanicals', link: ROUTES.SERVICES },
  { id: 'amalaki', img: catCircle5, alt: 'Fresh Amalaki rasayana and restorative herbs', link: ROUTES.SERVICES },
  { id: 'ashwagandha', img: catCircle6, alt: 'Ashwagandha roots and authentic medicinal dravya', link: ROUTES.SERVICES },
];

export const CategoryCirclesRail: React.FC = React.memo(() => {
  const { isInitialLoading } = useInitialLoading();

  return (
    <section className="exact-circles-section" aria-label="Ayurvedic Healthcare Focus Areas">
      <div className="exact-circles-container">
        <motion.div
          className="exact-circles-row"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={!isInitialLoading ? 'visible' : 'hidden'}
          viewport={standardViewport}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={fadeUpVariants}>
              <Link to={cat.link} className="exact-circle-item" title={cat.alt}>
                <img
                  src={cat.img}
                  alt={cat.alt}
                  className="exact-circle-img"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

CategoryCirclesRail.displayName = 'CategoryCirclesRail';
