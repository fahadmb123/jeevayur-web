export const CLINIC_CONTACT = {
  phone: (import.meta.env.VITE_CLINIC_PHONE as string) || '+91 73567 02775',
  email: (import.meta.env.VITE_CLINIC_EMAIL as string) || 'info@jeevayurniketan.com',
  get cleanPhone(): string {
    return this.phone.replace(/[\s\-\+\(\)]/g, '');
  },
  get telUrl(): string {
    return `tel:${this.phone.replace(/\s+/g, '')}`;
  },
  get mailtoUrl(): string {
    return `mailto:${this.email}`;
  },
  getWhatsappUrl(customText?: string): string {
    const textParam = customText ? `?text=${encodeURIComponent(customText)}` : '';
    return `https://wa.me/${this.cleanPhone}${textParam}`;
  },
};

