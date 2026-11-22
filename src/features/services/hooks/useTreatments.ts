import { useState, useEffect } from 'react';
import { treatmentService } from '../services/treatmentService';
import { galleryService } from '@/features/gallery/services/galleryService';
import type { AyurvedaService, FaqItem } from '../types';

export const useTreatments = (category = 'all', search = '') => {
  const [services, setServices] = useState<AyurvedaService[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const loadData = () => {
      setLoading(true);
      treatmentService.getServices({ category, search }).then((data) => {
        if (mounted) {
          setServices(data);
          setLoading(false);
        }
      });
    };

    const timer = setTimeout(loadData, search ? 250 : 0);
    const unsubscribe = galleryService.subscribe(loadData);

    return () => {
      mounted = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, [category, search]);

  useEffect(() => {
    treatmentService.getFaqs().then((faqData) => {
      setFaqs(faqData);
    });
  }, []);

  return { services, faqs, loading };
};
