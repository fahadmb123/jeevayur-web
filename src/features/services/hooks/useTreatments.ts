import { useState, useEffect } from 'react';
import { treatmentService } from '../services/treatmentService';
import type { AyurvedaService, FaqItem } from '../types';

export const useTreatments = (category = 'all', search = '') => {
  const [services, setServices] = useState<AyurvedaService[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      treatmentService.getServices({ category, search }).then((data) => {
        if (mounted) {
          setServices(data);
          setLoading(false);
        }
      });
    }, search ? 250 : 0);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [category, search]);

  useEffect(() => {
    treatmentService.getFaqs().then((faqData) => {
      setFaqs(faqData);
    });
  }, []);

  return { services, faqs, loading };
};
