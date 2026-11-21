import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GalleryItem, GalleryCategory, GalleryFormData } from '../types';
import { galleryService } from '../services/galleryService';

export type GalleryFilterTab = 'all' | GalleryCategory;

export const useGallery = (initialCategory: GalleryFilterTab = 'all') => {
  const [items, setItems] = useState<GalleryItem[]>(() => galleryService.getCachedItems());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryFilterTab>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      const data = await galleryService.getItems();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
    const unsubscribe = galleryService.subscribe(() => {
      setItems(galleryService.getCachedItems());
    });
    return unsubscribe;
  }, [loadGallery]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const yogaCount = useMemo(
    () => items.filter((item) => item.category === 'yoga').length,
    [items]
  );

  const treatmentCount = useMemo(
    () => items.filter((item) => item.category === 'treatment').length,
    [items]
  );

  const totalCount = items.length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : item.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleAddItem = useCallback(async (data: GalleryFormData) => {
    const newItem = await galleryService.addItem(data);
    await loadGallery();
    setFeedbackMessage(`Image "${newItem.title}" added to ${newItem.category === 'yoga' ? 'Yoga' : 'Treatment'} showcase.`);
    setIsModalOpen(false);
  }, [loadGallery]);

  const handleDeleteItem = useCallback(async (id: string, title?: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${title || 'this image'}" from the gallery?`
    );
    if (!confirmed) return;

    const success = await galleryService.deleteItem(id);
    if (success) {
      await loadGallery();
      setFeedbackMessage('Image removed successfully.');
      if (activeLightboxItem?.id === id) {
        setActiveLightboxItem(null);
      }
    }
  }, [activeLightboxItem, loadGallery]);

  const handleResetDefaults = useCallback(async () => {
    const confirmed = window.confirm('Reset gallery showcase to authentic clinic defaults?');
    if (!confirmed) return;

    await galleryService.resetDefaults();
    await loadGallery();
    setFeedbackMessage('Gallery restored to clinic defaults.');
  }, [loadGallery]);

  return {
    items,
    isLoading,
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalCount,
    yogaCount,
    treatmentCount,
    isModalOpen,
    setIsModalOpen,
    activeLightboxItem,
    setActiveLightboxItem,
    feedbackMessage,
    handleAddItem,
    handleDeleteItem,
    handleResetDefaults,
  };
};
