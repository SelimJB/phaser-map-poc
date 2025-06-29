import { Color, MapUniforms } from '../../types';

export const defaultMapUniforms = {
  uHoveredProvinceColor: [0, 0, 0] as Color,
  uEnableHover: true,
  uBlendFactor: 0.75,
  uContrast: 3.9,
  uMiddleGray: 0.6,
  uGrayscaleBlendFactor: 0.9,
  uHoverBlendFactor: 0.9,
  uHoverGrayscaleBlendFactor: 1,
  uEnableGlow: true,
  uGlowRadius: 0.009,
  uGlowPulsationRadius: 0.0065,
  uGlowPulsationPeriod: 5,
  uGlowIntensity: 1.6,
  uGlowColor: [0.4, 0.4, 0.4] as Color,
  uUseOuterContour: false,
  uUseContourAntialiasing: true,
  uContourIntensity: 1.2,
  uContourLuminosity: 0.05,
  uInnerContourSize: 0.004,
  uContourOpacity: 1,
  uOuterContourSize: 0.0005,
  uInnerContourSample: 16,
  uGlowAndOuterContourSample: 24,
  uMouseIlluminationRadius: 0.2,
  uMouseIlluminationIntensity: 0.15,
  uEnableMouseIllumination: true,
  uBorderMapOpacity: 1,
  uUseColoredBorders: false,
  uEnableContour: true,
  uEnablePulsations: false,
  uPulsationPeriod: 2,
  uPulsationIntensity: 0.05,
  uEnablePatterns: false,
  uPatternSize: 90,
  uVisualizationMode: 0
};

export const defaultSimpleMapUniforms: MapUniforms = {
  ...defaultMapUniforms,
  uUseOuterContour: true,
  uBorderMapOpacity: 0.3,
  uEnablePulsations: false,
  uContrast: 4.4,
  uContourLuminosity: -0.5,
  uContourIntensity: 1.25,
  uHoverBlendFactor: 1,
  uHoverGrayscaleBlendFactor: 0.7,
  uBlendFactor: 0.35,
  uGlowRadius: 0.02,
  uGlowPulsationRadius: 0.01,
  uGlowPulsationPeriod: 2.5
};

export const defaultWorldMapUniforms: MapUniforms = {
  ...defaultMapUniforms,
  uEnableContour: false,
  uEnableMouseIllumination: false,
  uGlowPulsationRadius: 0,
  uGlowRadius: 0.016,
  uBlendFactor: 0.7,
  uHoverBlendFactor: 1,
  uInnerContourSample: 0,
  uGlowAndOuterContourSample: 24
};

export const defaultEuropaMapUniforms: MapUniforms = {
  ...defaultMapUniforms
};

export const baseDefaultMouseUniforms = {
  uMouseIlluminationRadius: defaultMapUniforms.uMouseIlluminationRadius,
  uMouseIlluminationIntensity: defaultMapUniforms.uMouseIlluminationIntensity,
  uEnableMouseIllumination: true
};
