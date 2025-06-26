import { RenderMapEvent } from '@/phaser/map-engine/events/events';
import React, { useState } from 'react';
import { mapControlBridge } from '../phaser/map-engine/events/mapControlBridge';
import styles from '../style/UniformControls.module.css';

interface UniformControl {
  name: string;
  uniform: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

interface DebugButton {
  name: string;
  action: RenderMapEvent;
  icon?: string;
  description?: string;
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
  },
  {
    name: 'Visualization mode',
    uniform: 'uVisualitionMode',
    min: 0,
    max: 6,
    step: 1,
    defaultValue: 0
  }
];

const debugButtons: DebugButton[] = [
  {
    name: 'Reset Uniforms',
    action: RenderMapEvent.ResetUniforms,
    icon: '🔄',
    description: 'Reset all uniforms to default values'
  },
  {
    name: 'Shuffle Colors',
    action: RenderMapEvent.ShuffleColors,
    icon: '✨',
    description: 'Shuffle province colors'
  }
];

export const UniformControls: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(controls.map((c) => [c.uniform, c.defaultValue]))
  );
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (uniform: string, value: number) => {
    setValues((prev) => ({ ...prev, [uniform]: value }));
    mapControlBridge.emit('uniformChange', { uniform, value });
  };

  const handleDebugAction = (action: RenderMapEvent) => {
    if (action === RenderMapEvent.ResetUniforms) {
      const defaultValues = Object.fromEntries(controls.map((c) => [c.uniform, c.defaultValue]));
      setValues(defaultValues);
      controls.forEach((control) => {
        mapControlBridge.emit('uniformChange', {
          uniform: control.uniform,
          value: control.defaultValue
        });
      });
    } else {
      mapControlBridge.emit(action);
    }
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

        <div className={styles.debugSection}>
          <h4 className={styles.debugTitle}>Debug Controls</h4>
          <div className={styles.debugButtonGrid}>
            {debugButtons.map((button) => (
              <button
                key={button.action}
                className={styles.debugButton}
                onClick={() => handleDebugAction(button.action)}
                title={button.description}
              >
                {button.icon && <span className={styles.debugButtonIcon}>{button.icon}</span>}
                <span className={styles.debugButtonText}>{button.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
