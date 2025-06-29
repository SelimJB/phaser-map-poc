import { DebugMapEvent, RenderMapEvent } from '@/phaser/map-engine/events/events';
import { VisualizationModes } from '@/phaser/map-engine/types/uniforms';
import { ControlType, TitleLevel, Control } from './types';

export const VisualizationModesNames = {
  [VisualizationModes.Shader]: 'Shader',
  [VisualizationModes.Bitmap]: 'Bitmap',
  [VisualizationModes.Plain]: 'Plain',
  [VisualizationModes.Colors]: 'Colors',
  [VisualizationModes.Borders]: 'Borders',
  [VisualizationModes.BitmapFX]: 'Bitmap FX',
  [VisualizationModes.Debug]: 'Debug',
  [VisualizationModes.Gray]: 'Gray'
} as const;

export const controls: Control[] = [
  {
    type: ControlType.TITLE,
    name: 'Configuration des Effets',
    order: 1,
    level: TitleLevel.H3
  },
  {
    type: ControlType.TITLE,
    name: 'Coloration & Balance',
    order: 3,
    level: TitleLevel.H4
  },
  {
    type: ControlType.SLIDER,
    name: 'Blend Factor',
    uniform: 'uBlendFactor',
    description:
      'Controls the overall intensity of shader effects. At 0, only the base map is visible (no effects). At 1, all shader effects are applied at full strength.',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.81,
    order: 3
  },
  {
    type: ControlType.SLIDER,
    name: 'Contrast',
    uniform: 'uContrast',
    description:
      'Adjusts the contrast of the grayscale map which controls the visibility of terrain details (trees, mountains, rivers). Use the ⬜ Display Grayscale Shader option to better visualize the effect of this setting.',
    min: 0,
    max: 5,
    step: 0.1,
    defaultValue: 3.2,
    order: 3
  },
  {
    type: ControlType.SLIDER,
    name: 'Middle gray',
    uniform: 'uMiddleGray',
    description:
      'Sets the reference point for contrast adjustment. Details darker than this value will be darkened, while details brighter will be brightened. Use with the Contrast slider to fine-tune terrain detail visibility.',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.65,
    order: 3
  },
  {
    type: ControlType.SLIDER,
    name: 'Grayscale Blend Factor',
    uniform: 'uGrayscaleBlendFactor',
    description:
      'Controls the intensity of the grayscale effect. At 0, the grayscale effect is completely off. At 1, the grayscale effect is fully applied.',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 1,
    order: 3
  },
  {
    type: ControlType.BUTTON,
    name: 'Display Map Shader',
    action: DebugMapEvent.DisplayMapShader,
    icon: '🗺️',
    description: 'Display the map shader',
    order: 4
  },
  {
    type: ControlType.BUTTON,
    name: 'Display Grayscale Shader',
    action: DebugMapEvent.DisplayGrayscaleShader,
    icon: '⬜',
    description: 'Display the grayscale shader',
    order: 4
  },
  {
    type: ControlType.SLIDER,
    name: 'Border Map Opacity',
    uniform: 'uBorderMapOpacity',
    description: 'Controls the opacity of the border map.',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 1,
    order: 4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Use Colored Borders',
    uniform: 'uUseColoredBorders',
    defaultValue: false,
    description: 'Use colored borders for provinces',
    order: 4
  },
  {
    type: ControlType.TITLE,
    name: 'Hover',
    order: 4,
    level: TitleLevel.H4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Enable Hover',
    uniform: 'uEnableHover',
    defaultValue: true,
    description: 'Enable hover effects on provinces',
    order: 4
  },
  {
    type: ControlType.SLIDER,
    name: 'Hover Blend Factor',
    uniform: 'uHoverBlendFactor',
    description:
      'Controls the intensity of the hover effect. At 0, the hover effect is completely off. At 1, the hover effect is fully applied.',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.9,
    order: 4
  },
  {
    type: ControlType.SLIDER,
    name: 'Hover Grayscale Blend Factor',
    uniform: 'uHoverGrayscaleBlendFactor',
    description:
      'Controls the intensity of the hover grayscale effect. At 0, the hover grayscale effect is completely off. At 1, the hover grayscale effect is fully applied.',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.83,
    order: 4
  },
  {
    type: ControlType.TITLE,
    name: 'Glow',
    order: 5,
    level: TitleLevel.H4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Enable Glow',
    uniform: 'uEnableGlow',
    defaultValue: true,
    description: 'Enable glow effects',
    order: 5
  },
  {
    type: ControlType.SLIDER,
    name: 'Glow Intensity',
    uniform: 'uGlowIntensity',
    description:
      'Controls the intensity of the glow effect. At 0, the glow effect is completely off. At 1, the glow effect is fully applied.',
    min: 1,
    max: 3,
    step: 0.1,
    defaultValue: 1.4,
    order: 5
  },
  {
    type: ControlType.SLIDER,
    name: 'Glow Radius',
    uniform: 'uGlowRadius',
    description:
      'Controls the radius of the glow effect. At 0, the glow effect is completely off. At 1, the glow effect is fully applied.',
    min: 0,
    max: 0.03,
    step: 0.001,
    defaultValue: 0.01,
    order: 5
  },
  {
    type: ControlType.SLIDER,
    name: 'Glow Pulsation Radius',
    uniform: 'uGlowPulsationRadius',
    description:
      'Controls the radius of the glow pulsation effect. At 0, the glow pulsation effect is completely off. At 1, the glow pulsation effect is fully applied.',
    min: 0,
    max: 0.03,
    step: 0.001,
    defaultValue: 0.005,
    order: 5
  },
  {
    type: ControlType.SLIDER,
    name: 'Glow Pulsation Period',
    uniform: 'uGlowPulsationPeriod',
    description:
      'Controls the period of the glow pulsation effect. At 0, the glow pulsation effect is completely off. At 1, the glow pulsation effect is fully applied.',
    min: 0,
    max: 8,
    step: 0.1,
    defaultValue: 5,
    order: 5
  },
  {
    type: ControlType.TITLE,
    name: 'Actions',
    order: 6,
    level: TitleLevel.H4
  },
  {
    type: ControlType.BUTTON,
    name: 'Reset All',
    action: RenderMapEvent.TriggerResetUniforms,
    icon: '🔄',
    description: 'Reset all uniforms to default values',
    order: 6
  },
  {
    type: ControlType.BUTTON,
    name: 'Shuffle Colors',
    action: RenderMapEvent.ShuffleColors,
    icon: '✨',
    description: 'Shuffle province colors',
    order: 6
  },
  {
    type: ControlType.TITLE,
    name: 'Contours',
    order: 6,
    level: TitleLevel.H4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Enable Contour',
    uniform: 'uEnableContour',
    defaultValue: true,
    description: 'Show province contours',
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Contour intensity',
    uniform: 'uContourIntensity',
    description:
      'Controls the intensity of the contour effect. At 0, the contour effect is completely off. At 1, the contour effect is fully applied.',
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 1,
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Contour luminosity',
    uniform: 'uContourLuminosity',
    description:
      'Controls the luminosity of the contour effect. At 0, the contour effect is completely off. At 1, the contour effect is fully applied.',
    min: -1,
    max: 1,
    step: 0.05,
    defaultValue: 0.05,
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Contour Opacity',
    uniform: 'uContourOpacity',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1,
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Inner Contour Size',
    uniform: 'uInnerContourSize',
    min: 0,
    max: 0.01,
    step: 0.0005,
    defaultValue: 0.0045,
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Inner Contour Sample',
    uniform: 'uInnerContourSample',
    min: 0,
    max: 32,
    step: 1,
    defaultValue: 16,
    order: 6
  },
  {
    type: ControlType.TOGGLE,
    name: 'Use Outer Contour',
    uniform: 'uUseOuterContour',
    defaultValue: false,
    description: 'Show outer contour around provinces',
    order: 6
  },
  {
    type: ControlType.SLIDER,
    name: 'Glow and Outer Contour Sample',
    uniform: 'uGlowAndOuterContourSample',
    min: 0,
    max: 32,
    step: 1,
    defaultValue: 32,
    order: 6
  },
  {
    type: ControlType.TOGGLE,
    name: 'Contour Antialiasing',
    uniform: 'uUseContourAntialiasing',
    defaultValue: true,
    description: 'Enable antialiasing for contours',
    order: 6
  },
  {
    type: ControlType.TITLE,
    name: 'Mouse',
    order: 7,
    level: TitleLevel.H4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Enable Mouse Illumination',
    uniform: 'uEnableMouseIllumination',
    defaultValue: true,
    description: 'Enable mouse-based illumination effects',
    order: 7
  },
  {
    type: ControlType.SLIDER,
    name: 'Mouse illumination radius',
    uniform: 'uMouseIlluminationRadius',
    min: 0,
    max: 1,
    step: 0.005,
    defaultValue: 0.2,
    order: 7
  },
  {
    type: ControlType.SLIDER,
    name: 'Mouse illumination intensity',
    uniform: 'uMouseIlluminationIntensity',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.12,
    order: 7
  },

  {
    type: ControlType.TITLE,
    name: 'Pulsations',
    order: 7,
    level: TitleLevel.H4
  },
  {
    type: ControlType.TOGGLE,
    name: 'Enable Pulsations',
    uniform: 'uEnablePulsations',
    defaultValue: true,
    description: 'Enable pulsation effects',
    order: 7
  },
  {
    type: ControlType.SLIDER,
    name: 'Pulsation Intensity',
    uniform: 'uPulsationIntensity',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.05,
    order: 7
  },
  {
    type: ControlType.SLIDER,
    name: 'Pulsation Period',
    uniform: 'uPulsationPeriod',
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: 5,
    order: 7
  },
  {
    type: ControlType.TITLE,
    name: 'Options',
    order: 17,
    level: TitleLevel.H4
  },
  {
    type: ControlType.SLIDER,
    name: 'Visualization mode',
    uniform: 'uVisualizationMode',
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
    order: 20
  }
];
