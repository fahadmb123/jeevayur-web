import React from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../types/yoga.types';
import './YogaFilterBar.css';

interface YogaFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDay: string;
  onDaySelect: (day: string) => void;
  selectedFormat: string;
  onFormatSelect: (format: string) => void;
  selectedLevel: string;
  onLevelSelect: (level: string) => void;
  onAddClick: () => void;
  onResetDefaults?: () => void;
}

export const YogaFilterBar: React.FC<YogaFilterBarProps> = React.memo(({
  searchQuery,
  onSearchChange,
  selectedDay,
  onDaySelect,
  selectedFormat,
  onFormatSelect,
  selectedLevel,
  onLevelSelect,
  onAddClick,
  onResetDefaults,
}) => {
  return (
    <div className="yoga-filter-bar">
      {/* Top Search, Filter Selectors & Add Button */}
      <div className="yoga-filter-bar__top-row">
        <div className="yoga-filter-bar__search-wrap">
          <Search size={18} className="yoga-filter-bar__search-icon" />
          <input
            type="text"
            className="yoga-filter-bar__search-input"
            placeholder="Search by practice, instructor, or condition (e.g. Back Pain, Pranayama)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="yoga-filter-bar__selectors">
          {/* Format Select */}
          <select
            className="yoga-filter-bar__select"
            value={selectedFormat}
            onChange={(e) => onFormatSelect(e.target.value)}
            aria-label="Filter by format"
          >
            <option value="all">All Formats</option>
            <option value="offline">In Shala (Offline)</option>
            <option value="online">Live Stream (Online)</option>
          </select>

          {/* Level Select */}
          <select
            className="yoga-filter-bar__select"
            value={selectedLevel}
            onChange={(e) => onLevelSelect(e.target.value)}
            aria-label="Filter by level"
          >
            <option value="all">All Practice Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>

          {onResetDefaults && (
            <button
              type="button"
              className="yoga-card__btn-edit"
              onClick={onResetDefaults}
              title="Reset sample classes"
            >
              <RotateCcw size={15} />
            </button>
          )}

          {/* Add Session CTA */}
          <button
            type="button"
            className="yoga-filter-bar__btn-add"
            onClick={onAddClick}
          >
            <Plus size={18} />
            <span>Add Yoga Class</span>
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Filter Strip */}
      <div className="yoga-filter-bar__days-track" role="tablist" aria-label="Filter by day of week">
        <button
          type="button"
          role="tab"
          aria-selected={selectedDay === 'All'}
          className={`yoga-filter-bar__day-btn ${selectedDay === 'All' ? 'active' : ''}`}
          onClick={() => onDaySelect('All')}
        >
          All Days (Weekly)
        </button>

        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={selectedDay === day}
            className={`yoga-filter-bar__day-btn ${selectedDay === day ? 'active' : ''}`}
            onClick={() => onDaySelect(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
});

YogaFilterBar.displayName = 'YogaFilterBar';
