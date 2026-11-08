import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const BuggyChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error(
      'TypeError: Simulated view error for live preview. Real components gracefully trigger this recovery interface.'
    );
  }
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-primary)' }}>
      <p style={{ marginBottom: '16px', fontSize: '15px' }}>Child component rendered successfully.</p>
    </div>
  );
};

export const DevErrorPreview: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <ErrorBoundary onReset={() => setShouldThrow(false)}>
        <BuggyChild shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
};
