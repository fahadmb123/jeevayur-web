export type YogaFormat = 'online' | 'offline';

export type YogaLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SUITABLE_FOR_OPTIONS = [
  'Beginner (All Ages)',
  'Intermediate (Adults 18-50)',
  'Advanced (Adults 18+)',
  'All Levels (All Ages)',
  'Gentle & Restorative (Seniors 50+)',
] as const;

export interface DayScheduleItem {
  day: DayOfWeek;
  time: string;
}

export interface YogaSession {
  id: string;
  title: string;
  duration: string;
  format: YogaFormat;
  suitableFor: string;
  days: DayOfWeek[];
  time?: string;
  scheduleItems?: DayScheduleItem[];
  description: string;
  level?: YogaLevel;
  ageGroup?: string;
  instructor?: string;
  location?: string;
  capacity?: number;
  enrolledCount?: number;
  price?: string;
  priceAmount?: string;
  priceUnit?: string;
  status?: 'active' | 'upcoming';
  imageUrl?: string;
}

export interface YogaFormData {
  title: string;
  duration: string;
  format: YogaFormat;
  suitableFor: string;
  days: DayOfWeek[];
  time?: string;
  scheduleItems?: DayScheduleItem[];
  description: string;
  level?: YogaLevel;
  ageGroup?: string;
  instructor?: string;
  location?: string;
  capacity?: number;
  price?: string;
  priceAmount?: string;
  priceUnit?: string;
  imageUrl?: string;
}
