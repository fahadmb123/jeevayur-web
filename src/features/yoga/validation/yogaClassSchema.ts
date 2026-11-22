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

export const TIME_PRESETS = [
  '06:00 AM - 07:00 AM',
  '06:30 AM - 07:30 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:30 AM - 10:30 AM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '05:30 PM - 06:30 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
] as const;

export const DURATION_PRESETS = [
  '30 mins',
  '45 mins',
  '60 mins',
  '75 mins',
  '90 mins',
  '120 mins',
] as const;

export const yogaClassSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Yoga class name is required')
      .min(2, 'Class title must be at least 2 characters')
      .max(100, 'Class title must not exceed 100 characters')
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: 'Class title must contain valid text characters',
      }),
    format: z.enum(['offline', 'online']),
    duration: z
      .string()
      .trim()
      .min(1, 'Class duration is required'),
    customDuration: z.string().optional(),
    time: z
      .string()
      .trim()
      .min(1, 'Class time / schedule slot is required'),
    customTime: z.string().optional(),
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
      .max(40, 'Price amount is too long')
      .refine((val) => !val.includes('-'), {
        message: 'Price amount cannot be negative',
      })
      .refine(
        (val) => {
          const raw = val.replace(/^[₹$\s]+/, '').trim().toLowerCase();
          if (
            raw === 'free' ||
            raw === 'complimentary' ||
            raw === 'included' ||
            raw === '0'
          ) {
            return true;
          }
          const numeric = Number(raw.replace(/,/g, ''));
          return !isNaN(numeric) && numeric >= 0;
        },
        { message: 'Please enter a valid positive price (e.g. 500, ₹500, or Free)' }
      ),
    priceUnit: z
      .string()
      .trim()
      .min(1, 'Billing unit is required')
      .min(2, 'Billing unit must be at least 2 characters')
      .max(30, 'Billing unit is too long')
      .refine((val) => !val.includes('-'), {
        message: 'Billing unit cannot contain negative signs',
      })
      .refine(
        (val) => /^[a-zA-Z\s]+$/.test(val.replace(/^per\s+/i, '').trim()),
        {
          message:
            'Billing unit must contain only letters (e.g. session, class, month)',
        }
      ),
    description: z
      .string()
      .trim()
      .min(1, 'Description and health benefits are required')
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must not exceed 1000 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.duration === 'custom') {
      if (!data.customDuration || !data.customDuration.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customDuration'],
          message: 'Please enter the custom duration (e.g. 50 mins)',
        });
      } else if (data.customDuration.includes('-')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customDuration'],
          message: 'Duration cannot be negative',
        });
      } else {
        const num = parseInt(data.customDuration.replace(/[^\d-]/g, ''), 10);
        if (isNaN(num) || num <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['customDuration'],
            message: 'Enter a valid positive duration in minutes (e.g. 50 mins)',
          });
        } else if (num > 480) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['customDuration'],
            message: 'Duration cannot exceed 480 minutes (8 hours)',
          });
        }
      }
    }
    if (data.time === 'custom') {
      if (!data.customTime || !data.customTime.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customTime'],
          message: 'Please enter the custom class time (e.g. 07:15 AM - 08:15 AM)',
        });
      } else if (data.customTime.trim().length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customTime'],
          message: 'Custom time must be at least 4 characters',
        });
      }
    }
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
