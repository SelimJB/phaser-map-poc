import { MapType } from '@/phaser/config';
import React, { useState, useEffect } from 'react';
import styles from '../style/MapSwitcher.module.css';

const MapSwitcher: React.FC = () => {
  const [currentMap, setCurrentMap] = useState<MapType>(MapType.EUROPA);

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

  const handleSwitchToEuropa = () => {
    if (window.switchMap) {
      window.switchMap(MapType.EUROPA);
      setCurrentMap(MapType.EUROPA);
    }
  };

  useEffect(() => {
    if (window.getCurrentMapType) {
      setCurrentMap(window.getCurrentMapType());
    }
  }, []);

  return (
    <div className={styles.container}>
      <button
        onClick={handleSwitchToSimple}
        className={`${styles.button} ${
          currentMap === MapType.SIMPLE ? styles.buttonActive : styles.buttonInactive
        }`}
      >
        Simple Map
      </button>
      <button
        onClick={handleSwitchToWorld}
        className={`${styles.button} ${
          currentMap === MapType.WORLD ? styles.buttonActive : styles.buttonInactive
        }`}
      >
        World Map
      </button>
      <button
        onClick={handleSwitchToEuropa}
        className={`${styles.button} ${
          currentMap === MapType.EUROPA ? styles.buttonActive : styles.buttonInactive
        }`}
      >
        Europa Map
      </button>
    </div>
  );
};

export default MapSwitcher;
