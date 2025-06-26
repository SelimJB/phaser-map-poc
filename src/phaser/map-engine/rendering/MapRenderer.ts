import { EventManager } from '@/phaser/services/EventManager';
import { getAssetPath } from '@/phaser/utils/getAssetPath';
import { loadShaderPipeline } from './loadShaderPipeline';
import MapColorizationTextureGenerator from './MapColorizationTextureGenerator';
import MapShaderPipeline from './MapShaderPipeline';
import { QuantizationService } from '../core/QuantizationService';
import { RenderMapEvent } from '../events/events';
import { mapControlBridge } from '../events/mapControlBridge';
import {
  MapTextureArray,
  MapUniforms,
  MapUniformsBase,
  MapRenderingPipelineType,
  Vec2
} from '../types';
import { defaultMapUniforms } from './uniforms/defaultMapShaderUniforms';
import { Point } from '../types/geometry';
import { TextureItem, MapTextures } from '../types/textures';

export default class MapRenderer {
  static loadedPipelines: ReadonlyArray<MapRenderingPipelineType>;
  private nextFrameUniforms: MapUniforms = {};
  private currentUniforms!: MapUniformsBase;
  private _defaultUniforms: MapUniforms;
  private mapTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  private mapBorderTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  private bitmapTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  private mapImage?: Phaser.GameObjects.Image;
  private layer?: Phaser.Tilemaps.TilemapLayer;
  private currentPipelineType = MapRenderingPipelineType.Default;
  private pipelines: Map<MapRenderingPipelineType, MapShaderPipeline> = new Map();
  private pipelineIdChangeEvent = new EventManager();
  private shaderDebugIdChangeEvent = new EventManager();
  isTweakShaderModeEnabled = false;

  constructor(
    private scene: Phaser.Scene,
    private quantizationConfig: QuantizationService,
    private textureGenerator: MapColorizationTextureGenerator,
    mapDefaultUniforms: MapUniforms
  ) {
    this.scene = scene;

    this._defaultUniforms = {
      ...defaultMapUniforms,
      ...mapDefaultUniforms
    };
  }

  private get pipeline(): MapShaderPipeline {
    const pipeline = this.pipelines.get(this.currentPipelineType);
    if (!pipeline) throw new Error('Pipeline not found');
    return pipeline;
  }

  get uniforms() {
    return this.currentUniforms;
  }

  get defaultUniforms() {
    return this._defaultUniforms;
  }

  get pipelineType() {
    return this.currentPipelineType;
  }

  static loadTexture(scene: Phaser.Scene, textureItem: TextureItem) {
    const { key } = textureItem;
    if (!scene.textures.exists(key)) {
      if (textureItem.localUrl)
        scene.load.image(textureItem.key, getAssetPath(textureItem.localUrl));
    }
  }

  static preload(scene: Phaser.Scene, sprites: MapTextures) {
    MapRenderer.loadTexture(scene, sprites.map);
    MapRenderer.loadTexture(scene, sprites.bitmap);
    MapRenderer.loadTexture(scene, sprites.fxBitmap);
    MapRenderer.loadTexture(scene, sprites.mapBorders);
    MapRenderer.loadTexture(scene, sprites.blankMap);
    MapRenderer.loadTexture(scene, sprites.initialProvincesDataTexture);

    MapRenderer.loadedPipelines = [
      MapRenderingPipelineType.Default,
      MapRenderingPipelineType.Simplest
    ];
    MapRenderer.loadedPipelines.map((item) => loadShaderPipeline(scene.game, item));
  }

  update(time: number) {
    this.pipeline.update(time / 100);
  }

  updateUniforms(uniforms: MapUniforms, ignoreIfTweakMode = false) {
    if (this.isTweakShaderModeEnabled && ignoreIfTweakMode) return;

    this.nextFrameUniforms = uniforms;
    Object.assign(this.currentUniforms, uniforms);
    this.pipeline.updateUniforms(uniforms);
  }

  changeProvinceColorTexture(colorTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.pipeline.changeProvinceColorTexture(colorTexture);
  }

