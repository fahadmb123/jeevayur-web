import personalizedImg from '@/assets/yoga_personalized.jpg';
import groupImg from '@/assets/yoga_group.jpg';
import therapeuticImg from '@/assets/yoga_therapeutic.jpg';
import pranayamaImg from '@/assets/yoga_pranayama.jpg';
import meditationImg from '@/assets/smriti_meditation.jpg';
import { CLINIC_CONTACT } from '@/shared/config/clinicContact';

export interface YogaProgram {
  id: string;
  number: string;
  title: string;
  tagline: string;
  categoryTag: string;
  accentColor: string;
  description: string;
  image: string;
  idealForTitle: string;
  idealFor: string[];
  focus: string;
  format: string;
  duration: string;
}

export interface LearnTopic {
  title: string;
  subtitle?: string;
  description: string;
  iconName: string;
}

export interface NeedCategory {
  category: string;
  iconName: string;
  items: string[];
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  iconName: string;
}

export const YOGAATHMA_DATA = {
  hero: {
    badge: 'Jeevayurniketan | Yogaathma',
    title: 'Yoga for Mind, Body & Spirit',
    subtitle: 'Personalized Yoga Practice for Holistic Wellbeing',
    description:
      'Discover a balanced approach to health and wellbeing through authentic yogic practices. At Jeevayurniketan | Yogaathma, we offer personalized yoga sessions designed to support your physical mobility, mental clarity, emotional balance, and overall quality of life.',
    secondaryDesc:
      'Our approach combines traditional yogic principles with individualized guidance, taking into account your abilities, lifestyle, comfort, and wellness goals. Whether you are a beginner, looking to establish a regular yoga routine, or seeking a gentle practice that complements your existing healthcare plan, our sessions help you develop a sustainable practice at your own pace.',
    ctaPrimary: 'Book a Yoga Session',
    ctaSecondary: 'Explore Our Programs',
    phone: CLINIC_CONTACT.phone,
    whatsappMessage:
      'Hello Jeevayurniketan | Yogaathma, I would like to enquire about your yoga programs and book a session.',
  },

  approach: {
    badge: 'Our Approach to Yoga',
    title: 'Yoga That Connects Body, Mind & Soul',
    lead:
      'Yoga is more than physical exercise. It is a holistic practice that brings together movement, breathing, relaxation, and mindful awareness.',
    description:
      "At Yogaathma, we emphasize a thoughtful, individualized approach that respects each person's needs and abilities. Our sessions are designed to help you build consistency, develop body awareness, improve movement confidence, and cultivate a calmer, more mindful lifestyle.",
    pillars: [
      {
        title: 'Personalized Practice',
        desc: 'Sessions adapted to your individual needs, abilities, and wellness goals.',
      },
      {
        title: 'Traditional Yogic Principles',
        desc: 'Practices inspired by authentic yogic traditions and classical shastras.',
      },
      {
        title: 'Mind–Body Awareness',
        desc: 'Integrating movement, conscious breathing, and mindful awareness.',
      },
      {
        title: 'Progressive Learning',
        desc: 'Building confidence and consistency through guided, compassionate practice.',
      },
      {
        title: 'Holistic Wellbeing',
        desc: 'Supporting balanced physical, mental, and emotional wellness in daily living.',
      },
    ],
  },

  programs: [
    {
      id: 'personalized-practice',
      number: '01',
      title: 'Personalized Yoga Practice',
      tagline: 'Yoga designed around you.',
      categoryTag: '1-ON-1 GUIDANCE',
      accentColor: '#1B6B50',
      description:
        'Every individual has different physical abilities, routines, and wellness goals. Our personalized yoga sessions are structured around your needs, allowing you to practise comfortably and progress gradually.',
      image: personalizedImg,
      idealForTitle: 'Ideal for:',
      idealFor: [
        'Beginners who need individual guidance',
        'Individuals seeking a structured yoga routine',
        'People who prefer a practice adapted to their abilities',
        'Individuals looking to improve flexibility, mobility, and body awareness',
        'Those seeking to establish healthier daily habits',
      ],
      focus: 'Individual attention, appropriate modifications, and sustainable practice.',
      format: 'In-Shala & 1-on-1 Online',
      duration: '45–60 mins',
    },
    {
      id: 'online-group-sessions',
      number: '02',
      title: 'Online Group Yoga Sessions',
      tagline: 'Practise together. Grow together.',
      categoryTag: 'COMMUNITY BATCH',
      accentColor: '#2563EB',
      description:
        'Experience the benefits of guided yoga practice from the comfort of your home through our online group sessions. Our small-group approach encourages consistency, shared learning, and a supportive practice environment.',
      image: groupImg,
      idealForTitle: 'Program highlights:',
      idealFor: [
        'Convenient online participation from home',
        'Small-group learning environment',
        'Beginner-friendly guidance with modifications',
        'Guided breathing and relaxation practices',
        'Support for developing a consistent yoga routine',
      ],
      focus: 'Making yoga accessible, engaging, and easier to incorporate into everyday life.',
      format: 'Live Interactive Video',
      duration: '60 mins',
    },
    {
      id: 'therapeutic-yoga',
      number: '03',
      title: 'Therapeutic Yoga',
      tagline: 'A mindful, individualized approach to supportive care.',
      categoryTag: 'CLINICAL SUPPORT',
      accentColor: '#C98D3B',
      description:
        "Therapeutic yoga uses carefully selected yogic practices to complement an individual's broader healthcare and wellness plan. Depending on individual needs, sessions incorporate gentle movements, modified postures, breathing techniques, relaxation, and mindfulness.",
      image: therapeuticImg,
      idealForTitle: 'Our focus areas include:',
      idealFor: [
        'Gentle movement and joint mobility',
        'Stress management and nervous relaxation',
        'Posture awareness and movement confidence',
        'Supportive practices for healthy daily routines',
        'Mind–body awareness and emotional wellbeing',
      ],
      focus:
        'All practices adapted to individual circumstances. Intended to complement appropriate medical care, not replace diagnosis or prescribed treatment.',
      format: 'Clinical 1-on-1 / Hybrid',
      duration: 'Custom Protocol',
    },
    {
      id: 'pranayama-breathing',
      number: '04',
      title: 'Pranayama — Breathing Practices',
      tagline: 'Reconnect with your breath.',
      categoryTag: 'PRANA & VITALITY',
      accentColor: '#0EA5E9',
      description:
        'Pranayama refers to traditional yogic breathing practices that cultivate awareness of the breath and encourage calm, focused attention. With appropriate guidance, participants learn breathing techniques suited to their comfort and experience level.',
      image: pranayamaImg,
      idealForTitle: 'Potential areas of support:',
      idealFor: [
        'Relaxation and autonomic stress management',
        'Mindful breathing awareness throughout the day',
        'Improved mental focus and clarity during practice',
        'Developing a regular calming relaxation routine',
        'Supporting a calmer transition into meditation',
      ],
      focus:
        'Breathing techniques selected according to individual needs. Practices involving forceful breathing or retention are modified appropriately.',
      format: 'Online & Studio',
      duration: '30–45 mins',
    },
    {
      id: 'guided-meditation',
      number: '05',
      title: 'Guided Meditation',
      tagline: 'Create space for calm and clarity.',
      categoryTag: 'DHYANA & STILLNESS',
      accentColor: '#8B5CF6',
      description:
        'Guided meditation offers a structured opportunity to pause, settle the mind, and develop greater awareness of the present moment. Through instructor-led guidance, participants explore relaxation, mindful attention, and simple meditation techniques that can be incorporated into daily life.',
      image: meditationImg,
      idealForTitle: 'Sessions focus on:',
      idealFor: [
        'Mindfulness and present-moment awareness',
        'Relaxation and emotional stress release',
        'Deepening emotional awareness and resilience',
        'Mental clarity and focused inner attention',
        'Developing a consistent daily meditation habit',
      ],
      focus: 'No previous meditation experience is necessary. Everyone is guided warmly.',
      format: 'Audio & Live Video',
      duration: '30 mins',
    },
  ] as YogaProgram[],

  whatYoullLearn: [
    {
      title: 'Beginner-Friendly Yoga',
      subtitle: 'Start your yoga journey with confidence.',
      description:
        'Our beginner-friendly approach introduces suitable postures, basic movement patterns, and simple breathing practices at a comfortable pace. Instructions and modifications help participants develop familiarity with the practice without unnecessary pressure.',
      iconName: 'Sparkles',
    },
    {
      title: 'Breathing Exercises',
      subtitle: 'Cultivate respiratory rhythm.',
      description:
        'Learn appropriate pranayama techniques to develop breathing awareness, relaxation, and concentration.',
      iconName: 'Wind',
    },
    {
      title: 'Guided Meditation',
      subtitle: 'Settle the mind.',
      description:
        'Explore instructor-led meditation practices designed to encourage mindfulness, calm, and self-awareness.',
      iconName: 'Heart',
    },
    {
      title: 'Mind–Body Coordination',
      subtitle: 'Structural harmony.',
      description:
        'Develop awareness of posture, movement, balance, and the relationship between physical activity and mental wellbeing.',
      iconName: 'Activity',
    },
    {
      title: 'Relaxation Techniques',
      subtitle: 'Release stored tension.',
      description:
        'Discover practical ways to incorporate relaxation and mindful pauses into your everyday routine.',
      iconName: 'Sun',
    },
    {
      title: 'Healthy Daily Habits',
      subtitle: 'Sustainable lifestyle routines.',
      description:
        'Build a sustainable practice that complements your lifestyle, activity levels, sleep routine, and personal wellness goals.',
      iconName: 'CheckCircle2',
    },
  ] as LearnTopic[],

  individualNeeds: {
    title: 'Personalized Yoga for Individual Needs',
    subtitle: 'A Practice That Respects Your Body',
    description:
      'Yoga should be adapted to the individual rather than approached as a one-size-fits-all routine. We consider your experience, physical abilities, comfort, lifestyle, and goals when selecting suitable practices. Our sessions may be adapted for individuals seeking supportive movement and wellbeing practices alongside professional healthcare for concerns such as:',
    categories: [
      {
        category: 'Physical Health and Mobility',
        iconName: 'Shield',
        items: [
          'Joint stiffness and movement limitations',
          'Low back discomfort & lumbar stiffness',
          'Arthritis-related mobility challenges',
          'Weight management and physical inactivity',
          'General weakness and reduced physical conditioning',
        ],
      },
      {
        category: 'Mind and Everyday Wellbeing',
        iconName: 'Smile',
        items: [
          'Stress and anxiety management',
          'Sleep difficulties and insomnia patterns',
          'Digestive health and healthy lifestyle habits',
          'Migraine-related wellbeing support',
          'Fatigue and nervous system relaxation needs',
        ],
      },
      {
        category: 'Additional Individual Needs',
        iconName: 'Users',
        items: [
          'Respiratory health considerations',
          'Postnatal recovery, where medically appropriate',
          'Age-related mobility limitations',
          'Maintaining independence and functional movement',
        ],
      },
    ] as NeedCategory[],
    notes:
      'These are areas in which appropriately adapted yoga may provide supportive benefits; it is not a guaranteed treatment for these conditions. Some conditions require medical evaluation before starting yoga.',
    warning:
      'For people with chronic health conditions, pregnancy, recent surgery, or significant pain, professional medical guidance may be needed before beginning a program.',
  },

  personalizedSteps: [
    {
      step: '01',
      title: 'Understand Your Needs',
      description:
        'We begin by understanding your previous yoga experience, current activity level, physical limitations, and wellness goals.',
    },
    {
      step: '02',
      title: 'Select Suitable Practices',
      description:
        'We identify appropriate movements, breathing exercises, relaxation techniques, and meditation practices based on your individual circumstances.',
    },
    {
      step: '03',
      title: 'Practise With Guidance',
      description:
        'You receive clear instructions and suitable modifications to help you practise with greater awareness and confidence.',
    },
    {
      step: '04',
      title: 'Build Consistency',
      description:
        'We encourage a realistic and sustainable routine that can fit naturally into your daily life.',
    },
    {
      step: '05',
      title: 'Review and Adapt',
      description:
        'Your practice can be adjusted dynamically as your comfort, experience, and goals evolve.',
    },
  ] as StepItem[],

  whyChoose: [
    {
      title: 'Doctor-Guided Sessions',
      description:
        'Where applicable, yoga practices are planned with appropriate healthcare guidance and attention to individual needs.',
      iconName: 'Stethoscope',
    },
    {
      title: 'Personal Attention',
      description:
        'Our personalized sessions allow closer attention to your abilities, questions, and practice goals.',
      iconName: 'UserCheck',
    },
    {
      title: 'Small-Group Learning',
      description:
        'Online group sessions provide a supportive environment for guided learning and regular practice.',
      iconName: 'Users',
    },
    {
      title: 'Beginner-Friendly Guidance',
      description:
        'You can begin without previous yoga experience. Suitable practices and modifications are introduced progressively.',
      iconName: 'Sparkles',
    },
    {
      title: 'Traditional Yogic Principles',
      description:
        'Our approach draws inspiration from traditional yogic practices, integrating movement, breathing, relaxation, and mindful awareness.',
      iconName: 'Award',
    },
    {
      title: 'Individual Modifications',
      description:
        'Practices can be adjusted to accommodate appropriate physical limitations, comfort levels, and experience.',
      iconName: 'Sliders',
    },
    {
      title: 'Holistic Wellbeing',
      description:
        'We encourage a balanced approach to physical activity, mental wellbeing, relaxation, and healthy daily routines.',
      iconName: 'HeartHandshake',
    },
  ] as WhyChooseItem[],

  whoCanJoin: [
    'Beginners interested in learning authentic yoga',
    'Adults seeking a regular, grounding wellness routine',
    'Individuals looking for gentle, guided therapeutic movement',
    'People interested in breath awareness (pranayama) and meditation',
    'Individuals seeking support with stress management and relaxation',
    'Those who prefer personalized 1-on-1 guidance',
    'Participants who wish to practise yoga online from home',
  ],
  whoCanJoinNote:
    'Suitability depends on individual health and physical abilities. We recommend discussing relevant medical conditions or physical limitations before beginning a program.',

  booking: {
    heading: 'Begin Your Yoga Journey',
    tagline: 'Small Steps Towards a More Balanced Life',
    description:
      'Develop a yoga practice that fits your needs, respects your abilities, and supports your personal wellness goals. Whether you choose personalized sessions or a small online group, our aim is to help you approach yoga with confidence, consistency, and mindful awareness.',
    encouragement: 'Start where you are. Progress at your own pace. Make wellbeing a part of everyday life.',
    phone: CLINIC_CONTACT.phone,
    options: 'Personalized practice and online group sessions.',
  },

  philosophy: {
    title: 'Our Philosophy',
    quote:
      'At Jeevayurniketan | Yogaathma, we believe that yoga is a lifelong journey of self-awareness, balanced living, and mindful practice. Our goal is to make traditional yogic principles accessible through thoughtful guidance, individualized attention, and practices that can become part of everyday life.',
    mantra: 'Yoga for the body. Calm for the mind. Awareness for the self.',
    disclaimer:
      'Disclaimer: Yoga is a complementary wellness practice and is not a substitute for medical diagnosis or treatment. Individual experiences and outcomes vary. Consult an appropriately qualified healthcare professional before beginning a yoga program if you have a medical condition, significant pain, an injury, or other health concerns.',
  },
};
