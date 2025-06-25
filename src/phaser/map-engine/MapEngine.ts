import MapPointerController from './core/MapPointerController';
import MapRenderer from './rendering/MapRenderer';
import { EventManager } from '../services/EventManager';
import CameraController from './core/CameraController';
import { QuantizationService } from './core/QuantizationService';
import { MockProvinceRepository, ProvinceRepository } from './data/ProvinceRepository';
import { MapInteractionData, Color, MapUniforms, SceneConfig } from './types';
import { calculateGlowingColor } from '../utils/colorUtils';
import { Point } from './types/geometry';
import { MapTextures } from './types/textures';
import { uniformEvents, UniformChangeData } from '../services/uniformEvents';
import { getAssetPath } from '../utils/getAssetPath';

export default class MapEngine {
  private initialized = false;
  private eventManager: EventManager;
  private cameraController: CameraController;
  private mapRenderer: MapRenderer;
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
    this.mapRenderer = new MapRenderer(scene, this.quantizationService);
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
        console.log('Province data loaded successfully:', provincesData?.length || 0, 'provinces');
      } else {
        console.error('Province JSON data not found in cache. Available JSON keys:');
      }
    }

    this.provinceRepository.initialize(provincesData);

    const mapTexture = this.scene.textures.get(this.mapTextures.bitmap.key);
    if (!mapTexture) throw new Error('Map texture not found');

    const mapWidth = mapTexture.source[0].width;
    const mapHeight = mapTexture.source[0].height;

    const pos = {
      x: this.sceneConfig.sceneSize.width / 2 - mapWidth / 2,
      y: this.sceneConfig.sceneSize.height / 2 - mapHeight / 2
    } as Point;

    this.scene.add.image(pos.x, pos.y, this.mapTextures.initialProvincesDataTexture.key);
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

    const provinceColor = [0.4, 0.4, 0.4] as Color;

    const uGlowColor = calculateGlowingColor(provinceColor, 1, 1, 0.05, 0.2);

    const uniforms: MapUniforms = {
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

    this.eventManager.emit('provinceClick', data);
  }

  private initializeEvents() {
    uniformEvents.addHandler('uniformChange', (data: UniformChangeData) => {
      this.mapRenderer.updateUniforms({ [data.uniform]: data.value });
    });
  }

  update(time: number) {
    if (!this.initialized) return;
    this.mapRenderer.update(time);
    this.cameraController.update();
  }
}
