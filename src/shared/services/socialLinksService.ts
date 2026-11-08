export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isVisible?: boolean;
}

export const socialLinksService = {
  /**
   * Fetch social links
   * @param all If true, fetches all links including inactive/hidden ones (for doctor settings)
   */
  async getSocialLinks(all = false): Promise<SocialLink[]> {
    try {
      const url = `/api/social-links${all ? '?all=true' : ''}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch social links: ${res.status}`);
      }

      const json = await res.json();
      return json.data || [];
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
    const res = await fetch('/api/social-links', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ links }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to save social links: ${res.status}`);
    }

    const json = await res.json();
    return json.data || [];
  },

  /**
   * Create a single social link
   */
  async createSocialLink(platform: string, url: string, isVisible = true): Promise<SocialLink> {
    const res = await fetch('/api/social-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ platform, url, isVisible }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create social link');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Delete a single social link by ID
   */
  async deleteSocialLink(id: string): Promise<void> {
    const res = await fetch(`/api/social-links/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete social link');
    }
  },
};
