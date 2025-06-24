import Phaser from 'phaser';
import { MapTextureArray, MapUniforms, MapUniformsBase, MapViewPipelineType } from '../types';

export const MapTextureIndices = {
  BITMAP: 1,
  BORDER: 2,
  PROVINCE_DATA: 4,
  PROVINCE_COLOR: 5,
  MAIN_MAP: 6
} as const;

export default class MapShaderPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  private type: MapViewPipelineType;
  private uniform: MapUniforms = {};
  private mainSample!: MapTextureArray;

  get key(): string {
    return this.type;
  }

  constructor(game: Phaser.Game, fragShader: string, key: MapViewPipelineType) {
    const config = {
      game,
      renderer: game.renderer,
      fragShader
    };

    super(config);

    this.type = key;
  }

  initialize(uniforms: MapUniformsBase) {
    this.uniform = uniforms;
    this.mainSample = uniforms.uMapTextureArray;
    this.set2fv('uMapResolution', uniforms.uMapResolution);
    this.set1f('uQuantizationLevelAmount', uniforms.uQuantizationLevelAmount);
    this.set1i('uVisualizationMethod', uniforms.uVisualizationMethod);
    this.set1f('uBlendFactor', uniforms.uBlendFactor);
    this.set1f('uBlendFactorSecondary', uniforms.uBlendFactorSecondary);
    this.set1f('uContrast', uniforms.uContrast);
    this.set1f('uMiddleGray', uniforms.uMiddleGray);
    this.set1f('uGrayscaleBlendFactor', uniforms.uGrayscaleBlendFactor);
    this.set1i('uUseAverageGrayWeights', uniforms.uUseAverageGrayWeights ? 1 : 0);
    this.set1i('uEnableHover', uniforms.uEnableHover ? 1 : 0);
    this.set1i('uHoverVisualizationMethod', uniforms.uHoverVisualizationMethod);
    this.set1f('uHoverBlendFactor', uniforms.uHoverBlendFactor);
    this.set1f('uHoverGrayscaleBlendFactor', uniforms.uHoverGrayscaleBlendFactor);
    this.set1f('uGlowRadius', uniforms.uGlowRadius);
    this.set1f('uGlowPulsationRadius', uniforms.uGlowPulsationRadius);
    this.set1f('uGlowPulsationPeriod', uniforms.uGlowPulsationPeriod);
    this.set1f('uContourIntensity', uniforms.uContourIntensity);
    this.set1f('uContourLuminosity', uniforms.uContourLuminosity);
    this.set1i('uUseOuterContour', uniforms.uUseOuterContour ? 1 : 0);
    this.set1f('uInnerContourSize', uniforms.uInnerContourSize);
    this.set1f('uOuterContourSize', uniforms.uOuterContourSize);
    this.set1i('uGlowType', uniforms.uGlowType);
    this.set1f('uGlowIntensity', uniforms.uGlowIntensity);
    this.set1i('uEnableMouseIllumination', uniforms.uEnableMouseIllumination ? 1 : 0);
    this.set1f('uMouseIlluminationRadius', uniforms.uMouseIlluminationRadius);
    this.set1f('uMouseIlluminationIntensity', uniforms.uMouseIlluminationIntensity);
    this.set1i('uEnableGlow', uniforms.uEnableGlow ? 1 : 0);
    this.set1f('uBorderMapOpacity', uniforms.uBorderMapOpacity);
    this.set1i('uEnableContour', uniforms.uEnableContour ? 1 : 0);
    this.set1f('uContourOpacity', uniforms.uContourOpacity);
    this.set1i('uUseContourAntialiasing', uniforms.uUseContourAntialiasing ? 1 : 0);
    this.set1i('uInnerContourSample', uniforms.uInnerContourSample);
    this.set1i('uGlowAndOuterContourSample', uniforms.uGlowAndOuterContourSample);
    this.set1i('uUseColoredBorders', uniforms.uUseColoredBorders ? 1 : 0);
    this.set1i('uDisplayBlankMap', uniforms.uDisplayBlankMap ? 1 : 0);
    this.set1i('uEnablePulsations', uniforms.uEnablePulsations ? 1 : 0);
    this.set1f('uPulsationPeriod', uniforms.uPulsationPeriod);
    this.set1f('uPulsationIntensity', uniforms.uPulsationIntensity);
    this.set1f('uClickTime', 0);
    this.set1f('uTime', 0);
    this.set1i('uSelectionFlag', 0);
    this.set1i('uDisplayFlag', 0);
    this.set1i('uEnablePatterns', uniforms.uEnablePatterns ? 1 : 0);
    this.set1f('uPatternSize', uniforms.uPatternSize);
    this.set1i('uUseJunctionAntialiasing', uniforms.uUseJunctionAntialiasing ? 1 : 0);
    this.set1f('uJunctionAntialiasingSize', uniforms.uJunctionAntialiasingSize);
  }

  private refreshTextureBindings() {
    for (let i = 0; i < this.mainSample.length; i++) {
      this.bindTexture(this.mainSample[i], i);
    }
  }

  onBind() {
    this.refreshTextureBindings();
  }

  update(time: number) {
    this.uniform.uTime = time;
    this.set1f('uTime', time);
  }

  changeMapTexture(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.mainSample[MapTextureIndices.MAIN_MAP] = texture;
  }
  changeBitmapTexture(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.mainSample[MapTextureIndices.BITMAP] = texture;
  }
  changeBorderTexture(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.mainSample[MapTextureIndices.BORDER] = texture;
  }
  changeProvincesDataTexture(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.mainSample[MapTextureIndices.PROVINCE_DATA] = texture;
  }
  changeProvinceColorTexture(colorTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.mainSample[MapTextureIndices.PROVINCE_COLOR] = colorTexture;
  }

  updateUniforms(uniform: MapUniforms) {
    if (uniform.uMapResolution !== undefined) {
      this.uniform.uMapResolution = uniform.uMapResolution;
      this.set2fv('uMapResolution', uniform.uMapResolution);
    }
    if (uniform.uQuantizationLevelAmount !== undefined) {
      this.uniform.uQuantizationLevelAmount = uniform.uQuantizationLevelAmount;
      this.set1f('uQuantizationLevelAmount', uniform.uQuantizationLevelAmount);
    }
    if (uniform.uHoverBlendFactor !== undefined) {
      this.uniform.uHoverBlendFactor = uniform.uHoverBlendFactor;
      this.set1f('uHoverBlendFactor', uniform.uHoverBlendFactor);
    }
    if (uniform.uBlendFactor !== undefined) {
      this.uniform.uBlendFactor = uniform.uBlendFactor;
      this.set1f('uBlendFactor', uniform.uBlendFactor);
    }
    if (uniform.uBlendFactorSecondary !== undefined) {
      this.uniform.uBlendFactorSecondary = uniform.uBlendFactorSecondary;
      this.set1f('uBlendFactorSecondary', uniform.uBlendFactorSecondary);
    }
    if (uniform.uEnableHover !== undefined) {
      this.uniform.uEnableHover = uniform.uEnableHover;
      this.set1i('uEnableHover', uniform.uEnableHover ? 1 : 0);
    }
    if (uniform.uHoveredProvinceColor !== undefined) {
      this.uniform.uHoveredProvinceColor = uniform.uHoveredProvinceColor;
      this.set3fv('uHoveredProvinceColor', uniform.uHoveredProvinceColor);
    }
    if (uniform.uHoveredProvinceQuant !== undefined) {
      this.uniform.uHoveredProvinceQuant = uniform.uHoveredProvinceQuant;
      this.set1i('uHoveredProvinceQuant', uniform.uHoveredProvinceQuant);
    }
    if (uniform.uMousePos !== undefined) {
      this.uniform.uMousePos = uniform.uMousePos;
      this.set2fv('uMousePos', uniform.uMousePos);
    }
    if (uniform.uTime !== undefined) {
      this.uniform.uTime = uniform.uTime;
      this.set1f('uTime', uniform.uTime);
    }
    if (uniform.uClickTime !== undefined) {
      this.uniform.uClickTime = uniform.uClickTime;
      this.set1f('uClickTime', uniform.uClickTime);
    }
    if (uniform.uGlowRadius !== undefined) {
      this.uniform.uGlowRadius = uniform.uGlowRadius;
      this.set1f('uGlowRadius', uniform.uGlowRadius);
    }
    if (uniform.uGlowPulsationRadius !== undefined) {
      this.uniform.uGlowPulsationRadius = uniform.uGlowPulsationRadius;
      this.set1f('uGlowPulsationRadius', uniform.uGlowPulsationRadius);
    }
    if (uniform.uGlowPulsationPeriod !== undefined) {
      // TODO : better validation + handling of optional parameters
      const uGlowPulsationPeriod =
        uniform.uGlowPulsationPeriod > 0 ? uniform.uGlowPulsationPeriod : 1;
      this.uniform.uGlowPulsationPeriod = uGlowPulsationPeriod;
      this.set1f('uGlowPulsationPeriod', uGlowPulsationPeriod);
    }
    if (uniform.uMouseIlluminationRadius !== undefined) {
      this.uniform.uMouseIlluminationRadius = uniform.uMouseIlluminationRadius;
      this.set1f('uMouseIlluminationRadius', uniform.uMouseIlluminationRadius);
    }
    if (uniform.uMouseIlluminationIntensity !== undefined) {
      this.uniform.uMouseIlluminationIntensity = uniform.uMouseIlluminationIntensity;
      this.set1f('uMouseIlluminationIntensity', uniform.uMouseIlluminationIntensity);
    }
    //
    if (uniform.uHoverVisualizationMethod !== undefined) {
      this.uniform.uHoverVisualizationMethod = uniform.uHoverVisualizationMethod;
      this.set1i('uHoverVisualizationMethod', uniform.uHoverVisualizationMethod);
    }
    if (uniform.uVisualizationMethod !== undefined) {
      this.uniform.uVisualizationMethod = uniform.uVisualizationMethod;
      this.set1i('uVisualizationMethod', uniform.uVisualizationMethod);
    }
    if (uniform.uContourIntensity !== undefined) {
      this.uniform.uContourIntensity = uniform.uContourIntensity;
      this.set1f('uContourIntensity', uniform.uContourIntensity);
    }
    if (uniform.uContourLuminosity !== undefined) {
      this.uniform.uContourLuminosity = uniform.uContourLuminosity;
      this.set1f('uContourLuminosity', uniform.uContourLuminosity);
    }
    if (uniform.uUseOuterContour !== undefined) {
      this.uniform.uUseOuterContour = uniform.uUseOuterContour;
      this.set1i('uUseOuterContour', uniform.uUseOuterContour ? 1 : 0);
    }
    if (uniform.uInnerContourSize !== undefined) {
      this.uniform.uInnerContourSize = uniform.uInnerContourSize;
      this.set1f('uInnerContourSize', uniform.uInnerContourSize);
    }
    if (uniform.uOuterContourSize !== undefined) {
      this.uniform.uOuterContourSize = uniform.uOuterContourSize;
      this.set1f('uOuterContourSize', uniform.uOuterContourSize);
    }
    if (uniform.uGlowType !== undefined) {
      this.uniform.uGlowType = uniform.uGlowType;
      this.set1i('uGlowType', uniform.uGlowType);
    }
    if (uniform.uGlowIntensity !== undefined) {
      this.uniform.uGlowIntensity = uniform.uGlowIntensity;
      this.set1f('uGlowIntensity', uniform.uGlowIntensity);
    }
    if (uniform.uHoverGrayscaleBlendFactor !== undefined) {
      this.uniform.uHoverGrayscaleBlendFactor = uniform.uHoverGrayscaleBlendFactor;
      this.set1f('uHoverGrayscaleBlendFactor', uniform.uHoverGrayscaleBlendFactor);
    }
    if (uniform.uContrast !== undefined) {
      this.uniform.uContrast = uniform.uContrast;
      this.set1f('uContrast', uniform.uContrast);
    }
    if (uniform.uMiddleGray !== undefined) {
      this.uniform.uMiddleGray = uniform.uMiddleGray;
      this.set1f('uMiddleGray', uniform.uMiddleGray);
    }
    if (uniform.uGrayscaleBlendFactor !== undefined) {
      this.uniform.uGrayscaleBlendFactor = uniform.uGrayscaleBlendFactor;
      this.set1f('uGrayscaleBlendFactor', uniform.uGrayscaleBlendFactor);
    }
    if (uniform.uEnableMouseIllumination !== undefined) {
      this.uniform.uEnableMouseIllumination = uniform.uEnableMouseIllumination;
      this.set1i('uEnableMouseIllumination', uniform.uEnableMouseIllumination ? 1 : 0);
    }
    if (uniform.uEnableGlow !== undefined) {
      this.uniform.uEnableGlow = uniform.uEnableGlow;
      this.set1i('uEnableGlow', uniform.uEnableGlow ? 1 : 0);
    }
    if (uniform.uBorderMapOpacity !== undefined) {
      this.uniform.uBorderMapOpacity = uniform.uBorderMapOpacity;
      this.set1f('uBorderMapOpacity', uniform.uBorderMapOpacity);
    }
    if (uniform.uEnableContour !== undefined) {
      this.uniform.uEnableContour = uniform.uEnableContour;
      this.set1i('uEnableContour', uniform.uEnableContour ? 1 : 0);
    }
    if (uniform.uContourOpacity !== undefined) {
      this.uniform.uContourOpacity = uniform.uContourOpacity;
      this.set1f('uContourOpacity', uniform.uContourOpacity);
    }
    if (uniform.uUseContourAntialiasing !== undefined) {
      this.uniform.uUseContourAntialiasing = uniform.uUseContourAntialiasing;
      this.set1i('uUseContourAntialiasing', uniform.uUseContourAntialiasing ? 1 : 0);
    }
    if (uniform.uUseColoredBorders !== undefined) {
      this.uniform.uUseColoredBorders = uniform.uUseColoredBorders;
      this.set1i('uUseColoredBorders', uniform.uUseColoredBorders ? 1 : 0);
    }
    if (uniform.uInnerContourSample !== undefined) {
      this.uniform.uInnerContourSample = uniform.uInnerContourSample;
      this.set1i('uInnerContourSample', uniform.uInnerContourSample);
    }
    if (uniform.uGlowAndOuterContourSample !== undefined) {
      this.uniform.uGlowAndOuterContourSample = uniform.uGlowAndOuterContourSample;
      this.set1i('uGlowAndOuterContourSample', uniform.uGlowAndOuterContourSample);
    }
    if (uniform.uGlowColor !== undefined) {
      this.uniform.uGlowColor = uniform.uGlowColor;
      this.set3fv('uGlowColor', uniform.uGlowColor);
    }
    if (uniform.uDisplayBlankMap !== undefined) {
      this.uniform.uDisplayBlankMap = uniform.uDisplayBlankMap;
      this.set1i('uDisplayBlankMap', uniform.uDisplayBlankMap ? 1 : 0);
    }
    //
    if (uniform.uEnablePulsations !== undefined) {
      this.uniform.uEnablePulsations = uniform.uEnablePulsations;
      this.set1i('uEnablePulsations', uniform.uEnablePulsations ? 1 : 0);
    }
    if (uniform.uPulsationPeriod !== undefined) {
      this.uniform.uPulsationPeriod = uniform.uPulsationPeriod;
      this.set1f('uPulsationPeriod', uniform.uPulsationPeriod);
    }
    if (uniform.uPulsationIntensity !== undefined) {
      this.uniform.uPulsationIntensity = uniform.uPulsationIntensity;
      this.set1f('uPulsationIntensity', uniform.uPulsationIntensity);
    }
    if (uniform.uSelectedProvinceQuant !== undefined) {
      this.uniform.uSelectedProvinceQuant = uniform.uSelectedProvinceQuant;
      this.set1i('uSelectedProvinceQuant', uniform.uSelectedProvinceQuant);
    }
    if (uniform.uEnablePatterns !== undefined) {
      this.uniform.uEnablePatterns = uniform.uEnablePatterns;
      this.set1i('uEnablePatterns', uniform.uEnablePatterns ? 1 : 0);
    }
    if (uniform.uPatternSize !== undefined) {
      this.uniform.uPatternSize = uniform.uPatternSize;
      this.set1f('uPatternSize', uniform.uPatternSize);
    }
    if (uniform.uJunctionAntialiasingSize !== undefined) {
      this.uniform.uJunctionAntialiasingSize = uniform.uJunctionAntialiasingSize;
      this.set1f('uJunctionAntialiasingSize', uniform.uJunctionAntialiasingSize);
    }
  }
}
