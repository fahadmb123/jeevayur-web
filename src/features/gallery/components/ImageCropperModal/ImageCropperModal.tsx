import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Crop } from 'lucide-react';
import { getCroppedImg } from '../../utils/cropImage';
import './ImageCropperModal.css';

export type AspectRatioOption = {
  label: string;
  value: number;
  type: 'landscape' | 'portrait' | 'square';
};

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { label: '16:9 Landscape', value: 16 / 9, type: 'landscape' },
  { label: '4:3 Standard', value: 4 / 3, type: 'landscape' },
  { label: '1:1 Square', value: 1, type: 'square' },
  { label: '3:4 Portrait', value: 3 / 4, type: 'portrait' },
];

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  originalFileName?: string;
  initialAspectRatioType?: 'landscape' | 'portrait' | 'square';
  onClose: () => void;
  onCropComplete: (result: {
    file: File;
    dataUrl: string;
    aspectRatioType: 'landscape' | 'portrait' | 'square';
  }) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  originalFileName = 'gallery-upload.jpg',
  initialAspectRatioType = 'landscape',
  onClose,
  onCropComplete,
}) => {
  const defaultOption =
    ASPECT_RATIO_OPTIONS.find((opt) => opt.type === initialAspectRatioType) ||
    ASPECT_RATIO_OPTIONS[0];

  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(defaultOption);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleCropComplete = useCallback((_croppedArea: Area, pixelArea: Area) => {
    setCroppedAreaPixels(pixelArea);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const cropped = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        originalFileName
      );
      onCropComplete({
        file: cropped.file,
        dataUrl: cropped.dataUrl,
        aspectRatioType: selectedRatio.type,
      });
      onClose();
    } catch {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen) return null;

  return (
    <div
      className="image-cropper-modal__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="image-cropper-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-cropper-modal__header">
          <div className="image-cropper-modal__header-left">
            <div className="image-cropper-modal__icon-wrap">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="image-cropper-modal__title">Crop & Adjust Image</h3>
              <p className="image-cropper-modal__subtitle">
                Drag to reposition, use slider to zoom, and select your preferred ratio.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="image-cropper-modal__close-btn"
            onClick={onClose}
            aria-label="Close cropper"
          >
            <X size={20} />
          </button>
        </div>

        <div className="image-cropper-modal__crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={selectedRatio.value}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            showGrid={true}
          />
        </div>

        <div className="image-cropper-modal__controls">
          <div className="image-cropper-modal__ratio-group">
            <span className="image-cropper-modal__control-label">Aspect Ratio</span>
            <div className="image-cropper-modal__ratio-buttons">
              {ASPECT_RATIO_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`image-cropper-modal__ratio-btn ${
                    selectedRatio.label === option.label ? 'active' : ''
                  }`}
                  onClick={() => setSelectedRatio(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="image-cropper-modal__slider-group">
            <div className="image-cropper-modal__slider-row">
              <span className="image-cropper-modal__control-label">Zoom</span>
              <button
                type="button"
                className="image-cropper-modal__rotate-btn"
                onClick={handleRotate}
                title="Rotate 90 degrees"
              >
                <RotateCw size={14} />
                <span>Rotate</span>
              </button>
            </div>
            <div className="image-cropper-modal__slider-wrap">
              <ZoomOut size={16} className="image-cropper-modal__zoom-icon" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="image-cropper-modal__slider"
                aria-label="Image zoom slider"
              />
              <ZoomIn size={16} className="image-cropper-modal__zoom-icon" />
            </div>
          </div>
        </div>

        <div className="image-cropper-modal__footer">
          <button
            type="button"
            className="image-cropper-modal__cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="image-cropper-modal__apply-btn"
            onClick={handleApplyCrop}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>Applying...</span>
            ) : (
              <>
                <Check size={16} />
                <span>Apply Crop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
