import React, { useState } from 'react';
import { uniformEvents } from '../phaser/services/uniformEvents';
import './UniformControls.css';

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
    <div className={`uniform-controls ${!isVisible ? 'hidden' : ''}`}>
      <button
        className="uniform-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Hide controls' : 'Show controls'}
      >
        {isVisible ? '×' : '⚙'}
      </button>
      <div className="uniform-container">
        <h3 className="uniform-title">Render Settings</h3>
        {controls.map((control) => (
          <div key={control.uniform} className="uniform-control-group">
            <div className="uniform-control-header">
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
              className="uniform-slider"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
