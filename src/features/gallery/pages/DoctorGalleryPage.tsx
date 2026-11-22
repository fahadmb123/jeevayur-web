import React, { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Image as ImageIcon,
  Sparkles,
  Activity,
  Plus,
  Trash2,
  Pencil,
  Maximize2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import { AddGalleryModal } from '../components/AddGalleryModal';
import { GalleryLightboxModal } from '../components/GalleryLightboxModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal/DeleteConfirmModal';
import {
  DoctorSearchFilterStrip,
  type FilterPillConfig,
} from '@/shared/ui/DoctorSearchFilterStrip';
import './DoctorGalleryPage.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const DEFAULT_FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23112a20"/><stop offset="100%" stop-color="%231b6b50"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><circle cx="400" cy="220" r="70" fill="%232e9d77" opacity="0.35"/><path d="M400,160 C420,200 450,220 450,250 C450,277 427,300 400,300 C373,300 350,277 350,250 C350,220 380,200 400,160 Z" fill="%23c98d3b" opacity="0.85"/><text x="400" y="360" font-family="sans-serif" font-size="20" font-weight="600" fill="%23ffffff" text-anchor="middle" opacity="0.9">Jeevayurniketan Wellness Gallery</text></svg>';

export const DoctorGalleryPage: React.FC = React.memo(() => {
  const {
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalCount,
    yogaCount,
    treatmentCount,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    deleteConfirmItem,
    isDeleting,
    activeLightboxItem,
    setActiveLightboxItem,
    feedbackMessage,
    handleAddItem,
    handleEditItem,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleResetDefaults,
  } = useGallery();

  const filterPills = useMemo<FilterPillConfig[]>(
    () => [
      {
        id: 'all',
        label: 'All Images',
        count: totalCount,
        isActive: selectedCategory === 'all',
        onClick: () => setSelectedCategory('all'),
      },
      {
        id: 'yoga',
        label: 'Yoga Showcase',
        count: yogaCount,
        isActive: selectedCategory === 'yoga',
        onClick: () => setSelectedCategory('yoga'),
      },
      {
        id: 'treatment',
        label: 'Treatment Showcase',
        count: treatmentCount,
        isActive: selectedCategory === 'treatment',
        onClick: () => setSelectedCategory('treatment'),
      },
    ],
    [totalCount, yogaCount, treatmentCount, selectedCategory, setSelectedCategory]
  );

  return (
    <div className="doctor-page-content doctor-gallery-page">
      <div className="doctor-gallery-header">
        <div className="doctor-gallery-header__actions">
          <button
            type="button"
            className="doctor-gallery-btn-reset"
            onClick={handleResetDefaults}
            title="Reset gallery to default clinic imagery"
          >
            <RotateCcw size={16} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            className="doctor-gallery-btn-add"
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="doctor-gallery-page__feedback" role="alert">
          <CheckCircle2 size={16} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="doctor-gallery-kpis">
        <div className="doctor-gallery-kpi">
          <div className="doctor-gallery-kpi__icon doctor-gallery-kpi__icon--total">
            <ImageIcon size={22} />
          </div>
          <div className="doctor-gallery-kpi__info">
            <span className="doctor-gallery-kpi__value">{totalCount}</span>
            <span className="doctor-gallery-kpi__label">Total Media</span>
            <span className="doctor-gallery-kpi__sub">Clinic Showcase</span>
          </div>
        </div>

        <div className="doctor-gallery-kpi">
          <div className="doctor-gallery-kpi__icon doctor-gallery-kpi__icon--yoga">
            <Sparkles size={22} />
          </div>
          <div className="doctor-gallery-kpi__info">
            <span className="doctor-gallery-kpi__value">{yogaCount}</span>
            <span className="doctor-gallery-kpi__label">Yoga Sessions</span>
            <span className="doctor-gallery-kpi__sub">Asana & Dhyana</span>
          </div>
        </div>

        <div className="doctor-gallery-kpi">
          <div className="doctor-gallery-kpi__icon doctor-gallery-kpi__icon--treatment">
            <Activity size={22} />
          </div>
          <div className="doctor-gallery-kpi__info">
            <span className="doctor-gallery-kpi__value">{treatmentCount}</span>
            <span className="doctor-gallery-kpi__label">Clinical Treatments</span>
            <span className="doctor-gallery-kpi__sub">Therapeutic Care</span>
          </div>
        </div>
      </div>

      <DoctorSearchFilterStrip
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search images by title, treatment, or author..."
        pills={filterPills}
      />

      {filteredItems.length > 0 ? (
        <motion.div
          className="doctor-gallery-page__grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="doctor-gallery-card"
              variants={itemVariants}
              layout
            >
              <div
                className="doctor-gallery-card__image-container"
                onClick={() => setActiveLightboxItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="doctor-gallery-card__img"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }
                  }}
                />

                <div className="doctor-gallery-card__badges">
                  <span
                    className={`doctor-gallery-card__category-badge doctor-gallery-card__category-badge--${item.category}`}
                  >
                    {item.category === 'yoga' ? (
                      <>
                        <Sparkles size={12} />
                        <span>Yoga</span>
                      </>
                    ) : (
                      <>
                        <Activity size={12} />
                        <span>Treatment</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="doctor-gallery-card__hover-overlay">
                  <span className="doctor-gallery-card__zoom-action">
                    <Maximize2 size={16} />
                    <span>View Image</span>
                  </span>
                </div>
              </div>

              <div className="doctor-gallery-card__info">
                <div className="doctor-gallery-card__title-row">
                  <h3
                    className="doctor-gallery-card__title"
                    title={item.title}
                    onClick={() => setActiveLightboxItem(item)}
                  >
                    {item.title}
                  </h3>
                  <div className="doctor-gallery-card__actions">
                    <button
                      type="button"
                      className="doctor-gallery-card__edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(item);
                      }}
                      title="Edit image details"
                      aria-label={`Edit image ${item.title}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="doctor-gallery-card__delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(item.id, item.title);
                      }}
                      title="Remove image from cloud"
                      aria-label={`Remove image ${item.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="doctor-gallery-card__description" title={item.description}>
                    {item.description}
                  </p>
                )}

                <div className="doctor-gallery-card__footer-meta">
                  <span className="doctor-gallery-card__date">{item.createdAt}</span>
                  {item.author && (
                    <span className="doctor-gallery-card__author">{item.author}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="doctor-gallery-page__empty">
          <div className="doctor-gallery-page__empty-icon-wrap">
            <ImageIcon size={38} />
          </div>
          <h3 className="doctor-gallery-page__empty-title">No images found</h3>
          <p className="doctor-gallery-page__empty-desc">
            {searchQuery
              ? `No images match your search "${searchQuery}".`
              : selectedCategory !== 'all'
              ? `No images in the ${selectedCategory === 'yoga' ? 'Yoga' : 'Treatment'} showcase yet.`
              : 'Your clinic showcase gallery is currently empty.'}
          </p>
          <div className="doctor-gallery-page__empty-actions">
            {searchQuery && (
              <button
                type="button"
                className="doctor-gallery-page__empty-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              className="doctor-gallery-page__empty-add-btn"
              onClick={openAddModal}
            >
              <Plus size={16} />
              <span>
                Add to {selectedCategory === 'treatment' ? 'Treatment' : 'Yoga'}
              </span>
            </button>
          </div>
        </div>
      )}

      <AddGalleryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSave={async (data, id) => {
          if (id) {
            await handleEditItem(id, data);
          } else {
            await handleAddItem(data);
          }
        }}
        defaultCategory={selectedCategory === 'treatment' ? 'treatment' : 'yoga'}
        editingItem={editingItem}
      />

      <GalleryLightboxModal
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        onEdit={(item) => openEditModal(item)}
        onDelete={(id, title) => openDeleteModal(id, title)}
        canManage={true}
      />

      <DeleteConfirmModal
        isOpen={!!deleteConfirmItem}
        title={deleteConfirmItem?.title || ''}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
});

DoctorGalleryPage.displayName = 'DoctorGalleryPage';
