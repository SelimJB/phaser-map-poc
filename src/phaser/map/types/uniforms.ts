export type MapTextureArray = [
  Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper,
  ...Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]
];

export type MapPipelineItem = {
  shaderPath: string;
  pipelineType: MapViewPipelineType;
};

export enum MapViewPipelineType {
  Default = 'default',
  Simplest = 'simple'
}

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Color = [number, number, number];
export type ColorRgba = [number, number, number, number];

export type MapUniforms = Partial<MapUniformsBase>;

export type MapUniformsBase = {
  uMapTextureArray: MapTextureArray;
  uQuantizationLevelAmount: number;
  uMapResolution: Vec2;
  uTime?: number;
  uMousePos?: Vec2;
  uHoveredProvinceColor?: Color;
  uHoveredProvinceQuant?: number;
  uEnablePulsations?: boolean;
  uPulsationPeriod: number;
  uPulsationIntensity: number;
  uSelectedProvinceQuant?: number;
  uClickTime?: number;
  uDisplayBlankMap: boolean;
  uVisualizationMethod: number;
  uBlendFactor: number;
  uBlendFactorSecondary: number;
  uContrast: number;
  uMiddleGray: number;
  uGrayscaleBlendFactor: number;
  uUseAverageGrayWeights: boolean;
  uEnablePatterns: boolean;
  uPatternSize: number;
  uEnableHover: boolean;
  uHoverVisualizationMethod: number;
  uHoverBlendFactor: number;
  uHoverGrayscaleBlendFactor: number;
  uUseColoredBorders: boolean;
  uBorderMapOpacity: number;
  uEnableMouseIllumination: boolean;
  uMouseIlluminationRadius: number;
  uMouseIlluminationIntensity: number;
  uEnableGlow: boolean;
  uGlowType: number;
  uGlowColor?: Color;
  uGlowIntensity: number;
  uGlowRadius: number;
  uGlowPulsationRadius: number;
  uGlowPulsationPeriod: number;
  uEnableContour: boolean;
  uContourLuminosity: number;
  uContourIntensity: number;
  uContourOpacity: number;
  uUseContourAntialiasing: boolean;
  uInnerContourSize: number;
  uUseOuterContour: boolean;
  uOuterContourSize: number;
  uInnerContourSample: number;
  uGlowAndOuterContourSample: number;
  uUseJunctionAntialiasing: boolean;
  uJunctionAntialiasingSize: number;
};
