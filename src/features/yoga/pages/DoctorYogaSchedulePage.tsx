import React, { useMemo, useCallback } from 'react';
import {
  Sparkles,
  Plus,
  Video,
  MapPin,
  Calendar,
  CheckCircle2,
  Inbox,
} from 'lucide-react';
import { useYogaSchedule } from '../hooks/useYogaSchedule';
import { YogaClassCard } from '../components/YogaClassCard';
import { YogaClassModal } from '../components/YogaClassModal';
import { DeleteYogaConfirmModal } from '../components/DeleteYogaConfirmModal';
import { YogaClassCardSkeleton } from '../components/YogaScheduleSkeleton';
import { DAYS_OF_WEEK } from '../types/yoga.types';
import { DoctorSearchFilterStrip, type FilterSelectConfig } from '@/shared/ui';
import './DoctorYogaSchedulePage.css';

export const DoctorYogaSchedulePage: React.FC = React.memo(() => {
  const {
    sessions,
    filteredSessions,
    isLoading,
    error,
    selectedDay,
    setSelectedDay,
    selectedFormat,
    setSelectedFormat,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    editingSession,
    sessionToDelete,
    isDeleting,
    actionSuccessMessage,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveSession,
    handleDeleteSession,
    handleCancelDelete,
    handleConfirmDelete,
  } = useYogaSchedule();

  const totalClasses = sessions.length;
  const inShalaCount = useMemo(
    () => sessions.filter((s) => s.format === 'offline').length,
    [sessions]
  );
  const onlineCount = useMemo(
    () => sessions.filter((s) => s.format === 'online').length,
    [sessions]
  );

  const selectFilters: FilterSelectConfig[] = useMemo(() => [
    {
      id: 'format-filter',
      value: selectedFormat,
      ariaLabel: 'Filter by format',
      onChange: setSelectedFormat,
      options: [
        { label: 'All Formats', value: 'all' },
        { label: 'In Shala (Offline)', value: 'offline' },
        { label: 'Live Stream (Online)', value: 'online' },
      ],
    },
    {
      id: 'level-filter',
      value: selectedLevel,
      ariaLabel: 'Filter by level',
      onChange: setSelectedLevel,
      options: [
        { label: 'All Levels', value: 'all' },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
      ],
    },
  ], [selectedFormat, selectedLevel, setSelectedFormat, setSelectedLevel]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedLevel('all');
    setSelectedDay('All');
  }, [setSearchQuery, setSelectedFormat, setSelectedLevel, setSelectedDay]);

  const isFiltered = Boolean(
    searchQuery ||
    selectedFormat !== 'all' ||
    selectedLevel !== 'all' ||
    selectedDay !== 'All'
  );

  return (
    <>
      <div className="doctor-page-content">
        <div className="doctor-yoga-actions-bar">
          <button
            type="button"
            className="doctor-yoga-btn-add"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} />
            <span>Add Yoga Class</span>
          </button>
        </div>

        <div className="doctor-yoga-kpis">
          <div className="doctor-yoga-kpi">
            <div className="doctor-yoga-kpi__icon">
              <Calendar size={20} />
            </div>
            <div className="doctor-yoga-kpi__info">
              <span className="doctor-yoga-kpi__value">{totalClasses}</span>
              <span className="doctor-yoga-kpi__label">Active Classes</span>
            </div>
          </div>

          <div className="doctor-yoga-kpi">
            <div className="doctor-yoga-kpi__icon">
              <MapPin size={20} />
            </div>
            <div className="doctor-yoga-kpi__info">
              <span className="doctor-yoga-kpi__value">{inShalaCount}</span>
              <span className="doctor-yoga-kpi__label">In-Shala Sessions</span>
            </div>
          </div>

          <div className="doctor-yoga-kpi">
            <div className="doctor-yoga-kpi__icon">
              <Video size={20} />
            </div>
            <div className="doctor-yoga-kpi__info">
              <span className="doctor-yoga-kpi__value">{onlineCount}</span>
              <span className="doctor-yoga-kpi__label">Online Live Streams</span>
            </div>
          </div>

          <div className="doctor-yoga-kpi">
            <div className="doctor-yoga-kpi__icon">
              <Sparkles size={20} />
            </div>
            <div className="doctor-yoga-kpi__info">
              <span className="doctor-yoga-kpi__value">Mon - Sun</span>
              <span className="doctor-yoga-kpi__label">Weekly Schedule</span>
            </div>
          </div>
        </div>

        <div className="doctor-yoga-controls">
          <DoctorSearchFilterStrip
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search class by name, instructor, or target condition..."
            selectFilters={selectFilters}
            onReset={isFiltered ? handleResetFilters : undefined}
            resetTitle="Reset yoga filters"
          />

          <div className="doctor-yoga-days-track" role="tablist">
            <button
              type="button"
              className={`doctor-yoga-day-btn ${selectedDay === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedDay('All')}
            >
              All Days (Weekly)
            </button>

            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                className={`doctor-yoga-day-btn ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="doctor-yoga-grid" role="status" aria-label="Loading yoga schedule">
            <YogaClassCardSkeleton />
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {!isLoading && filteredSessions.length > 0 && (
          <div className="doctor-yoga-grid">
            {filteredSessions.map((session) => (
              <YogaClassCard
                key={session.id}
                session={session}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredSessions.length === 0 && (
          <div className="yoga-empty-state">
            <div className="yoga-empty-state__icon">
              <Inbox size={28} />
            </div>
            <h4>No Yoga Classes for this Filter</h4>
            <p>
              No classes match <strong>{selectedDay}</strong> (
              {selectedFormat === 'all' ? 'All formats' : selectedFormat}). Click below to add a
              new yoga class.
            </p>
            <button
              type="button"
              className="doctor-yoga-btn-add"
              onClick={handleOpenAddModal}
            >
              <Sparkles size={16} />
              <span>Add Yoga Class</span>
            </button>
          </div>
        )}
      </div>

      <YogaClassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSession}
        initialData={editingSession}
      />

      <DeleteYogaConfirmModal
        isOpen={Boolean(sessionToDelete)}
        title={sessionToDelete?.title || ''}
        isDeleting={isDeleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {actionSuccessMessage && (
        <div className="yoga-toast" role="status">
          <CheckCircle2 size={18} color="#C98D3B" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}
    </>
  );
});

DoctorYogaSchedulePage.displayName = 'DoctorYogaSchedulePage';
