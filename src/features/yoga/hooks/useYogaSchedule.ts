import { useState, useEffect, useCallback } from 'react';
import type {
  YogaSession,
  YogaFormData,
} from '../types/yoga.types';
import { yogaService } from '../services/yogaService';

export const useYogaSchedule = () => {
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<YogaSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<YogaSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTotalSessions = useCallback(async () => {
    try {
      const data = await yogaService.getAll();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load total yoga sessions:', err);
    }
  }, []);

  const fetchFilteredSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await yogaService.getAll({
        day: selectedDay,
        format: selectedFormat,
        level: selectedLevel,
        search: debouncedSearch,
      });
      setFilteredSessions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load yoga schedules');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDay, selectedFormat, selectedLevel, debouncedSearch]);

  useEffect(() => {
    fetchTotalSessions();
  }, [fetchTotalSessions]);

  useEffect(() => {
    fetchFilteredSessions();
  }, [fetchFilteredSessions]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchTotalSessions();
      fetchFilteredSessions();
    };
    window.addEventListener('jeevayurniketan_yoga_updated', handleUpdate);
    return () => {
      window.removeEventListener('jeevayurniketan_yoga_updated', handleUpdate);
    };
  }, [fetchTotalSessions, fetchFilteredSessions]);

  const showToast = useCallback((message: string) => {
    setActionSuccessMessage(message);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 3500);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingSession(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((session: YogaSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSession(null);
  }, []);

  const handleSaveSession = useCallback(async (formData: YogaFormData) => {
    try {
      if (editingSession) {
        await yogaService.update(editingSession.id, formData);
        showToast(`"${formData.title}" updated successfully.`);
      } else {
        await yogaService.create(formData);
        showToast(`"${formData.title}" scheduled successfully.`);
      }
      await Promise.all([fetchTotalSessions(), fetchFilteredSessions()]);
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save yoga session:', err);
      throw err;
    }
  }, [editingSession, handleCloseModal, showToast, fetchTotalSessions, fetchFilteredSessions]);

  const handleOpenDeleteModal = useCallback((id: string, title: string) => {
    setSessionToDelete({ id, title });
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (isDeleting) return;
    setSessionToDelete(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);
    try {
      await yogaService.delete(sessionToDelete.id);
      showToast(`"${sessionToDelete.title}" has been removed.`);
      setSessionToDelete(null);
      await Promise.all([fetchTotalSessions(), fetchFilteredSessions()]);
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [sessionToDelete, showToast, fetchTotalSessions, fetchFilteredSessions]);

  return {
    sessions,
    filteredSessions,
    isLoading,
    error,
    selectedDay,
    setSelectedDay,
    selectedFormat,
    setSelectedFormat,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    editingSession,
    sessionToDelete,
    isDeleting,
    actionSuccessMessage,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveSession,
    handleDeleteSession: handleOpenDeleteModal,
    handleOpenDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    refresh: () => Promise.all([fetchTotalSessions(), fetchFilteredSessions()]),
  };
};
