import React from 'react';
import {
  Sparkles,
  Plus,
  Search,
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
  const inShalaCount = React.useMemo(
    () => sessions.filter((s) => s.format === 'offline').length,
    [sessions]
  );
  const onlineCount = React.useMemo(
    () => sessions.filter((s) => s.format === 'online').length,
    [sessions]
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
          <div className="doctor-yoga-controls__top">
            <div className="doctor-yoga-search-wrap">
              <Search size={18} className="doctor-yoga-search-icon" />
              <input
                type="text"
                className="doctor-yoga-search-input"
                placeholder="Search class by name, instructor, or target condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="doctor-yoga-filters">
              <select
                className="doctor-yoga-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                aria-label="Filter format"
              >
                <option value="all">All Formats</option>
                <option value="offline">In Shala (Offline)</option>
                <option value="online">Live Stream (Online)</option>
              </select>

              <select
                className="doctor-yoga-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                aria-label="Filter level"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

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
