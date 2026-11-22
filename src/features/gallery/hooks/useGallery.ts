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
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
        setFeedbackMessage(`Image "${deleteConfirmItem.title}" permanently deleted from cloud storage and gallery.`);
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
