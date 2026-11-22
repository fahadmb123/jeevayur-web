import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Video, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import type {
  YogaSession,
  YogaFormData,
  DayOfWeek,
  YogaFormat,
} from '../../types/yoga.types';
import { DAYS_OF_WEEK, SUITABLE_FOR_OPTIONS } from '../../types/yoga.types';
import {
  yogaClassSchema,
  type YogaClassFormValues,
  parsePriceString,
  formatPriceString,
} from '../../validation/yogaClassSchema';
import './YogaClassModal.css';

interface YogaClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YogaFormData) => Promise<void>;
  initialData?: YogaSession | null;
}

const DURATION_PRESETS = [
  '45 mins',
  '60 mins',
  '75 mins',
  '90 mins',
  '120 mins',
];

interface FormContentProps {
  initialData?: YogaSession | null;
  onClose: () => void;
  onSave: (data: YogaFormData) => Promise<void>;
}

const YogaClassFormContent: React.FC<FormContentProps> = ({
  initialData,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceParsed = parsePriceString(initialData?.price);

  const defaultValues: YogaClassFormValues = {
    title: initialData?.title || '',
    format: initialData?.format || 'offline',
    duration: initialData?.duration || '60 mins',
    suitableFor: initialData?.suitableFor || SUITABLE_FOR_OPTIONS[0],
    days: initialData?.days || ['Monday', 'Wednesday', 'Friday'],
    priceAmount: initialData?.priceAmount || priceParsed.amount || '500',
    priceUnit:
      initialData?.priceUnit?.replace(/^per\s+/i, '') ||
      priceParsed.unit ||
      'session',
    description: initialData?.description || '',
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<YogaClassFormValues>({
    resolver: zodResolver(yogaClassSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const selectedFormat = watch('format');
  const selectedDays = watch('days') || [];
  const currentPriceAmount = watch('priceAmount');
  const currentPriceUnit = watch('priceUnit');

  const handleFormatChange = (format: YogaFormat) => {
    setValue('format', format, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDayToggle = (day: DayOfWeek) => {
    const exists = selectedDays.includes(day);
    const updated = exists
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setValue('days', updated, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleFormSubmit = async (values: YogaClassFormValues) => {
    try {
      setIsSubmitting(true);
      const computedPrice = formatPriceString(
        values.priceAmount,
        values.priceUnit
      );
      const normalizedUnit = values.priceUnit.trim().replace(/^per\s+/i, '');
      const payload: YogaFormData = {
        title: values.title.trim(),
        format: values.format,
        duration: values.duration.trim(),
        suitableFor: values.suitableFor.trim(),
        days: values.days,
        price: computedPrice,
        priceAmount: values.priceAmount.trim(),
        priceUnit: normalizedUnit,
        description: values.description.trim(),
        scheduleItems: values.days.map((day) => ({
          day,
          time: initialData?.time || '06:30 AM - 07:30 AM',
        })),
      };
      await onSave(payload);
    } catch (err) {
      console.error('Failed to submit yoga class form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="yoga-modal" role="dialog" aria-modal="true">
      <div className="yoga-modal__header">
        <div className="yoga-modal__title-group">
          <h3>{isEditing ? 'Edit Yoga Class Schedule' : 'Add New Yoga Class'}</h3>
          <p>Configure Asana, Pranayama & Meditation clinical programs</p>
        </div>
        <button
          type="button"
          className="yoga-modal__close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="yoga-modal__form"
        noValidate
      >
        <div className="yoga-modal__field">
          <label htmlFor="yoga-title">
            Yoga Class Name <span className="required">*</span>
          </label>
          <input
            id="yoga-title"
            type="text"
            className={`yoga-modal__input ${errors.title ? 'has-error' : ''}`}
            placeholder="e.g. Hatha Yoga & Pranayama"
            aria-invalid={Boolean(errors.title)}
            {...register('title')}
          />
          {errors.title && (
            <span className="yoga-modal__error-hint" role="alert">
              <AlertCircle size={13} />
              <span>{errors.title.message}</span>
            </span>
          )}
        </div>

        <div className="yoga-modal__field">
          <label>
            Format <span className="required">*</span>
          </label>
          <div className="yoga-modal__format-group">
            <button
              type="button"
              className={`yoga-modal__format-btn ${
                selectedFormat === 'offline' ? 'active' : ''
              }`}
              onClick={() => handleFormatChange('offline')}
            >
              <MapPin size={16} />
              <span>Offline (In Shala)</span>
            </button>
            <button
              type="button"
              className={`yoga-modal__format-btn ${
                selectedFormat === 'online' ? 'active' : ''
              }`}
              onClick={() => handleFormatChange('online')}
            >
              <Video size={16} />
              <span>Online (Live Stream)</span>
            </button>
          </div>
          {errors.format && (
            <span className="yoga-modal__error-hint" role="alert">
              <AlertCircle size={13} />
              <span>{errors.format.message}</span>
            </span>
          )}
        </div>

        <div className="yoga-modal__grid-2">
          <div className="yoga-modal__field">
            <label htmlFor="yoga-duration">
              Duration <span className="required">*</span>
            </label>
            <input
              id="yoga-duration"
              type="text"
              list="duration-list"
              className={`yoga-modal__input ${errors.duration ? 'has-error' : ''}`}
              placeholder="e.g. 60 mins"
              aria-invalid={Boolean(errors.duration)}
              {...register('duration')}
            />
            <datalist id="duration-list">
              {DURATION_PRESETS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            {errors.duration && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.duration.message}</span>
              </span>
            )}
          </div>

          <div className="yoga-modal__field">
            <label htmlFor="yoga-suitable">
              Suitable For <span className="required">*</span>
            </label>
            <select
              id="yoga-suitable"
              className={`yoga-modal__select ${errors.suitableFor ? 'has-error' : ''}`}
              aria-invalid={Boolean(errors.suitableFor)}
              {...register('suitableFor')}
            >
              {SUITABLE_FOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.suitableFor && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.suitableFor.message}</span>
              </span>
            )}
          </div>
        </div>

        <div className="yoga-modal__field">
          <label>
            Schedule Days (Monday to Sunday) <span className="required">*</span>
          </label>
          <div
            className={`yoga-modal__days-wrapper ${
              errors.days ? 'has-error' : ''
            }`}
          >
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`yoga-modal__day-toggle ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleDayToggle(day)}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
          {errors.days && (
            <span className="yoga-modal__error-hint" role="alert">
              <AlertCircle size={13} />
              <span>{errors.days.message}</span>
            </span>
          )}
        </div>

        <div className="yoga-modal__grid-2">
          <div className="yoga-modal__field">
            <label htmlFor="yoga-price-amount">
              Fee / Price Amount <span className="required">*</span>
            </label>
            <input
              id="yoga-price-amount"
              type="text"
              className={`yoga-modal__input ${
                errors.priceAmount ? 'has-error' : ''
              }`}
              placeholder="e.g. ₹500 or 500"
              aria-invalid={Boolean(errors.priceAmount)}
              {...register('priceAmount')}
            />
            {errors.priceAmount && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.priceAmount.message}</span>
              </span>
            )}
          </div>

          <div className="yoga-modal__field">
            <label htmlFor="yoga-price-unit">
              Billing Frequency / Unit <span className="required">*</span>
            </label>
            <div
              className={`yoga-modal__unit-input-wrap ${
                errors.priceUnit ? 'has-error' : ''
              }`}
            >
              <span className="yoga-modal__unit-prefix">per</span>
              <input
                id="yoga-price-unit"
                type="text"
                className="yoga-modal__unit-field"
                placeholder="session, class, month"
                aria-invalid={Boolean(errors.priceUnit)}
                {...register('priceUnit')}
              />
            </div>
            {errors.priceUnit && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.priceUnit.message}</span>
              </span>
            )}
          </div>
        </div>

        {currentPriceAmount && currentPriceUnit && !errors.priceAmount && !errors.priceUnit && (
          <div className="yoga-modal__price-preview">
            <span className="yoga-modal__price-preview-label">Displayed Fee:</span>
            <span className="yoga-modal__price-preview-value">
              {formatPriceString(currentPriceAmount, currentPriceUnit)}
            </span>
          </div>
        )}

        <div className="yoga-modal__field">
          <label htmlFor="yoga-desc">
            Description & Health Benefits <span className="required">*</span>
          </label>
          <textarea
            id="yoga-desc"
            rows={3}
            className={`yoga-modal__textarea ${
              errors.description ? 'has-error' : ''
            }`}
            placeholder="Describe postures, breathing techniques, and therapeutic benefits..."
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          {errors.description && (
            <span className="yoga-modal__error-hint" role="alert">
              <AlertCircle size={13} />
              <span>{errors.description.message}</span>
            </span>
          )}
        </div>

        <div className="yoga-modal__footer">
          <button
            type="button"
            className="yoga-modal__btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="yoga-modal__btn-submit"
            disabled={isSubmitting}
          >
            <Sparkles size={16} />
            <span>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Update Yoga Class'
                : 'Add Yoga Class'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const YogaClassModal: React.FC<YogaClassModalProps> = React.memo(
  ({ isOpen, onClose, onSave, initialData }) => {
    if (!isOpen) return null;

    return (
      <div className="yoga-modal-backdrop">
        <YogaClassFormContent
          key={initialData?.id || 'new'}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    );
  }
);

YogaClassModal.displayName = 'YogaClassModal';
