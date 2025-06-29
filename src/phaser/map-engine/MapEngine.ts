import MapPointerController from './core/MapPointerController';
import MapRenderer from './rendering/MapRenderer';
import { EventManager } from '../services/EventManager';
import CameraController from './core/CameraController';
import { QuantizationService } from './core/QuantizationService';
import { MockProvinceRepository, ProvinceRepository } from './data/ProvinceRepository';
import { DebugMapEvent, InteractionMapEvent, RenderMapEvent } from './events/events';
import {
  MapInteractionData,
  MapUniforms,
  SceneConfig,
  UniformChangeData,
  VisualizationModes
} from './types';
import { calculateGlowingColor } from '../utils/colorUtils';
import { Point } from './types/geometry';
import { MapTextures } from './types/textures';
import { getAssetPath } from '../utils/getAssetPath';
import { mapControlBridge } from './events/mapControlBridge';
import MapColorizationTextureGenerator from './rendering/MapColorizationTextureGenerator';

export default class MapEngine {
  private initialized = false;
  private eventManager: EventManager;
  private cameraController: CameraController;
  private mapRenderer: MapRenderer;
  private textureGenerator: MapColorizationTextureGenerator;
  private mapTextures: MapTextures;

  constructor(
    public scene: Phaser.Scene,
    public sceneConfig: SceneConfig,
    private readonly quantizationService: QuantizationService = new QuantizationService(5),
    private readonly provinceRepository: ProvinceRepository = new MockProvinceRepository()
  ) {
    this.eventManager = new EventManager();
    this.mapTextures = sceneConfig.mapTextures;
    this.preload(this.mapTextures);
    this.textureGenerator = new MapColorizationTextureGenerator(scene, provinceRepository);
    this.mapRenderer = new MapRenderer(
      scene,
      this.quantizationService,
      this.textureGenerator,
      this.sceneConfig.defaultMapUniforms
    );
    this.cameraController = new CameraController(scene);
  }

  private preload(sprites: MapTextures) {
    MapRenderer.preload(this.scene, sprites);

    if (this.sceneConfig.provinceJson) {
      this.scene.load.json(
        this.sceneConfig.provinceJsonKey,
        getAssetPath(this.sceneConfig.provinceJson)
      );
    }
  }

  create() {
    let provincesData = null;

    if (this.sceneConfig.provinceJson) {
      if (this.scene.cache.json.exists(this.sceneConfig.provinceJsonKey)) {
        provincesData = this.scene.cache.json.get(this.sceneConfig.provinceJsonKey);
      } else {
        console.error('Province JSON data not found in cache. Available JSON keys:');
      }
    }

    this.provinceRepository.initialize(provincesData);

    const mapTexture = this.scene.textures.get(this.mapTextures.bitmap.key);
    if (!mapTexture) throw new Error('Map texture not found');

    const pos = { x: 0, y: 0 } as Point;

    this.scene.add.image(pos.x, pos.y, this.mapTextures.initialProvincesDataTexture.key);
    this.scene.add.image(pos.x, pos.y, this.mapTextures.fxBitmap.key);
    const bitmap = this.scene.add.sprite(pos.x, pos.y, this.mapTextures.bitmap.key);
    bitmap.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.scene.add.image(pos.x, pos.y, this.mapTextures.blankMap.key);

    this.mapRenderer.displayMapImage(this.mapTextures.blankMap.key, pos);
    this.mapRenderer.setupRenderingPipelines(this.mapTextures);

    this.initializePointerHandler(bitmap);
    this.mapRenderer.updateUniforms({ uClickTime: this.scene.time.now / 100 });
    this.initializeEvents();
    this.initialized = true;
  }

  private initializePointerHandler(bitmap: Phaser.GameObjects.Sprite) {
    const pointerHandler = new MapPointerController(
      this.scene,
      bitmap,
      this.quantizationService,
      this.provinceRepository,
      this.sceneConfig.sceneSize
    );

    pointerHandler.onPointerMove(this.onPointerMove.bind(this));
    pointerHandler.onProvinceClick(this.onProvinceClick.bind(this));
  }

  private onPointerMove(data: MapInteractionData) {
    const { pxPosition: position, quantization } = data;

    if (data.quantization === 0) {
      const uniforms: MapUniforms = {
        uMousePos: [position.x, position.y]
      };
      this.mapRenderer.updateUniforms(uniforms);
      return;
    }

    const provinceColor = this.textureGenerator.getProvinceColor(quantization);

    const uGlowColor = calculateGlowingColor(provinceColor, 1, 1, 0.05, 0.2);

    const uniforms: MapUniforms = {
      uSelectedProvinceQuant: quantization,
      uHoveredProvinceColor: provinceColor,
      uHoveredProvinceQuant: quantization,
      uMousePos: [position.x, position.y],
      uGlowColor
    };

    this.mapRenderer.updateUniforms(uniforms);
  }

  private onProvinceClick(data: MapInteractionData) {
    const provinceViewData = data.province;
    if (!provinceViewData) return;

    this.eventManager.emit(InteractionMapEvent.ProvinceClick, data);
  }

  private initializeEvents() {
    mapControlBridge.addHandler(RenderMapEvent.UniformChange, (data: UniformChangeData) => {
      this.mapRenderer.updateUniforms({ [data.uniform]: data.value });
    });

    mapControlBridge.addHandler(
      RenderMapEvent.ShuffleColors,
      this.mapRenderer.shuffleColors.bind(this.mapRenderer)
    );

    mapControlBridge.addHandler(DebugMapEvent.DisplayMapShader, () => {
      this.mapRenderer.updateUniforms({ uVisualizationMode: VisualizationModes.Shader });
    });

    mapControlBridge.addHandler(DebugMapEvent.DisplayGrayscaleShader, () => {
      this.mapRenderer.updateUniforms({ uVisualizationMode: VisualizationModes.Gray });
    });
  }

  update(time: number) {
    if (!this.initialized) return;
    this.mapRenderer.update(time);
    this.cameraController.update();
  }
}