  changeProvinceDataTexture(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.pipeline.changeProvincesDataTexture(texture);
  }

  setupRenderingPipelines(mapTextures: MapTextures) {
    this.mapTexture = this.scene.textures.get(mapTextures.map.key).source[0].glTexture!;

    if (!this.mapTexture) throw new Error('No map texture');

    const blankMap = this.scene.textures.get(mapTextures.blankMap.key).source[0];
    const bitmapTexture = this.scene.textures.get(mapTextures.bitmap.key).source[0];
    bitmapTexture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.bitmapTexture = bitmapTexture.glTexture!;
    this.mapBorderTexture = this.scene.textures.get(
      mapTextures.mapBorders.key
    ).source[0].glTexture!;
    const fxBitmap = this.scene.textures.get(mapTextures.fxBitmap.key).source[0];
    fxBitmap.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const provincesData = this.scene.textures.get(mapTextures.initialProvincesDataTexture.key)
      .source[0];
    provincesData.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const textures = [
      blankMap.glTexture,
      this.bitmapTexture,
      this.mapBorderTexture,
      provincesData.glTexture,
      this.mapTexture,
      fxBitmap.glTexture
    ] as MapTextureArray;

    const quantizationLevelCount = this.quantizationConfig.levelCount;

    MapRenderer.loadedPipelines.forEach((key) => {
      const pipeline = (
        this.scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
      ).pipelines.get(key) as MapShaderPipeline;
      this.pipelines.set(key, pipeline);
      const preprocessedInitializationUniforms = {
        uMapResolution: [bitmapTexture.width, bitmapTexture.height] as Vec2,
        uMapTextureArray: textures,
        uQuantizationLevelAmount: quantizationLevelCount
      };

      this.currentUniforms = {
        ...defaultMapUniforms,
        ...this._defaultUniforms,
        ...preprocessedInitializationUniforms
      };

      pipeline.initialize(this.currentUniforms);
      mapControlBridge.emit(RenderMapEvent.ResetUniforms, this.currentUniforms);
    });

    if (this.mapImage) {
      this.mapImage.setPipeline(this.pipeline);
    }
    if (this.layer) {
      this.layer.setPipeline(this.pipeline);
    }

    this.pipeline.updateUniforms({});
    this.shuffleColors();
  }

  displayMapImage(imageKey: string, position: Point) {
    this.mapImage = this.scene.add.image(position.x, position.y, imageKey);
  }

  shuffleColors() {
    const colorsTexture = this.textureGenerator.generateProvinceColorsTexture();
    this.pipeline.changeProvinceColorTexture(colorsTexture.source[0].glTexture!);
  }

  selectPipeline(pipelineType: MapRenderingPipelineType) {
    this.currentPipelineType = pipelineType;
    this.mapImage?.setPipeline(this.pipeline);
    this.layer?.setPipeline(this.pipeline);
    this.pipelineIdChangeEvent.emit('pipelineIdChange', pipelineType);
    const uniforms: MapUniforms = {
      ...this.currentUniforms,
      ...this.nextFrameUniforms
    };
    mapControlBridge.emit(RenderMapEvent.ResetUniforms, this._defaultUniforms);
    this.updateUniforms(uniforms);
  }

  onPipelineIdChange(callback: (pipelineType: MapRenderingPipelineType | undefined) => void) {
    this.pipelineIdChangeEvent.addHandler('pipelineIdChange', callback);
  }

  onPipelineIdChangeRemove(callback: (pipelineType: MapRenderingPipelineType) => void) {
    this.pipelineIdChangeEvent.removeHandler('pipelineIdChange', callback);
  }

  onShaderDebugIndexChange(callback: (debugIndex: number) => void) {
    this.shaderDebugIdChangeEvent.addHandler('shaderDebudIdChange', callback);
  }

  dispose() {
    this.pipelineIdChangeEvent.removeAllHandlers('shaderDebudIdChange');
    this.shaderDebugIdChangeEvent.removeAllHandlers('pipelineIdChange');
  }
}
