import type { YogaSession, YogaFormData } from '../types/yoga.types';

const STORAGE_KEY = 'jeevayurniketan_yoga_sessions_v3';

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
  getAll: async (): Promise<YogaSession[]> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return loadSessionsFromStorage();
  },

  getById: async (id: string): Promise<YogaSession | undefined> => {
    const sessions = loadSessionsFromStorage();
    return sessions.find((s) => s.id === id);
  },

  create: async (formData: YogaFormData): Promise<YogaSession> => {
    const sessions = loadSessionsFromStorage();
    const newSession: YogaSession = {
      ...formData,
      id: `yoga-${Date.now()}`,
      enrolledCount: 0,
      status: 'active',
      imageUrl: formData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    };
    const updated = [newSession, ...sessions];
    saveSessionsToStorage(updated);
    return newSession;
  },

  update: async (id: string, formData: Partial<YogaFormData>): Promise<YogaSession> => {
    const sessions = loadSessionsFromStorage();
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Yoga session with ID ${id} not found.`);
    }
    const updatedSession: YogaSession = {
      ...sessions[index],
      ...formData,
    };
    sessions[index] = updatedSession;
    saveSessionsToStorage(sessions);
    return updatedSession;
  },

  delete: async (id: string): Promise<boolean> => {
    const sessions = loadSessionsFromStorage();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === sessions.length) return false;
    saveSessionsToStorage(filtered);
    return true;
  },

  clearAll: async (): Promise<YogaSession[]> => {
    saveSessionsToStorage([]);
    return [];
  },
};
