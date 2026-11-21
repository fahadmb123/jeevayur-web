import React from 'react';
import type { RequestFilterOption } from '../../types';
import './RequestFilterTabs.css';

export interface RequestFilterTabsProps {
  activeFilter: RequestFilterOption;
  onFilterChange: (filter: RequestFilterOption) => void;
  counts: {
    All: number;
    Pending: number;
    Accepted: number;
    Rejected: number;
  };
}

const TABS: RequestFilterOption[] = ['All', 'Pending', 'Accepted', 'Rejected'];

export const RequestFilterTabs: React.FC<RequestFilterTabsProps> = React.memo(({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="consult-filter-tabs" role="tablist">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab;
        const count = counts[tab];

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            className={`consult-filter-tab ${isActive ? 'consult-filter-tab--active' : ''} consult-filter-tab--${tab.toLowerCase()}`}
            onClick={() => onFilterChange(tab)}
          >
            <span className="consult-filter-tab__label">{tab}</span>
            <span className="consult-filter-tab__badge">{count}</span>
          </button>
        );
      })}
    </div>
  );
});

RequestFilterTabs.displayName = 'RequestFilterTabs';
export const ConsultationFilterTabs = RequestFilterTabs;
