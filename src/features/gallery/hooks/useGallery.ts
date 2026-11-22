import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem, GalleryCategory, GalleryFormData } from '../types';
import { galleryService, type GalleryCounts } from '../services/galleryService';

export type GalleryFilterTab = 'all' | GalleryCategory;

export const useGallery = (initialCategory: GalleryFilterTab = 'all') => {
  const [items, setItems] = useState<GalleryItem[]>(() => galleryService.getCachedItems());
  const [counts, setCounts] = useState<GalleryCounts>({
    total: 0,
    yoga: 0,
    treatment: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryFilterTab>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await galleryService.getItems(selectedCategory, debouncedSearch);
      setItems(res.items);
      setCounts(res.counts);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleAddItem = useCallback(async (data: GalleryFormData) => {
    const newItem = await galleryService.addItem(data);
    await loadGallery();
    setFeedbackMessage(`Image "${newItem.title}" added to ${newItem.category === 'yoga' ? 'Yoga' : 'Treatment'} showcase.`);
    setIsModalOpen(false);
  }, [loadGallery]);

  const handleEditItem = useCallback(async (id: string, data: Partial<GalleryFormData>) => {
    const updated = await galleryService.updateItem(id, data);
    await loadGallery();
    setFeedbackMessage(`Image "${updated.title}" updated successfully.`);
    setIsModalOpen(false);
    setEditingItem(null);
    if (activeLightboxItem?.id === id) {
      setActiveLightboxItem(updated);
    }
  }, [activeLightboxItem, loadGallery]);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: GalleryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
    if (activeLightboxItem?.id === item.id) {
      setActiveLightboxItem(null);
    }
  }, [activeLightboxItem]);

  const openDeleteModal = useCallback((id: string, title?: string) => {
    setDeleteConfirmItem({ id, title: title || 'this image' });
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setDeleteConfirmItem(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmItem) return;
    try {
      setIsDeleting(true);
      const success = await galleryService.deleteItem(deleteConfirmItem.id);
      if (success) {
        await loadGallery();
        setFeedbackMessage(`Image "${deleteConfirmItem.title}" deleted successfully.`);
        if (activeLightboxItem?.id === deleteConfirmItem.id) {
          setActiveLightboxItem(null);
        }
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  }, [deleteConfirmItem, activeLightboxItem, loadGallery]);

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
    filteredItems: items,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalCount: counts.total,
    yogaCount: counts.yoga,
    treatmentCount: counts.treatment,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    deleteConfirmItem,
    isDeleting,
    activeLightboxItem,
    setActiveLightboxItem,
    feedbackMessage,
    handleAddItem,
    handleEditItem,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleResetDefaults,
  };
};
