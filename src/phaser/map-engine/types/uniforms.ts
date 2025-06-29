export type MapTextureArray = [
  Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper,
  ...Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]
];

export type MapPipelineItem = {
  shaderPath: string;
  pipelineType: MapRenderingPipelineType;
};

export enum MapRenderingPipelineType {
  Default = 'default',
  Simplest = 'simple'
}

export enum VisualizationModes {
  Shader = 0,
  Bitmap = 1,
  Plain = 2,
  Colors = 3,
  Borders = 4,
  BitmapFX = 5,
  Debug = 6,
  Gray = 7
}

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Color = [number, number, number];
export type ColorRgba = [number, number, number, number];

export type MapUniforms = Partial<MapUniformsBase>;

export interface UniformChangeData {
  uniform: string;
  value: number;
}

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
  uBlendFactor: number;
  uContrast: number;
  uMiddleGray: number;
  uGrayscaleBlendFactor: number;
  uEnablePatterns: boolean;
  uPatternSize: number;
  uEnableHover: boolean;
  uHoverBlendFactor: number;
  uHoverGrayscaleBlendFactor: number;
  uUseColoredBorders: boolean;
  uBorderMapOpacity: number;
  uEnableMouseIllumination: boolean;
  uMouseIlluminationRadius: number;
  uMouseIlluminationIntensity: number;
  uEnableGlow: boolean;
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
  uVisualizationMode: number;
};
