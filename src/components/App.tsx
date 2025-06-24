import React from 'react';
import { UniformControls } from './UniformControls';

const App: React.FC = () => {
  return (
    <div style={{ pointerEvents: 'auto' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
        Hello ! (React)
        <UniformControls />
      </h1>
    </div>
  );
};

export default App;
