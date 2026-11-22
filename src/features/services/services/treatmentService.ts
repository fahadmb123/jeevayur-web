import type { AyurvedaService, FaqItem } from '../types';
import { apiClient } from '@/shared/lib/api';
import { galleryService } from '@/features/gallery/services/galleryService';
import { environment } from '@/shared/config/environment';

const resolveImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('/api/')) {
    return environment.apiBaseUrl ? `${environment.apiBaseUrl}${url}` : url;
  }
  return url;
};

export const treatmentService = {
  async getServices(params?: { category?: string; search?: string }): Promise<AyurvedaService[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.search && params.search.trim()) {
      query.set('search', params.search.trim());
    }

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const response = await apiClient.get<{
        treatments?: AyurvedaService[];
        data?: { treatments?: AyurvedaService[] };
      }>(`/api/treatments${queryString}`);

      const remoteTreatments = response.treatments ?? response.data?.treatments;
      if (Array.isArray(remoteTreatments)) {
        return remoteTreatments.map((t) => ({
          ...t,
          image: resolveImageUrl(t.image),
        }));
      }
    } catch {
    }

    try {
      const galleryResult = await galleryService.getItems('treatment', params?.search);
      if (galleryResult.items.length > 0) {
        return galleryResult.items.map((item) => ({
          id: item.id,
          title: item.title,
          categoryTag: 'Clinical Treatment',
          description: item.description || 'Authentic clinical Ayurvedic formulation and therapy guided by Dr. Ahalya T.S.',
          icon: '🌿',
          image: item.imageUrl,
          benefits: [
            'Classical herbal and clinical formulation',
            'Personalized treatment methodology',
            'Root-cause holistic healing',
          ],
          duration: 'Personalized Care',
          category: 'all',
        }));
      }
    } catch {
    }

    return [];
  },

  async getFaqs(): Promise<FaqItem[]> {
    try {
      const response = await apiClient.get<{
        faqs?: FaqItem[];
        data?: { faqs?: FaqItem[] };
      }>('/api/treatments/faqs');

      const remoteFaqs = response.faqs ?? response.data?.faqs;
      if (Array.isArray(remoteFaqs) && remoteFaqs.length > 0) {
        return remoteFaqs;
      }
    } catch {
    }
    return [];
  },
};
