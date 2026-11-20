import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import type { BlogPost } from '../../types';
import { fadeUpVariants } from '@/shared/lib/animations';
import './BlogPostCard.css';

export interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = React.memo(({ post }) => {
  return (
    <motion.article
      className="blog-card"
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.015 }}
    >
      <div className="blog-card__image-wrapper">
        <img src={post.image} alt={post.title} className="blog-card__image" />
      </div>
      <div className="blog-card__content">
        <div className="blog-card__meta">
          <span className="blog-card__author">{post.author}</span>
          <span className="blog-card__dot">•</span>
          <span className="blog-card__date">{post.date}</span>
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <Link to={ROUTES.BLOG} className="blog-card__btn">
          Read Article &rarr;
        </Link>
      </div>
    </motion.article>
  );
});

BlogPostCard.displayName = 'BlogPostCard';
