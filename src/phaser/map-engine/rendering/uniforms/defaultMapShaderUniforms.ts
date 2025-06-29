import { Color, MapUniforms } from '../../types';

export const defaultMapUniforms = {
  uHoveredProvinceColor: [0, 0, 0] as Color,
  uEnableHover: true,
  uVisualizationMethod: 3,
  uBlendFactor: 0.81,
  uContrast: 3.2,
  uMiddleGray: 0.65,
  uGrayscaleBlendFactor: 1,
  uHoverVisualizationMethod: 3,
  uHoverBlendFactor: 0.9,
  uBlendFactorSecondary: 1,
  uHoverGrayscaleBlendFactor: 0.83,
  uGlowRadius: 0.011,
  uGlowPulsationRadius: 0.005,
  uGlowPulsationPeriod: 5,
  uGlowIntensity: 2.05,
  uGlowColor: [0.4, 0.4, 0.4] as Color,
  uEnableGlow: true,
  uUseOuterContour: false,
  uUseContourAntialiasing: true,
  uContourIntensity: 1.1,
  uContourLuminosity: 0.19,
  uInnerContourSize: 0.0045,
  uOuterContourSize: 0.002,
  uMouseIlluminationRadius: 0.2,
  uMouseIlluminationIntensity: 0.07,
  uEnableMouseIllumination: true,
  uBorderMapOpacity: 1,
  uUseColoredBorders: false,
  uEnableContour: true,
  uContourOpacity: 1,
  uInnerContourSample: 16,
  uGlowAndOuterContourSample: 32,
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
