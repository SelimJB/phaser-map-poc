import MapViewPointerHandler from './core/MapPointerController';
import MapRenderer from './rendering/MapRenderer';
import { EventManager } from '../services/EventManager';
import CameraController from './core/CameraController';
import { QuantizationService } from './core/QuantizationService';
import { MockProvinceRepository, ProvinceRepository } from './data/ProvinceRepository';
import { loadShaderPipeline } from './rendering/loadShaderPipeline';
import { MapPipelineItem, MapInteractionData, Color, MapUniforms } from './types';
import { mapViewTextures, sceneParameters } from '../config/config';
import { calculateGlowingColor } from '../utils/colorUtils';
import { Point } from './types/geometry';
import { MapViewTextures } from './types/textures';

export default class Map {
  private initialized = false;
  private mapRenderer: MapRenderer;
  private eventManager: EventManager;
  private cameraController: CameraController;

  constructor(
    public scene: Phaser.Scene,
    private readonly quantizationService: QuantizationService = new QuantizationService(5),
    private readonly provinceRepository: ProvinceRepository = new MockProvinceRepository()
  ) {
    this.eventManager = new EventManager();
    this.preload(mapViewTextures);
    this.mapRenderer = new MapRenderer(scene, this.quantizationService);
    this.cameraController = new CameraController(scene);
  }

  private preload(sprites: MapViewTextures) {
    MapRenderer.preload(this.scene, sprites);
  }

  static async loadPipelines(game: Phaser.Game, shaderItems: MapPipelineItem[]) {
    MapRenderer.loadedPipelines = shaderItems.map((s) => s.pipelineType);

    const loadPromises = shaderItems.map((item) => loadShaderPipeline(game, item.pipelineType));

    await Promise.all(loadPromises);
  }

  async create() {
    this.provinceRepository.initialize();

    const mapTexture = this.scene.textures.get(mapViewTextures.bitmap.key);
    if (!mapTexture) throw new Error('Map texture not found');

    const mapWidth = mapTexture.source[0].width;
    const mapHeight = mapTexture.source[0].height;

    const pos = {
      x: sceneParameters.sceneSize.width / 2 - mapWidth / 2,
      y: sceneParameters.sceneSize.height / 2 - mapHeight / 2
    } as Point;

    this.scene.add.image(pos.x, pos.y, mapViewTextures.initialProvincesDataTexture.key);
    this.scene.add.image(pos.x, pos.y, mapViewTextures.fxBitmap.key);
    const bitmap = this.scene.add.sprite(pos.x, pos.y, mapViewTextures.bitmap.key);
    bitmap.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.scene.add.image(pos.x, pos.y, mapViewTextures.blankMap.key);

    this.mapRenderer.displayMapImage(mapViewTextures.blankMap.key, pos);
    this.mapRenderer.setupMapViewPipelines(mapViewTextures);

    this.initializePointerHandler(bitmap);
    this.mapRenderer.updateUniforms({ uClickTime: this.scene.time.now / 100 });
    this.initializeEvents();
    this.initialized = true;
  }

  private initializePointerHandler(bitmap: Phaser.GameObjects.Sprite) {
    const pointerHandler = new MapViewPointerHandler(
      this.scene,
      bitmap,
      this.quantizationService,
      this.provinceRepository
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

  private initializeEvents() {}

  update(time: number) {
    if (!this.initialized) return;
    this.mapRenderer.update(time);
    this.cameraController.update();
  }
}
