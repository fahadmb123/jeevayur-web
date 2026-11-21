import type { GalleryItem, GalleryFormData } from '../types';
import { apiClient } from '@/shared/lib/api/apiClient';
import { environment } from '@/shared/config/environment';

const GALLERY_STORAGE_KEY = 'jeevayurniketan_gallery_items';
const GALLERY_UPDATED_EVENT = 'jeevayurniketan_gallery_updated';

const resolveImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('/api/')) {
    return environment.apiBaseUrl ? `${environment.apiBaseUrl}${url}` : url;
  }
  return url;
};

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'yoga-1',
    title: 'Surya Namaskar at Dawn',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional 12-step sun salutation flow welcoming the morning prana in our courtyard.',
    createdAt: '2026-10-10',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'yoga-2',
    title: 'Mindfulness & Dhyana Session',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep meditative stillness focusing on breath awareness and nervous system calmitude.',
    createdAt: '2026-10-12',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'yoga-3',
    title: 'Lotus Posture (Padmasana) in Shala',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80',
    description: 'Root grounding and spine alignment within our natural teakwood yoga shala.',
    createdAt: '2026-10-14',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'portrait',
  },
  {
    id: 'yoga-4',
    title: 'Restorative Vinyasa & Spinal Mobility',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    description: 'Gentle mindful movement suited for stress relief and musculoskeletal recovery.',
    createdAt: '2026-10-15',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'yoga-5',
    title: 'Pranayama & Energy Cleansing',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
    description: 'Nadi Shodhana and Kapalabhati practices harmonizing vital bio-energies (Vata & Pitta).',
    createdAt: '2026-10-17',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'treatment-1',
    title: 'Shirodhara Medicated Oil Pouring',
    category: 'treatment',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    description: 'Continuous rhythmic stream of warm herbal oil over the forehead chakra to relieve anxiety and insomnia.',
    createdAt: '2026-10-08',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'treatment-2',
    title: 'Abhyanga Full-Body Herbal Massage',
    category: 'treatment',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80',
    description: 'Therapeutic warm medicated oil massage along energy meridians to invigorate cellular vitality.',
    createdAt: '2026-10-11',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'treatment-3',
    title: 'Botanical Herbarium & Fresh Decoctions',
    category: 'treatment',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80',
    description: 'Hand-ground Ayurvedic roots, Ashwagandha, and therapeutic botanical formulations.',
    createdAt: '2026-10-13',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'treatment-4',
    title: 'Swedana Herbal Steam & Hydrotherapy',
    category: 'treatment',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    description: 'Detoxifying therapeutic steam bath infused with aromatic medicinal leaves and cedar.',
    createdAt: '2026-10-16',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
  {
    id: 'treatment-5',
    title: 'Panchakarma Consultation & Herbal Poultice',
    category: 'treatment',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
    description: 'Warm Kizhi herbal bolus application to relieve joint inflammation and muscle stiffness.',
    createdAt: '2026-10-18',
    author: 'Jeevayurniketan Ayurveda',
    aspectRatio: 'landscape',
  },
];

export const galleryService = {
  async getItems(): Promise<GalleryItem[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: GalleryItem[] }>('/api/gallery');
      if (response && response.success && Array.isArray(response.data)) {
        const mapped = response.data.map((item) => ({
          ...item,
          imageUrl: resolveImageUrl(item.imageUrl),
        }));
        this.cacheItems(mapped);
        return mapped;
      }
    } catch {
    }
    return this.getCachedItems();
  },

  getCachedItems(): GalleryItem[] {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: GalleryItem) => ({
            ...item,
            imageUrl: resolveImageUrl(item.imageUrl),
          }));
        }
      }
    } catch {
    }
    return INITIAL_GALLERY_ITEMS;
  },

  cacheItems(items: GalleryItem[]): void {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  },

  async addItem(data: GalleryFormData): Promise<GalleryItem> {
    if (data.file && data.file.size > 2 * 1024 * 1024) {
      throw new Error('Image file size must be less than 2MB.');
    }
    try {
      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title.trim());
        formData.append('category', data.category);
        if (data.description) formData.append('description', data.description.trim());
        if (data.author) formData.append('author', data.author.trim());
        if (data.aspectRatio) formData.append('aspectRatio', data.aspectRatio);

        const url = `${environment.apiBaseUrl}/api/gallery`;
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (res.ok) {
          const body = await res.json();
          if (body?.success && body?.data) {
            const item: GalleryItem = {
              ...body.data,
              imageUrl: resolveImageUrl(body.data.imageUrl),
            };
            const cached = this.getCachedItems();
            this.cacheItems([item, ...cached]);
            window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
            return item;
          }
        }
      } else if (data.imageUrl) {
        const response = await apiClient.post<{ success: boolean; data: GalleryItem }>('/api/gallery', {
          title: data.title.trim(),
          category: data.category,
          imageUrl: data.imageUrl.trim(),
          description: data.description?.trim(),
          author: data.author?.trim(),
          aspectRatio: data.aspectRatio,
        });

        if (response && response.success && response.data) {
          const item: GalleryItem = {
            ...response.data,
            imageUrl: resolveImageUrl(response.data.imageUrl),
          };
          const cached = this.getCachedItems();
          this.cacheItems([item, ...cached]);
          window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
          return item;
        }
      }
    } catch {
    }

    const fallbackItem: GalleryItem = {
      id: `${data.category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      category: data.category,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : '',
      description: data.description?.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      author: data.author?.trim() || 'Doctor / Wellness Admin',
      aspectRatio: data.aspectRatio || 'landscape',
    };
    const cached = this.getCachedItems();
    this.cacheItems([fallbackItem, ...cached]);
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
    return fallbackItem;
  },

  async deleteItem(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/gallery/${id}`);
    } catch {
    }
    const cached = this.getCachedItems();
    const filtered = cached.filter((item) => item.id !== id);
    this.cacheItems(filtered);
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
    return true;
  },

  async resetDefaults(): Promise<GalleryItem[]> {
    try {
      const response = await apiClient.post<{ success: boolean; data: GalleryItem[] }>('/api/gallery/reset');
      if (response && response.success && Array.isArray(response.data)) {
        const mapped = response.data.map((item) => ({
          ...item,
          imageUrl: resolveImageUrl(item.imageUrl),
        }));
        this.cacheItems(mapped);
        window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
        return mapped;
      }
    } catch {
    }
    this.cacheItems(INITIAL_GALLERY_ITEMS);
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT));
    return INITIAL_GALLERY_ITEMS;
  },

  subscribe(callback: () => void): () => void {
    const listener = () => callback();
    window.addEventListener(GALLERY_UPDATED_EVENT, listener);
    window.addEventListener('storage', (e) => {
      if (e.key === GALLERY_STORAGE_KEY) {
        callback();
      }
    });
    return () => {
      window.removeEventListener(GALLERY_UPDATED_EVENT, listener);
    };
  },
};
