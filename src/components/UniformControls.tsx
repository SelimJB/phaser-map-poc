import React, { useState } from 'react';
import { uniformEvents } from '../phaser/services/uniformEvents';

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

const styles = {
  uniformControls: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 999,
    transform: 'translateX(0)'
  },
  uniformControlsHidden: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 999,
    transform: 'translateX(calc(100% + 20px))'
  },
  uniformContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '20px',
    borderRadius: '8px',
    width: '280px',
    color: 'white',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  uniformTitle: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    fontWeight: 'normal' as const,
    opacity: 0.9
  },
  uniformControlGroup: {
    marginBottom: '20px'
  },
  uniformControlHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    opacity: 0.8
  },
  uniformToggle: {
    position: 'absolute' as const,
    left: '-40px',
    top: '0',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    fontSize: '18px',
    zIndex: 1000
  },
  uniformSlider: {
    width: '100%',
    height: '2px',
    WebkitAppearance: 'none' as const,
    background: 'rgba(255, 255, 255, 0.2)',
    outline: 'none',
    opacity: 0.7,
    transition: 'opacity 0.2s',
    cursor: 'pointer'
  }
};

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
    <div style={isVisible ? styles.uniformControls : styles.uniformControlsHidden}>
      <button
        style={styles.uniformToggle}
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Hide controls' : 'Show controls'}
      >
        {isVisible ? '×' : '⚙'}
      </button>
      <div style={styles.uniformContainer}>
        <h3 style={styles.uniformTitle}>Render Settings</h3>
        {controls.map((control) => (
          <div key={control.uniform} style={styles.uniformControlGroup}>
            <div style={styles.uniformControlHeader}>
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
              style={styles.uniformSlider}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
