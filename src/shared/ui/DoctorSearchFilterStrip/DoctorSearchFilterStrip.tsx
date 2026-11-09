import React from 'react';
import { Search, RotateCcw, X, ChevronDown, Loader2 } from 'lucide-react';
import './DoctorSearchFilterStrip.css';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  id: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export interface FilterPillConfig {
  id: string;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

export interface DoctorSearchFilterStripProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectFilters?: FilterSelectConfig[];
  onReset?: () => void;
  resetTitle?: string;
  pills?: FilterPillConfig[];
  className?: string;
  rightAction?: React.ReactNode;
  isLoading?: boolean;
}

export const DoctorSearchFilterStrip: React.FC<DoctorSearchFilterStripProps> = React.memo(({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  selectFilters = [],
  onReset,
  resetTitle = 'Reset filters',
  pills = [],
  className = '',
  rightAction,
  isLoading = false,
}) => {
  return (
    <div className={`doctor-search-filter-strip ${className}`.trim()}>
      <div className="doctor-search-filter-strip__top">
        <div className="doctor-search-filter-strip__search-wrap">
          {isLoading ? (
            <Loader2 size={16} className="doctor-search-filter-strip__search-icon doctor-search-spinner" />
          ) : (
            <Search size={16} className="doctor-search-filter-strip__search-icon" />
          )}
          <input
            type="text"
            className="doctor-search-filter-strip__search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              className="doctor-search-filter-strip__clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {(selectFilters.length > 0 || onReset || rightAction) && (
          <div className="doctor-search-filter-strip__filters">
            {selectFilters.map((filter) => (
              <div key={filter.id} className="doctor-search-filter-strip__select-wrapper">
                <select
                  className="doctor-search-filter-strip__select"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  aria-label={filter.ariaLabel || filter.id}
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="doctor-search-filter-strip__select-chevron" />
              </div>
            ))}

            {onReset && (
              <button
                type="button"
                className="doctor-search-filter-strip__reset-btn"
                onClick={onReset}
                title={resetTitle}
                aria-label={resetTitle}
              >
                <RotateCcw size={14} />
                <span className="doctor-search-filter-strip__reset-label">Reset</span>
              </button>
            )}

            {rightAction}
          </div>
        )}
      </div>

      {pills.length > 0 && (
        <>
          <div className="doctor-search-filter-strip__divider" />
          <div className="doctor-search-filter-strip__bottom">
            <div className="doctor-search-filter-strip__pills-track" role="tablist">
              {pills.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={pill.isActive}
                  className={`doctor-search-filter-strip__pill-btn ${pill.isActive ? 'active' : ''}`.trim()}
                  onClick={pill.onClick}
                >
                  <span>{pill.label}</span>
                  {pill.count !== undefined && (
                    <span className="doctor-search-filter-strip__pill-count">{pill.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

DoctorSearchFilterStrip.displayName = 'DoctorSearchFilterStrip';
