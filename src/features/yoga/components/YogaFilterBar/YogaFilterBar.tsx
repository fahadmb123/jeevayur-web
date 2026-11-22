import React from 'react';
import { Search, Plus } from 'lucide-react';
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
}) => {
  return (
    <div className="yoga-filter-bar">
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

          <button
            type="button"
            className="yoga-filter-bar__btn-add"
            onClick={onAddClick}
          >
            <Plus size={18} />
            <span>Schedule New Class</span>
          </button>
        </div>
      </div>

      <div className="yoga-filter-bar__days-strip" role="tablist">
        <button
          type="button"
          className={`yoga-filter-bar__day-chip ${selectedDay === 'All' ? 'active' : ''}`}
          onClick={() => onDaySelect('All')}
        >
          All Days (Weekly)
        </button>

        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            type="button"
            className={`yoga-filter-bar__day-chip ${selectedDay === day ? 'active' : ''}`}
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
