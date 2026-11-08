import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const BuggyChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error(
      'TypeError: Simulated view error for live preview. Real components gracefully trigger this recovery interface.'
    );
  }
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-primary)' }}>
      <p style={{ fontSize: '16px' }}>Child component rendered successfully.</p>
    </div>
  );
};

export const DevErrorPreview: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <ErrorBoundary onReset={() => setShouldThrow(false)}>
      <BuggyChild shouldThrow={shouldThrow} />
    </ErrorBoundary>
  );
};
