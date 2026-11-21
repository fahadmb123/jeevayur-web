import React, { useEffect } from 'react';
import { X, Sparkles, Activity, Calendar, Trash2 } from 'lucide-react';
import type { GalleryItem } from '../../types';
import './GalleryLightboxModal.css';

interface GalleryLightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onDelete?: (id: string, title?: string) => void;
  canManage?: boolean;
}

export const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  item,
  onClose,
  onDelete,
  canManage = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="gallery-lightbox__overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="gallery-lightbox__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="gallery-lightbox__close-btn"
          onClick={onClose}
          aria-label="Close image preview"
        >
          <X size={22} />
        </button>

        <div className="gallery-lightbox__image-wrap">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="gallery-lightbox__img"
          />
        </div>

        <div className="gallery-lightbox__details">
          <div className="gallery-lightbox__meta-row">
            <span
              className={`gallery-lightbox__badge gallery-lightbox__badge--${item.category}`}
            >
              {item.category === 'yoga' ? (
                <>
                  <Sparkles size={14} />
                  <span>Yoga Showcase</span>
                </>
              ) : (
                <>
                  <Activity size={14} />
                  <span>Clinical Treatment</span>
                </>
              )}
            </span>

            <div className="gallery-lightbox__date">
              <Calendar size={14} />
              <span>{item.createdAt}</span>
            </div>
          </div>

          <h3 className="gallery-lightbox__title">{item.title}</h3>

          {item.description && (
            <p className="gallery-lightbox__description">{item.description}</p>
          )}

          {canManage && onDelete && (
            <div className="gallery-lightbox__actions">
              <button
                type="button"
                className="gallery-lightbox__delete-btn"
                onClick={() => onDelete(item.id, item.title)}
              >
                <Trash2 size={16} />
                <span>Remove Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
