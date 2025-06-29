import { DebugMapEvent, RenderMapEvent } from '@/phaser/map-engine/events/events';
import React, { useState, useEffect, useRef } from 'react';
import { controls, VisualizationModesNames } from './controlsConfig';
import { ControlType, TitleLevel, Control, SliderControl, ToggleControl } from './types';
import styles from './UniformControls.module.css';
import { mapControlBridge } from '../../phaser/map-engine/events/mapControlBridge';
import { MapUniformsBase } from '../../phaser/map-engine/types';

export const UniformControls: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(
      controls
        .filter((c): c is SliderControl => c.type === ControlType.SLIDER)
        .map((c) => [c.uniform, c.defaultValue])
    )
  );
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>(
    Object.fromEntries(
      controls
        .filter((c): c is ToggleControl => c.type === ControlType.TOGGLE)
        .map((c) => [c.uniform, c.defaultValue])
    )
  );
  const [isVisible, setIsVisible] = useState(true);
  const [scrollIndicator, setScrollIndicator] = useState({ show: false, top: 0, height: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUniformReset = (defaultUniforms: MapUniformsBase) => {
      const newValues = Object.fromEntries(
        controls
          .filter((c): c is SliderControl => c.type === ControlType.SLIDER)
          .map((c) => [
            c.uniform,
            (defaultUniforms[c.uniform as keyof MapUniformsBase] as number) ?? c.defaultValue
          ])
      );
      setValues(newValues);

      const newToggleValues = Object.fromEntries(
        controls
          .filter((c): c is ToggleControl => c.type === ControlType.TOGGLE)
          .map((c) => [
            c.uniform,
            (defaultUniforms[c.uniform as keyof MapUniformsBase] as boolean) ?? c.defaultValue
          ])
      );
      setToggleValues(newToggleValues);
    };

    mapControlBridge.addHandler(RenderMapEvent.ResetUniforms, handleUniformReset);

    return () => {
      mapControlBridge.removeHandler(RenderMapEvent.ResetUniforms, handleUniformReset);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollIndicator = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const hasScroll = scrollHeight > clientHeight;

      if (!hasScroll) {
        setScrollIndicator({ show: false, top: 0, height: 0 });
        return;
      }

      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      const trackHeight = clientHeight - 40;
      const thumbHeight = Math.max(20, (clientHeight / scrollHeight) * trackHeight);
      const thumbTop = scrollPercentage * (trackHeight - thumbHeight);

      setScrollIndicator({
        show: true,
        top: thumbTop,
        height: thumbHeight
      });
    };

    const handleScroll = () => {
      updateScrollIndicator();
      setIsScrolling(true);

      const timeoutId = setTimeout(() => setIsScrolling(false), 1000);
      return () => clearTimeout(timeoutId);
    };

    container.addEventListener('scroll', handleScroll);

    updateScrollIndicator();

    const resizeObserver = new ResizeObserver(updateScrollIndicator);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const handleChange = (uniform: string, value: number) => {
    setValues((prev) => ({ ...prev, [uniform]: value }));
    mapControlBridge.emit('uniformChange', { uniform, value });
  };

  const handleToggleChange = (uniform: string, value: boolean) => {
    setToggleValues((prev) => ({ ...prev, [uniform]: value }));
    mapControlBridge.emit('uniformChange', { uniform, value });
  };

  const handleDebugAction = (action: RenderMapEvent | DebugMapEvent) => {
    mapControlBridge.emit(action);
  };

  const renderControl = (control: Control, index: number) => {
    switch (control.type) {
      case ControlType.TITLE: {
        const TitleTag = control.level || TitleLevel.H4;
        return (
          <TitleTag key={`title-${index}`} className={styles.sectionTitle}>
            {control.name}
          </TitleTag>
        );
      }

      case ControlType.SLIDER:
        return (
          <div key={control.uniform} className={styles.uniformControlGroup}>
            <div className={styles.uniformControlHeader}>
              <span>
                {control.name}
                {control.description && (
                  <span
                    className={styles.infoIcon}
                    onMouseEnter={() => setActiveTooltip(control.uniform)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    ?
                  </span>
                )}
                {control.uniform === 'uVisualizationMode' && (
                  <span className={styles.visualizationMode}>
                    :{' '}
                    {
                      VisualizationModesNames[
                        values[control.uniform] as keyof typeof VisualizationModesNames
                      ]
                    }
                  </span>
                )}
              </span>
              <span>{values[control.uniform].toFixed(control.step < 1 ? 2 : 0)}</span>
            </div>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={values[control.uniform]}
                onChange={(e) => handleChange(control.uniform, parseFloat(e.target.value))}
                className={styles.uniformSlider}
              />
              {activeTooltip === control.uniform && control.description && (
                <div className={`${styles.tooltip} ${styles.visible}`}>{control.description}</div>
              )}
            </div>
          </div>
        );

      case ControlType.TOGGLE:
        return (
          <div key={control.uniform} className={styles.toggleControlGroup}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={toggleValues[control.uniform]}
                onChange={(e) => handleToggleChange(control.uniform, e.target.checked)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleText}>
                {control.name}
                {control.description && (
                  <span className={styles.toggleDescription}>{control.description}</span>
                )}
              </span>
            </label>
          </div>
        );

      case ControlType.BUTTON:
        return (
          <button
            key={`button-${index}`}
            className={styles.debugButton}
            onClick={() => handleDebugAction(control.action)}
            title={control.description}
          >
            {control.icon && <span className={styles.debugButtonIcon}>{control.icon}</span>}
            <span className={styles.debugButtonText}>{control.name}</span>
          </button>
        );
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
        <div ref={containerRef} className={styles.controlsContainer}>
          {controls
            .sort((a, b) => a.order - b.order)
            .map((control, index) => renderControl(control, index))}
        </div>

        {scrollIndicator.show && (
          <>
            <div className={styles.scrollIndicator} />
            <div
              className={`${styles.scrollThumb} ${isScrolling ? styles.active : ''}`}
              style={{
                top: `${60 + scrollIndicator.top}px`,
                height: `${scrollIndicator.height}px`
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
