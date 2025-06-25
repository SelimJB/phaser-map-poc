import { MapType } from '@/phaser/config';
import React, { useState, useEffect } from 'react';

const MapSwitcher: React.FC = () => {
  const [currentMap, setCurrentMap] = useState<MapType>(MapType.SIMPLE);

  const handleSwitchToSimple = () => {
    if (window.switchMap) {
      window.switchMap(MapType.SIMPLE);
      setCurrentMap(MapType.SIMPLE);
    }
  };

  const handleSwitchToWorld = () => {
    if (window.switchMap) {
      window.switchMap(MapType.WORLD);
      setCurrentMap(MapType.WORLD);
    }
  };

  useEffect(() => {
    if (window.getCurrentMapType) {
      setCurrentMap(window.getCurrentMapType());
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}
    >
      <button
        onClick={handleSwitchToSimple}
        style={{
          padding: '10px 20px',
          backgroundColor: currentMap === MapType.SIMPLE ? '#4CAF50' : '#666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        Simple Map
      </button>
      <button
        onClick={handleSwitchToWorld}
        style={{
          padding: '10px 20px',
          backgroundColor: currentMap === MapType.WORLD ? '#4CAF50' : '#666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        World Map
      </button>
    </div>
  );
};

export default MapSwitcher;
