import type { AyurvedaService, FaqItem } from '../types';
import { apiClient } from '@/shared/lib/api';
import metabolicImg from '@/assets/treatment_metabolic.jpg';
import womensHealthImg from '@/assets/treatment_womens_health.jpg';
import musculoskeletalImg from '@/assets/treatment_musculoskeletal.jpg';
import mentalWellbeingImg from '@/assets/treatment_mental_wellbeing.jpg';
import digestiveImg from '@/assets/treatment_digestive.jpg';
import skinHairImg from '@/assets/treatment_skin_hair.jpg';
import smritiImg from '@/assets/smriti_meditation.jpg';
import heroFlatlayImg from '@/assets/ayurveda_hero_flatlay.jpg';
import consultationImg from '@/assets/ayurveda_consultation.jpg';
import sanctuaryImg from '@/assets/login_sanctuary.jpg';

const IMAGE_MAP: Record<string, string> = {
  'metabolic-health': metabolicImg,
  'womens-health': womensHealthImg,
  'musculoskeletal-care': musculoskeletalImg,
  'mental-wellbeing': mentalWellbeingImg,
  'digestive-health': digestiveImg,
  'skin-hair-health': skinHairImg,
  'neurological-health': smritiImg,
  'respiratory-health': heroFlatlayImg,
  'geriatric-health': sanctuaryImg,
  'preventive-healthcare': consultationImg,
};

