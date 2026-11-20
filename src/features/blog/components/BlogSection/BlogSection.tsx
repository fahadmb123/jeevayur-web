import React from 'react';
import { motion } from 'framer-motion';
import { BlogPostCard } from '../BlogPostCard';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { staggerContainerVariants, fadeUpVariants, standardViewport } from '@/shared/lib/animations';
import './BlogSection.css';

export const BlogSection: React.FC = React.memo(() => {
  const { posts } = useBlogPosts();

  return (
    <section id="blog" className="blog-section">
      <motion.div
        className="blog-header text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        <motion.h4 className="section-subtitle" variants={fadeUpVariants}>Our Blog</motion.h4>
        <motion.h2 className="section-title" variants={fadeUpVariants}>Insights & Articles</motion.h2>
        <motion.p className="blog-subtitle" variants={fadeUpVariants}>
          Explore classical Ayurvedic principles, holistic well-being, and lifestyle wisdom from our clinical physicians.
        </motion.p>
      </motion.div>

      <motion.div
        className="blog-grid"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={standardViewport}
      >
        {posts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </motion.div>
    </section>
  );
});

BlogSection.displayName = 'BlogSection';

