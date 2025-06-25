import React, { useState } from 'react';
import { uniformEvents } from '../phaser/services/uniformEvents';
import styles from '../style/UniformControls.module.css';

interface UniformControl {
  name: string;
  uniform: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

const controls: UniformControl[] = [
  {
    name: 'Contrast',
    uniform: 'uContrast',
    min: 0,
    max: 5,
    step: 0.1,
    defaultValue: 3.2
  },
  {
    name: 'Middle gray',
    uniform: 'uMiddleGray',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.65
  },
  {
    name: 'Border map opacity',
    uniform: 'uBorderMapOpacity',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1
  },
  {
    name: 'Hover blend factor',
    uniform: 'uHoverBlendFactor',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1
  },
  {
    name: 'Glow intensity',
    uniform: 'uGlowIntensity',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1
  },
  {
    name: 'Glow radius',
    uniform: 'uGlowRadius',
    min: 0,
    max: 0.05,
    step: 0.01,
    defaultValue: 0.02
  },
  {
    name: 'Glow pulsation radius',
    uniform: 'uGlowPulsationRadius',
    min: 0,
    max: 0.05,
    step: 0.01,
    defaultValue: 0.02
  }
];

export const UniformControls: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(controls.map((c) => [c.uniform, c.defaultValue]))
  );
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (uniform: string, value: number) => {
    setValues((prev) => ({ ...prev, [uniform]: value }));
    uniformEvents.emit('uniformChange', { uniform, value });
  };

  return (
    <div className={isVisible ? styles.uniformControls : styles.uniformControlsHidden}>
      <button
        className={styles.uniformToggle}
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Hide controls' : 'Show controls'}
      >
        {isVisible ? '×' : '⚙'}
      </button>
      <div className={styles.uniformContainer}>
        <h3 className={styles.uniformTitle}>Render Settings</h3>
        {controls.map((control) => (
          <div key={control.uniform} className={styles.uniformControlGroup}>
            <div className={styles.uniformControlHeader}>
              <span>{control.name}</span>
              <span>{values[control.uniform].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={values[control.uniform]}
              onChange={(e) => handleChange(control.uniform, parseFloat(e.target.value))}
              className={styles.uniformSlider}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
