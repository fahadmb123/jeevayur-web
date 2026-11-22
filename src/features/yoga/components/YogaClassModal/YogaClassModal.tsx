import React, { useState, useMemo } from 'react';
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
  TIME_PRESETS,
  DURATION_PRESETS,
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

  const initialDuration = initialData?.duration || '60 mins';
  const isPresetDuration = (DURATION_PRESETS as readonly string[]).includes(initialDuration);

  const initialTime = initialData?.time || '06:30 AM - 07:30 AM';
  const isPresetTime = (TIME_PRESETS as readonly string[]).includes(initialTime);

  const defaultValues: YogaClassFormValues = {
    title: initialData?.title || '',
    format: initialData?.format || 'offline',
    duration: isPresetDuration ? initialDuration : 'custom',
    customDuration: isPresetDuration ? '' : initialDuration,
    time: isPresetTime ? initialTime : 'custom',
    customTime: isPresetTime ? '' : initialTime,
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
    formState: { errors, isDirty },
  } = useForm<YogaClassFormValues>({
    resolver: zodResolver(yogaClassSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const watchedValues = watch();
  const selectedFormat = watchedValues.format;
  const selectedDays = watchedValues.days || [];
  const selectedDuration = watchedValues.duration;
  const selectedTime = watchedValues.time;
  const currentPriceAmount = watchedValues.priceAmount;
  const currentPriceUnit = watchedValues.priceUnit;

  const hasChanges = useMemo(() => {
    if (!isEditing) return true;
    if ((watchedValues.title ?? '').trim() !== (defaultValues.title ?? '').trim()) return true;
    if (watchedValues.format !== defaultValues.format) return true;
    if (watchedValues.duration !== defaultValues.duration) return true;
    if (watchedValues.duration === 'custom' && (watchedValues.customDuration ?? '').trim() !== (defaultValues.customDuration ?? '').trim()) return true;
    if (watchedValues.time !== defaultValues.time) return true;
    if (watchedValues.time === 'custom' && (watchedValues.customTime ?? '').trim() !== (defaultValues.customTime ?? '').trim()) return true;
    if (watchedValues.suitableFor !== defaultValues.suitableFor) return true;
    if ((watchedValues.priceAmount ?? '').trim() !== (defaultValues.priceAmount ?? '').trim()) return true;
    if ((watchedValues.priceUnit ?? '').trim() !== (defaultValues.priceUnit ?? '').trim()) return true;
    if ((watchedValues.description ?? '').trim() !== (defaultValues.description ?? '').trim()) return true;

    const currentDays = watchedValues.days || [];
    const defaultDays = defaultValues.days || [];
    if (currentDays.length !== defaultDays.length) return true;
    const daysEqual = currentDays.every((d) => defaultDays.includes(d));
    if (!daysEqual) return true;

    return Boolean(isDirty);
  }, [isEditing, isDirty, watchedValues, defaultValues]);

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
      const rawAmount = values.priceAmount.trim();
      const normalizedAmount = /^\d+(\.\d{1,2})?$/.test(rawAmount)
        ? `₹${rawAmount}`
        : rawAmount;
      const computedPrice = formatPriceString(
        normalizedAmount,
        values.priceUnit
      );
      const normalizedUnit = values.priceUnit.trim().replace(/^per\s+/i, '');
      let resolvedDuration = values.duration;
      if (values.duration === 'custom') {
        const trimmed = (values.customDuration || '').trim();
        resolvedDuration = /mins?|hours?/i.test(trimmed) ? trimmed : `${trimmed} mins`;
      }
      const resolvedTime =
        values.time === 'custom'
          ? values.customTime?.trim() || '06:30 AM - 07:30 AM'
          : values.time;

      const payload: YogaFormData = {
        title: values.title.trim(),
        format: values.format,
        duration: resolvedDuration.trim(),
        time: resolvedTime,
        suitableFor: values.suitableFor.trim(),
        days: values.days,
        price: computedPrice,
        priceAmount: normalizedAmount,
        priceUnit: normalizedUnit,
        description: values.description.trim(),
        scheduleItems: values.days.map((day) => ({
          day,
          time: resolvedTime,
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
              className={`yoga-modal__format-btn ${selectedFormat === 'offline' ? 'active' : ''
                }`}
              onClick={() => handleFormatChange('offline')}
            >
              <MapPin size={16} />
              <span>Offline (In Shala)</span>
            </button>
            <button
              type="button"
              className={`yoga-modal__format-btn ${selectedFormat === 'online' ? 'active' : ''
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
            <label htmlFor="yoga-duration-select">
              Duration <span className="required">*</span>
            </label>
            <select
              id="yoga-duration-select"
              className={`yoga-modal__select ${errors.duration ? 'has-error' : ''}`}
              aria-invalid={Boolean(errors.duration)}
              {...register('duration')}
            >
              {DURATION_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
              <option value="custom">Custom / Enter manually...</option>
            </select>
            {errors.duration && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.duration.message}</span>
              </span>
            )}

            {selectedDuration === 'custom' && (
              <div className="yoga-modal__custom-time-wrap">
                <input
                  type="text"
                  className={`yoga-modal__input ${
                    errors.customDuration ? 'has-error' : ''
                  }`}
                  placeholder="e.g. 50 mins"
                  aria-label="Custom duration"
                  {...register('customDuration')}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'Minus') e.preventDefault();
                  }}
                />
                {errors.customDuration && (
                  <span className="yoga-modal__error-hint" role="alert">
                    <AlertCircle size={13} />
                    <span>{errors.customDuration.message}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="yoga-modal__field">
            <label htmlFor="yoga-time-select">
              Class Time / Schedule <span className="required">*</span>
            </label>
            <select
              id="yoga-time-select"
              className={`yoga-modal__select ${errors.time ? 'has-error' : ''}`}
              aria-invalid={Boolean(errors.time)}
              {...register('time')}
            >
              <optgroup label="Morning Practice">
                {TIME_PRESETS.slice(0, 5).map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Evening Practice">
                {TIME_PRESETS.slice(5).map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Manual Entry">
                <option value="custom">Custom / Enter manually...</option>
              </optgroup>
            </select>
            {errors.time && (
              <span className="yoga-modal__error-hint" role="alert">
                <AlertCircle size={13} />
                <span>{errors.time.message}</span>
              </span>
            )}

            {selectedTime === 'custom' && (
              <div className="yoga-modal__custom-time-wrap">
                <input
                  type="text"
                  className={`yoga-modal__input ${errors.customTime ? 'has-error' : ''
                    }`}
                  placeholder="e.g. 07:15 AM - 08:15 AM"
                  aria-label="Custom class time"
                  {...register('customTime')}
                />
                {errors.customTime && (
                  <span className="yoga-modal__error-hint" role="alert">
                    <AlertCircle size={13} />
                    <span>{errors.customTime.message}</span>
                  </span>
                )}
              </div>
            )}
          </div>
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

        <div className="yoga-modal__field">
          <label>
            Schedule Days (Monday to Sunday) <span className="required">*</span>
          </label>
          <div
            className={`yoga-modal__days-wrapper ${errors.days ? 'has-error' : ''
              }`}
          >
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`yoga-modal__day-toggle ${isSelected ? 'selected' : ''
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
              className={`yoga-modal__input ${errors.priceAmount ? 'has-error' : ''
                }`}
              placeholder="e.g. ₹500 or 500"
              aria-invalid={Boolean(errors.priceAmount)}
              {...register('priceAmount')}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'Minus') e.preventDefault();
              }}
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
              className={`yoga-modal__unit-input-wrap ${errors.priceUnit ? 'has-error' : ''
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
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'Minus') e.preventDefault();
                }}
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
            className={`yoga-modal__textarea ${errors.description ? 'has-error' : ''
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
            disabled={isSubmitting || (isEditing && !hasChanges)}
            aria-disabled={isSubmitting || (isEditing && !hasChanges)}
            title={isEditing && !hasChanges ? 'Make changes to update this class' : undefined}
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
