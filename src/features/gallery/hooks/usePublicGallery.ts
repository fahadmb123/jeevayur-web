import { useState, useEffect } from 'react';
import type { GalleryItem, GalleryCategory } from '../types';
import { galleryService } from '../services/galleryService';

export const usePublicGallery = (category?: GalleryCategory) => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    const cached = galleryService.getCachedItems();
    return category ? cached.filter((i) => i.category === category) : cached;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await galleryService.getItems(category);
        if (mounted) {
          setItems(res.items);
        }
      } catch {
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    const unsubscribe = galleryService.subscribe(load);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [category]);

  return { items, isLoading };
};