export const MOCK_SERVICES: AyurvedaService[] = [
  {
    id: 'metabolic-health',
    title: 'Metabolic Health',
    categoryTag: 'Prameha & Agni',
    description: 'Ayurvedic evaluation and management of Prameha, lipid imbalances, and metabolic sluggishness through Agni balancing.',
    icon: '🌿',
    image: metabolicImg,
    benefits: ['Insulin sensitivity support', 'Lipid balance & circulation', 'Agni metabolic rejuvenation'],
    duration: 'Personalized Plan',
  },
  {
    id: 'womens-health',
    title: "Women's Health",
    categoryTag: 'Stree Roga',
    description: 'Holistic care for menstrual regularities, hormonal harmony, PCOD/PCOS, and cyclical vitality through herbs and lifestyle.',
    icon: '🌸',
    image: womensHealthImg,
    benefits: ['Hormonal balance', 'Menstrual rhythm support', 'Holistic female vitality'],
    duration: 'Ongoing Care',
  },
  {
    id: 'musculoskeletal-care',
    title: 'Musculoskeletal Care',
    categoryTag: 'Sandhi Chikitsa',
    description: 'Classical management of joint mobility, spine health, cervical & lumbar stiffness, and degenerative discomfort.',
    icon: '🦴',
    image: musculoskeletalImg,
    benefits: ['Joint flexibility & ease', 'Spinal alignment support', 'Herbal anti-inflammatory relief'],
    duration: 'Custom Protocol',
  },
  {
    id: 'mental-wellbeing',
    title: 'Mental Well-being',
    categoryTag: 'Satvavajaya',
    description: 'Integrating classical Satvavajaya concepts, mindful counseling, and stress mitigation for emotional equilibrium.',
    icon: '🧠',
    image: mentalWellbeingImg,
    benefits: ['Stress & burnout recovery', 'Emotional resilience', 'Nervous system relaxation'],
    duration: '45-60 mins',
  },
  {
    id: 'digestive-health',
    title: 'Digestive Health',
    categoryTag: 'Jatharagni',
    description: 'Restoring gut digestive fire (Jatharagni) to relieve bloating, IBS tendencies, acidity, and metabolic toxin buildup.',
    icon: '🔥',
    image: digestiveImg,
    benefits: ['Agni digestive optimization', 'Ama toxin elimination', 'Balanced nutrient assimilation'],
    duration: 'Structured Care',
  },
  {
    id: 'skin-hair-health',
    title: 'Skin & Hair Health',
    categoryTag: 'Twak & Kesa',
    description: 'Root-cause management for chronic skin flare-ups, eczema, psoriasis tendencies, acne, and scalp nourishment.',
    icon: '✨',
    image: skinHairImg,
    benefits: ['Blood purification (Rakta Sodhana)', 'Natural skin glow', 'Hair follicle revitalization'],
    duration: 'Custom Program',
  },
  {
    id: 'neurological-health',
    title: 'Neurological Health',
    categoryTag: 'Vata & Majja',
    description: 'Supportive classical care for nerve vitality, chronic headaches, sleep disturbances, and sensory rejuvenation.',
    icon: '⚡',
    image: smritiImg,
    benefits: ['Nerve tone strengthening', 'Restful sleep regulation', 'Pranic vitality restoration'],
    duration: 'Holistic Plan',
  },
  {
    id: 'respiratory-health',
    title: 'Respiratory Health',
    categoryTag: 'Pranavaha Srotas',
    description: 'Strengthening Pranavaha srotas to relieve recurrent allergies, chronic sinusitis, cough, and bronchial sensitivity.',
    icon: '🌬️',
    image: heroFlatlayImg,
    benefits: ['Clear airway flow', 'Pranayama lung expansion', 'Allergic sensitivity reduction'],
    duration: 'Targeted Plan',
  },
  {
    id: 'geriatric-health',
    title: 'Geriatric Health',
    categoryTag: 'Rasayana Chikitsa',
    description: 'Promoting healthy aging, preserving tissue strength (Dhatus), bone density, and memory in elder years.',
    icon: '🪵',
    image: sanctuaryImg,
    benefits: ['Longevity & vitality support', 'Mobility & joint ease', 'Cognitive sharpness'],
    duration: 'Ongoing Rejuvenation',
  },
  {
    id: 'preventive-healthcare',
    title: 'Preventive Healthcare',
    categoryTag: 'Swasthavritta',
    description: 'Constitution analysis (Prakriti), Dinacharya daily routines, and Ritucharya seasonal adjustments to maintain health.',
    icon: '☀️',
    image: consultationImg,
    benefits: ['Prakriti self-awareness', 'Circadian lifestyle rhythm', 'Sustainable disease prevention'],
    duration: 'Foundational Care',
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    q: 'How does Dr. Ahalya personalize an Ayurvedic consultation?',
    a: 'Each consultation starts with an in-depth Prakriti assessment to understand your unique constitutional baseline, followed by evaluating current Dosha imbalances, digestive fire (Agni), tissue health (Dhatu), and daily lifestyle habits before creating your care plan.',
  },
  {
    q: 'Can online consultations be conducted for remote patients?',
    a: 'Yes, we provide secure video telemedicine consultations for patients across India and internationally, followed by personalized lifestyle guidance, diet protocols, and medicine delivery where indicated.',
  },
  {
    q: 'Is Ayurvedic healthcare safe alongside conventional medical treatments?',
    a: 'Yes. Our clinical care emphasizes safety, non-interference, and medical transparency. We review your current medications and health history carefully, and provide medical evaluation or referral whenever clinically indicated.',
  },
  {
    q: 'What role do diet and yoga play in the treatment process?',
    a: 'Diet (Ahara) and mindful movement/yoga (Vihara) are foundational in Ayurveda. Through Jeevayurniketan | Yogaathma, Dr. Ahalya coordinates doctor-guided personalized yoga, gentle restorative postures, and pranayama breathing practices alongside classical herbal preparations to support lasting, root-cause recovery.',
  },
  {
    q: 'How are follow-up appointments scheduled and monitored?',
    a: 'Progress is monitored through structured follow-ups to evaluate symptom relief, digestive improvements, and tolerance to therapies, making dynamic adjustments as your health naturally restores.',
  },
];

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
          image: IMAGE_MAP[t.id] || t.image || metabolicImg,
        }));
      }
    } catch {
    }

    let fallback = [...MOCK_SERVICES];
    if (params?.category && params.category !== 'all') {
      const catMap: Record<string, string[]> = {
        metabolic: ['metabolic-health', 'digestive-health'],
        women: ['womens-health'],
        joints: ['musculoskeletal-care'],
        mind: ['mental-wellbeing', 'neurological-health'],
        skin: ['skin-hair-health'],
        preventive: ['preventive-healthcare', 'geriatric-health', 'respiratory-health'],
      };
      const allowed = catMap[params.category] || [params.category];
      fallback = fallback.filter((s) => allowed.includes(s.id));
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      fallback = fallback.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.categoryTag || '').toLowerCase().includes(q) ||
          (s.benefits || []).some((b) => b.toLowerCase().includes(q))
      );
    }
    return fallback;
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
    return MOCK_FAQS;
  },
};