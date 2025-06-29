import { Color, MapUniforms } from '../../types';

export const defaultMapUniforms = {
  uHoveredProvinceColor: [0, 0, 0] as Color,
  uEnableHover: true,
  uBlendFactor: 0.81,
  uContrast: 3.2,
  uMiddleGray: 0.65,
  uGrayscaleBlendFactor: 1,
  uHoverBlendFactor: 0.9,
  uHoverGrayscaleBlendFactor: 0.83,
  uEnableGlow: true,
  uGlowRadius: 0.011,
  uGlowPulsationRadius: 0.005,
  uGlowPulsationPeriod: 5,
  uGlowIntensity: 2.05,
  uGlowColor: [0.4, 0.4, 0.4] as Color,

  uUseOuterContour: false,
  uUseContourAntialiasing: true,
  uContourIntensity: 1.1,
  uContourLuminosity: 0.19,
  uInnerContourSize: 0.0045,
  uContourOpacity: 1,
  uOuterContourSize: 0.002,
  uInnerContourSample: 16,
  uGlowAndOuterContourSample: 32,
  uMouseIlluminationRadius: 0.2,
  uMouseIlluminationIntensity: 0.07,
  uEnableMouseIllumination: true,
  uBorderMapOpacity: 1,
  uUseColoredBorders: false,
  uEnableContour: true,

  uEnablePulsations: true,
  uPulsationPeriod: 5,
  uPulsationIntensity: 0.05,
  uEnablePatterns: false,
  uPatternSize: 90,
  uVisualizationMode: 0
};

export const defaultSimpleMapUniforms: MapUniforms = {
  ...defaultMapUniforms
};

export const defaultWorldMapUniforms: MapUniforms = {
  ...defaultMapUniforms
};

export const defaultEuropaMapUniforms: MapUniforms = {
  ...defaultMapUniforms
};

export const baseDefaultMouseUniforms = {
  uMouseIlluminationRadius: defaultMapUniforms.uMouseIlluminationRadius,
  uMouseIlluminationIntensity: defaultMapUniforms.uMouseIlluminationIntensity,
  uEnableMouseIllumination: true
};
