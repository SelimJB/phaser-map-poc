import React from 'react';
import MapSwitcher from './MapSwitcher';
import { UniformControls } from './uniform-controls';

const App: React.FC = () => {
  return (
    <div style={{ pointerEvents: 'auto' }}>
      <MapSwitcher />
      <UniformControls />
    </div>
  );
};

export default App;
