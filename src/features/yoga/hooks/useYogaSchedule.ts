import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  YogaSession,
  YogaFormData,
  DayOfWeek,
} from '../types/yoga.types';
import { yogaService } from '../services/yogaService';

export const useYogaSchedule = () => {
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<YogaSession | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchSessions = useCallback(() => {
    setIsLoading(true);
    yogaService
      .getAll()
      .then((data) => {
        setSessions(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load yoga schedules');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    yogaService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setSessions(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load yoga schedules');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setActionSuccessMessage(message);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 3500);
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (selectedDay !== 'All') {
        const matchesDay = session.days.includes(selectedDay as DayOfWeek);
        if (!matchesDay) return false;
      }

      if (selectedFormat !== 'all' && session.format !== selectedFormat) {
        return false;
      }

      if (selectedLevel !== 'all') {
        const matchesLevel = session.level === selectedLevel;
        const matchesSuitable = session.suitableFor?.toLowerCase().includes(selectedLevel.toLowerCase());
        if (!matchesLevel && !matchesSuitable) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(q);
        const matchesInstructor = Boolean(session.instructor?.toLowerCase().includes(q));
        const matchesSuitable = session.suitableFor.toLowerCase().includes(q);
        const matchesLocation = Boolean(session.location?.toLowerCase().includes(q));
        if (!matchesTitle && !matchesInstructor && !matchesSuitable && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, selectedDay, selectedFormat, selectedLevel, searchQuery]);

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
        const updated = await yogaService.update(editingSession.id, formData);
        setSessions((prev) =>
          prev.map((s) => (s.id === editingSession.id ? updated : s))
        );
        showToast(`"${formData.title}" updated successfully.`);
      } else {
        const created = await yogaService.create(formData);
        setSessions((prev) => [created, ...prev]);
        showToast(`"${formData.title}" scheduled successfully.`);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save yoga session:', err);
      throw err;
    }
  }, [editingSession, handleCloseModal, showToast]);

  const handleDeleteSession = useCallback(async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the yoga schedule?`)) {
      try {
        await yogaService.delete(id);
        setSessions((prev) => prev.filter((s) => s.id !== id));
        showToast(`"${title}" has been removed.`);
      } catch (err) {
        console.error('Failed to delete session:', err);
      }
    }
  }, [showToast]);

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
    actionSuccessMessage,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveSession,
    handleDeleteSession,
    refresh: fetchSessions,
  };
};
