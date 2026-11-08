import { apiClient } from '@/shared/lib/api/apiClient';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isVisible?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const socialLinksService = {
  /**
   * Fetch social links
   * @param all If true, fetches all links including inactive/hidden ones (for doctor settings)
   */
  async getSocialLinks(all = false): Promise<SocialLink[]> {
    try {
      const response = await apiClient.get<ApiResponse<SocialLink[]>>(
        `/api/social-links${all ? '?all=true' : ''}`
      );
      return response.data || [];
    } catch (error) {
      console.warn('[socialLinksService] Using fallback links:', error);
      return [
        { id: '1', platform: 'instagram', url: 'https://instagram.com/jeevayurniketan', isVisible: true },
        { id: '2', platform: 'linkedin', url: 'https://linkedin.com/company/jeevayurniketan', isVisible: true },
        { id: '3', platform: 'facebook', url: 'https://facebook.com/jeevayurniketan', isVisible: true },
        { id: '4', platform: 'youtube', url: 'https://youtube.com/@jeevayurniketan', isVisible: true },
      ];
    }
  },

  /**
   * Bulk save or update social links (for Doctor Settings management)
   */
  async bulkSaveSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    const response = await apiClient.put<ApiResponse<SocialLink[]>, { links: SocialLink[] }>(
      '/api/social-links',
      { links }
    );
    return response.data || [];
  },

  /**
   * Create a single social link
   */
  async createSocialLink(platform: string, url: string, isVisible = true): Promise<SocialLink> {
    const response = await apiClient.post<ApiResponse<SocialLink>, { platform: string; url: string; isVisible: boolean }>(
      '/api/social-links',
      { platform, url, isVisible }
    );
    return response.data;
  },

  /**
   * Delete a single social link by ID
   */
  async deleteSocialLink(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/social-links/${encodeURIComponent(id)}`);
  },
};
