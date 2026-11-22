import { z } from 'zod';
import type { DayOfWeek } from '../types/yoga.types';

const DAY_OF_WEEK_VALUES: [DayOfWeek, ...DayOfWeek[]] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const yogaClassSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Yoga class name is required')
    .min(2, 'Class title must be at least 2 characters')
    .max(100, 'Class title must not exceed 100 characters'),
  format: z.enum(['offline', 'online']),
  duration: z
    .string()
    .trim()
    .min(1, 'Class duration is required')
    .max(50, 'Duration is too long'),
  suitableFor: z
    .string()
    .trim()
    .min(1, 'Target audience / suitability is required'),
  days: z
    .array(z.enum(DAY_OF_WEEK_VALUES))
    .min(1, 'Select at least one schedule day'),
  priceAmount: z
    .string()
    .trim()
    .min(1, 'Price / fee amount is required')
    .max(40, 'Price amount is too long'),
  priceUnit: z
    .string()
    .trim()
    .min(1, 'Billing unit is required (e.g. session, class, month)')
    .max(50, 'Billing unit is too long'),
  description: z
    .string()
    .trim()
    .min(1, 'Description and health benefits are required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
});

export type YogaClassFormValues = z.infer<typeof yogaClassSchema>;

export const parsePriceString = (
  priceStr?: string
): { amount: string; unit: string } => {
  if (!priceStr || !priceStr.trim()) {
    return { amount: '', unit: 'session' };
  }
  const clean = priceStr.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    const amountPart = parts[0]?.trim() || '';
    const unitPart =
      parts.slice(1).join('/').trim().replace(/^per\s+/i, '') || 'session';
    return {
      amount: amountPart,
      unit: unitPart,
    };
  }
  return {
    amount: clean,
    unit: 'session',
  };
};

export const formatPriceString = (amount: string, unit: string): string => {
  const cleanAmount = amount.trim();
  const cleanUnit = unit.trim().replace(/^per\s+/i, '');
  if (!cleanUnit) {
    return cleanAmount;
  }
  return `${cleanAmount} / ${cleanUnit}`;
};
