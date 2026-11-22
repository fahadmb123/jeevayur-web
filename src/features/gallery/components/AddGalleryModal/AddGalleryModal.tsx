import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Link as LinkIcon, Sparkles, Activity, AlertCircle, Check, Crop } from 'lucide-react';
import type { GalleryCategory, GalleryFormData, GalleryItem } from '../../types';
import { ImageCropperModal } from '../ImageCropperModal';
import './AddGalleryModal.css';

interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GalleryFormData, id?: string) => Promise<void>;
  defaultCategory?: GalleryCategory;
  editingItem?: GalleryItem | null;
}

export const AddGalleryModal: React.FC<AddGalleryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCategory = 'yoga',
  editingItem = null,
}) => {
  const [category, setCategory] = useState<GalleryCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [rawImageForCrop, setRawImageForCrop] = useState<string>('');
  const [originalFileName, setOriginalFileName] = useState<string>('gallery-upload.jpg');
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait' | 'square'>('landscape');
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setCategory(editingItem.category);
        setTitle(editingItem.title);
        setDescription(editingItem.description || '');
        setImageUrl(editingItem.imageUrl);
        setImagePreview(editingItem.imageUrl);
        setRawImageForCrop(editingItem.imageUrl);
        setAspectRatio('landscape');
        setSelectedFile(null);
        setUploadMode(editingItem.imageUrl.startsWith('/api/') ? 'file' : 'url');
      } else {
        setCategory(defaultCategory);
        setTitle('');
        setDescription('');
        setImageUrl('');
        setSelectedFile(null);
        setImagePreview('');
        setRawImageForCrop('');
        setAspectRatio('landscape');
        setUploadMode('file');
      }
      setOriginalFileName('gallery-upload.jpg');
      setIsCropperOpen(false);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultCategory, editingItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isCropperOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCropperOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be less than 2MB. Please select a smaller image.');
      return;
    }

    setError(null);
    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImageForCrop(reader.result);
        setImagePreview(reader.result);
        setSelectedFile(file);
        setIsCropperOpen(true);
        if (!title.trim()) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(cleanName);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropResult = (result: {
    file: File;
    dataUrl: string;
    aspectRatioType: 'landscape' | 'portrait' | 'square';
  }) => {
    setSelectedFile(result.file);
    setImagePreview(result.dataUrl);
    setAspectRatio(result.aspectRatioType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
    setRawImageForCrop(url);
    setError(null);
  };

  const hasChanges = Boolean(
    editingItem &&
      (category !== editingItem.category ||
        title.trim() !== editingItem.title.trim() ||
        (description || '').trim() !== (editingItem.description || '').trim() ||
        selectedFile !== null ||
        (uploadMode === 'url' && imageUrl.trim() !== (editingItem.imageUrl || '').trim()) ||
        (imagePreview !== editingItem.imageUrl && imagePreview.length > 0))
  );

  const isSubmitDisabled =
    isSubmitting ||
    !title.trim() ||
    (editingItem
      ? !hasChanges
      : uploadMode === 'file'
      ? !selectedFile && !imagePreview.trim()
      : !imageUrl.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    if (!title.trim()) {
      setError('Please enter an image title.');
      return;
    }

    if (uploadMode === 'file' && !selectedFile && !imagePreview.trim()) {
      setError('Please select an image file to upload.');
      return;
    }

    if (uploadMode === 'url' && !imageUrl.trim() && !imagePreview.trim()) {
      setError('Please enter an image URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSave({
        title: title.trim(),
        category,
        file: uploadMode === 'file' && selectedFile ? selectedFile : undefined,
        imageUrl: uploadMode === 'url' ? imageUrl.trim() : imagePreview || undefined,
        description: description.trim() || undefined,
        aspectRatio,
      }, editingItem?.id);
    } catch {
      setError('Failed to save image. Please check image data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="add-gallery-modal__overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div
          className="add-gallery-modal__container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="add-gallery-modal__header">
            <div className="add-gallery-modal__header-info">
              <h2 className="add-gallery-modal__title">
                {editingItem ? 'Edit Showcase Image' : 'Add Showcase Image'}
              </h2>
              <p className="add-gallery-modal__subtitle">
                {editingItem
                  ? 'Update image details or replace photo in Backblaze B2 cloud storage.'
                  : 'Publish photo assets to Yoga sessions or Clinical Ayurveda treatment showcases.'}
              </p>
            </div>
            <button
              type="button"
              className="add-gallery-modal__close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-gallery-modal__form">
            {error && (
              <div className="add-gallery-modal__error-banner" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="add-gallery-modal__field">
              <label className="add-gallery-modal__label">Showcase Category</label>
              <div className="add-gallery-modal__category-toggle">
                <button
                  type="button"
                  className={`add-gallery-modal__category-btn add-gallery-modal__category-btn--yoga ${
                    category === 'yoga' ? 'active' : ''
                  }`}
                  onClick={() => setCategory('yoga')}
                >
                  <Sparkles size={18} />
                  <div className="add-gallery-modal__category-text">
                    <span className="add-gallery-modal__category-name">Yoga Showcase</span>
                    <span className="add-gallery-modal__category-desc">Asanas, Pranayama & Meditation</span>
                  </div>
                  {category === 'yoga' && <Check size={16} className="add-gallery-modal__check-icon" />}
                </button>

                <button
                  type="button"
                  className={`add-gallery-modal__category-btn add-gallery-modal__category-btn--treatment ${
                    category === 'treatment' ? 'active' : ''
                  }`}
                  onClick={() => setCategory('treatment')}
                >
                  <Activity size={18} />
                  <div className="add-gallery-modal__category-text">
                    <span className="add-gallery-modal__category-name">Treatment Showcase</span>
                    <span className="add-gallery-modal__category-desc">Shirodhara, Abhyanga & Panchakarma</span>
                  </div>
                  {category === 'treatment' && <Check size={16} className="add-gallery-modal__check-icon" />}
                </button>
              </div>
            </div>

            <div className="add-gallery-modal__field">
              <div className="add-gallery-modal__field-header">
                <label className="add-gallery-modal__label">
                  Photo Asset <span className="add-gallery-modal__required">*</span>
                </label>
                <div className="add-gallery-modal__mode-toggle">
                  <button
                    type="button"
                    className={`add-gallery-modal__mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
                    onClick={() => setUploadMode('file')}
                  >
                    <UploadCloud size={14} />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    className={`add-gallery-modal__mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
                    onClick={() => setUploadMode('url')}
                  >
                    <LinkIcon size={14} />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {uploadMode === 'file' ? (
                <div
                  className={`add-gallery-modal__dropzone ${isDragging ? 'is-dragging' : ''} ${
                    imagePreview ? 'has-preview' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!imagePreview) fileInputRef.current?.click();
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="add-gallery-modal__file-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  {imagePreview ? (
                    <div className="add-gallery-modal__preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="add-gallery-modal__preview-img"
                      />
                      <div className="add-gallery-modal__crop-badge">
                        <span>16:10 STANDARD</span>
                      </div>
                      <div className="add-gallery-modal__preview-actions">
                        <button
                          type="button"
                          className="add-gallery-modal__action-pill add-gallery-modal__action-pill--crop"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCropperOpen(true);
                          }}
                        >
                          <Crop size={14} />
                          <span>Crop & Adjust</span>
                        </button>
                        <button
                          type="button"
                          className="add-gallery-modal__action-pill add-gallery-modal__action-pill--change"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          <UploadCloud size={14} />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="add-gallery-modal__dropzone-prompt">
                      <div className="add-gallery-modal__upload-icon-circle">
                        <UploadCloud size={24} />
                      </div>
                      <span className="add-gallery-modal__dropzone-title">
                        Choose an image or drag & drop here
                      </span>
                      <span className="add-gallery-modal__dropzone-hint">
                        High resolution JPG, PNG, WEBP up to 2MB. Built-in 16:10 cropper included.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="add-gallery-modal__url-input-wrap">
                  <div className="add-gallery-modal__input-with-icon">
                    <LinkIcon size={16} className="add-gallery-modal__field-icon" />
                    <input
                      type="url"
                      className="add-gallery-modal__input"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                    />
                  </div>
                  {imagePreview && (
                    <div className="add-gallery-modal__url-preview">
                      <img
                        src={imagePreview}
                        alt="URL Preview"
                        className="add-gallery-modal__url-preview-img"
                        onError={() => setError('Could not load image from the provided URL.')}
                      />
                      <button
                        type="button"
                        className="add-gallery-modal__crop-url-btn"
                        onClick={() => setIsCropperOpen(true)}
                      >
                        <Crop size={14} />
                        <span>Crop & Adjust URL Image</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="add-gallery-modal__field">
              <label htmlFor="gallery-title" className="add-gallery-modal__label">
                Image Title <span className="add-gallery-modal__required">*</span>
              </label>
              <input
                id="gallery-title"
                type="text"
                className="add-gallery-modal__input"
                placeholder="e.g. Shirodhara Rejuvenation Session"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="add-gallery-modal__field">
              <div className="add-gallery-modal__field-header">
                <label htmlFor="gallery-description" className="add-gallery-modal__label">
                  Description
                </label>
                <span className="add-gallery-modal__optional">Optional</span>
              </div>
              <textarea
                id="gallery-description"
                className="add-gallery-modal__textarea"
                placeholder="Provide context on therapeutic benefits, instructor name, or therapy equipment..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="add-gallery-modal__footer">
              <button
                type="button"
                className="add-gallery-modal__cancel-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`add-gallery-modal__submit-btn add-gallery-modal__submit-btn--${category}`}
                disabled={isSubmitDisabled}
                title={editingItem && !hasChanges ? 'Make changes before saving' : undefined}
              >
                {isSubmitting ? (
                  <span>{editingItem ? 'Saving Changes...' : 'Publishing...'}</span>
                ) : (
                  <>
                    <Check size={18} />
                    <span>
                      {editingItem
                        ? 'Save Changes'
                        : `Publish to ${category === 'yoga' ? 'Yoga' : 'Treatment'}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={rawImageForCrop || imagePreview}
        originalFileName={originalFileName}
        initialAspectRatioType={aspectRatio}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropResult}
      />
    </>
  );
};
