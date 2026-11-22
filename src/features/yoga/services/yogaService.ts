import type { YogaSession, YogaFormData } from '../types/yoga.types';
import { apiClient } from '@/shared/lib/api/apiClient';

export interface YogaFilterParams {
  day?: string;
  format?: string;
  level?: string;
  search?: string;
}

const STORAGE_KEY = 'jeevayurniketan_yoga_sessions_v3';
const YOGA_UPDATED_EVENT = 'jeevayurniketan_yoga_updated';

const loadSessionsFromStorage = (): YogaSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: YogaSession) => {
          if (!item.scheduleItems || item.scheduleItems.length === 0) {
            const defaultTime = item.time || '06:30 AM - 07:30 AM';
            return {
              ...item,
              scheduleItems: (item.days || []).map((day) => ({
                day,
                time: defaultTime,
              })),
            };
          }
          return item;
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse yoga sessions from localStorage:', err);
  }
  return [];
};

const saveSessionsToStorage = (sessions: YogaSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save yoga sessions to localStorage:', err);
  }
};

export const yogaService = {
  getAll: async (filters?: YogaFilterParams): Promise<YogaSession[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.day && filters.day.toLowerCase() !== 'all') {
        params.append('day', filters.day);
      }
      if (filters?.format && filters.format.toLowerCase() !== 'all') {
        params.append('format', filters.format.toLowerCase());
      }
      if (filters?.level && filters.level.toLowerCase() !== 'all') {
        params.append('level', filters.level);
      }
      if (filters?.search && filters.search.trim() !== '') {
        params.append('search', filters.search.trim());
      }
      const queryString = params.toString();
      const endpoint = queryString ? `/api/yoga?${queryString}` : '/api/yoga';

      const response = await apiClient.get<{ success: boolean; data: YogaSession[] }>(endpoint);
      if (response && response.success && Array.isArray(response.data)) {
        if (!queryString) {
          saveSessionsToStorage(response.data);
        }
        return response.data;
      }
    } catch {
    }

    const cached = loadSessionsFromStorage();
    if (!filters) return cached;
    return cached.filter((session) => {
      if (filters.day && filters.day.toLowerCase() !== 'all' && !session.days.includes(filters.day as any)) {
        return false;
      }
      if (filters.format && filters.format.toLowerCase() !== 'all' && session.format !== filters.format) {
        return false;
      }
      if (filters.level && filters.level.toLowerCase() !== 'all') {
        const matchesLevel = session.level === filters.level;
        const matchesSuitable = session.suitableFor?.toLowerCase().includes(filters.level.toLowerCase());
        if (!matchesLevel && !matchesSuitable) return false;
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(q);
        const matchesDesc = session.description.toLowerCase().includes(q);
        const matchesInstructor = Boolean(session.instructor?.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesInstructor) return false;
      }
      return true;
    });
  },

  getById: async (id: string): Promise<YogaSession | undefined> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: YogaSession }>(`/api/yoga/${id}`);
      if (response && response.success && response.data) {
        return response.data;
      }
    } catch {
    }
    const cached = loadSessionsFromStorage();
    return cached.find((s) => s.id === id);
  },

  create: async (formData: YogaFormData): Promise<YogaSession> => {
    const payload = {
      title: formData.title.trim(),
      duration: formData.duration.trim(),
      format: formData.format,
      suitableFor: formData.suitableFor.trim(),
      days: formData.days,
      time: formData.time || null,
      scheduleItems: formData.scheduleItems || null,
      description: formData.description.trim(),
      level: formData.level || 'Beginner',
      ageGroup: formData.ageGroup || null,
      instructor: formData.instructor || null,
      location: formData.location || null,
      capacity: formData.capacity ?? null,
      price: formData.price || null,
      priceAmount: formData.priceAmount || null,
      priceUnit: formData.priceUnit || null,
      imageUrl: formData.imageUrl || null,
    };

    try {
      const response = await apiClient.post<{ success: boolean; data: YogaSession }>('/api/yoga', payload);
      if (response && response.success && response.data) {
        const cached = loadSessionsFromStorage();
        saveSessionsToStorage([response.data, ...cached.filter((s) => s.id !== response.data.id)]);
        window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
        return response.data;
      }
    } catch {
    }

    const fallbackSession: YogaSession = {
      ...formData,
      id: `yoga-${Date.now()}`,
      enrolledCount: 0,
      status: 'active',
      imageUrl: formData.imageUrl?.trim() || '',
    };
    const cached = loadSessionsFromStorage();
    saveSessionsToStorage([fallbackSession, ...cached]);
    window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
    return fallbackSession;
  },

  update: async (id: string, formData: Partial<YogaFormData>): Promise<YogaSession> => {
    const payload: Record<string, any> = {};
    if (formData.title !== undefined) payload.title = formData.title.trim();
    if (formData.duration !== undefined) payload.duration = formData.duration.trim();
    if (formData.format !== undefined) payload.format = formData.format;
    if (formData.suitableFor !== undefined) payload.suitableFor = formData.suitableFor.trim();
    if (formData.days !== undefined) payload.days = formData.days;
    if (formData.time !== undefined) payload.time = formData.time;
    if (formData.scheduleItems !== undefined) payload.scheduleItems = formData.scheduleItems;
    if (formData.description !== undefined) payload.description = formData.description.trim();
    if (formData.level !== undefined) payload.level = formData.level;
    if (formData.ageGroup !== undefined) payload.ageGroup = formData.ageGroup;
    if (formData.instructor !== undefined) payload.instructor = formData.instructor;
    if (formData.location !== undefined) payload.location = formData.location;
    if (formData.capacity !== undefined) payload.capacity = formData.capacity;
    if (formData.price !== undefined) payload.price = formData.price;
    if (formData.priceAmount !== undefined) payload.priceAmount = formData.priceAmount;
    if (formData.priceUnit !== undefined) payload.priceUnit = formData.priceUnit;
    if (formData.imageUrl !== undefined) payload.imageUrl = formData.imageUrl;

    try {
      const response = await apiClient.put<{ success: boolean; data: YogaSession }>(`/api/yoga/${id}`, payload);
      if (response && response.success && response.data) {
        const cached = loadSessionsFromStorage();
        saveSessionsToStorage(cached.map((s) => (s.id === id ? response.data : s)));
        window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
        return response.data;
      }
    } catch {
    }

    const cached = loadSessionsFromStorage();
    const index = cached.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Yoga session with ID ${id} not found.`);
    }
    const updatedSession: YogaSession = {
      ...cached[index],
      ...formData,
    };
    cached[index] = updatedSession;
    saveSessionsToStorage(cached);
    window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
    return updatedSession;
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/yoga/${id}`);
    } catch {
    }
    const cached = loadSessionsFromStorage();
    const filtered = cached.filter((s) => s.id !== id);
    saveSessionsToStorage(filtered);
    window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
    return true;
  },

  clearAll: async (): Promise<YogaSession[]> => {
    saveSessionsToStorage([]);
    window.dispatchEvent(new CustomEvent(YOGA_UPDATED_EVENT));
    return [];
  },
};
