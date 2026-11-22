export type GalleryCategory = 'yoga' | 'treatment';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  imageKey?: string | null;
  description?: string;
  createdAt: string;
  author?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface GalleryFormData {
  title: string;
  category: GalleryCategory;
  imageUrl?: string;
  file?: File;
  description?: string;
  author?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}
