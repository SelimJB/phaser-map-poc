import { sceneParameters } from '@/phaser/config/config';
import ColorQuantizer from './ColorQuantizer';
import { QuantizationService } from './QuantizationService';
import { ProvinceRepository } from '../data/ProvinceRepository';
import { MapInteractionData, Color } from '../types';
import { calculateAbsolutePosition, relativeTo } from './positionUtils';

export default class MapPointerController {
  private emitter: Phaser.Events.EventEmitter;

  private pointerDownData: MapInteractionData | null = null;

  onProvinceClick(f: (data: MapInteractionData) => void) {
    this.emitter.on('provinceClick', f);
  }

  onPointerDown(f: (data: MapInteractionData) => void) {
    this.emitter.on('pointerDown', f);
  }

  onPointerUp(f: (data: MapInteractionData) => void) {
    this.emitter.on('pointerUp', f);
  }
  onProvinceClickUp(f: (data: MapInteractionData) => void) {
    this.emitter.on('provinceClickUp', f);
  }

  onPointerMove(f: (data: MapInteractionData) => void) {
    this.emitter.on('move', f);
  }

  private bitmap: Phaser.GameObjects.Sprite;
  private pixelQuantizer: ColorQuantizer;

  constructor(
    scene: Phaser.Scene,
    bitmap: Phaser.GameObjects.Sprite,
    quantizationService: QuantizationService,
    private provinceRepository: ProvinceRepository
  ) {
    this.emitter = new Phaser.Events.EventEmitter();
    this.initializeClickEvents(bitmap as Phaser.GameObjects.Sprite, scene);
    this.initializeHoverEvents(bitmap as Phaser.GameObjects.Sprite, scene);
    this.bitmap = bitmap;

    const bitmapImage = bitmap.texture.getSourceImage() as HTMLImageElement;
    this.pixelQuantizer = new ColorQuantizer(bitmapImage, quantizationService);
  }

  private initializeClickEvents(mapSprite: Phaser.GameObjects.Sprite, scene: Phaser.Scene) {
    mapSprite.setInteractive();

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const pointerData = this.getPointerData(pointer, scene);
      this.pointerDownData = pointerData;

      this.emitter.emit('pointerDown', pointerData);
      if (pointerData.province) this.emitter.emit('provinceClick', pointerData);
      else this.emitter.emit('backgroundClick', pointerData);
    });

    mapSprite.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const pointerData = this.getPointerData(pointer, scene);

      // Do not emit click events if the pointer has moved since the pointerdown event
      if (!this.pointerDownData) return;
      const pointerDownX = this.pointerDownData.pxPosition.x;
      const pointerDownY = this.pointerDownData.pxPosition.y;
      if (pointerData.pxPosition.x !== pointerDownX || pointerData.pxPosition.y !== pointerDownY)
        return;

      if (pointerData.province) this.emitter.emit('provinceClickUp', pointerData);

      this.emitter.emit('pointerUp', pointerData);
    });
  }

  private initializeHoverEvents(mapSprite: Phaser.GameObjects.Sprite, scene: Phaser.Scene) {
    mapSprite.setInteractive();

    mapSprite.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const pointerData = this.getPointerData(pointer, scene);
      this.emitter.emit('move', pointerData);
    });
  }

  private getPointerData(pointer: Phaser.Input.Pointer, scene: Phaser.Scene): MapInteractionData {
    const screenPosition = { x: pointer.x, y: pointer.y };
    const pxPosition = this.getPixelPosition(
      { x: screenPosition.x, y: screenPosition.y },
      scene.cameras.main
    );
    const bitmapPixel = this.pixelQuantizer.getPixelColor(pxPosition.x, pxPosition.y);
    const bitmapColor: Color = [bitmapPixel.red, bitmapPixel.green, bitmapPixel.blue];
    const quantizedValue = this.pixelQuantizer.getQuantizedValue(pxPosition.x, pxPosition.y);
    const absolutePixelPos = calculateAbsolutePosition(
      pxPosition,
      sceneParameters.sceneSize,
      this.bitmap
    );

    const province =
      quantizedValue !== 0
        ? this.provinceRepository.getProvinceByQuantization(quantizedValue)
        : undefined;

    const pointerData: MapInteractionData = {
      pxPosition,
      screenPosition,
      absolutePxPosition: absolutePixelPos,
      province,
      quantization: quantizedValue,
      bitmapColor
    } as MapInteractionData;

    return pointerData;
  }

  private getPixelPosition(
    pos: { x: number; y: number },
    camera: Phaser.Cameras.Scene2D.Camera
  ): { x: number; y: number } {
    const pointPosition = relativeTo(pos.x, pos.y, this.bitmap, camera);
    const pixpos = { x: 0, y: 0 };
    pixpos.x = pointPosition.x / this.bitmap.scale + this.bitmap.width / 2;
    pixpos.y = pointPosition.y / this.bitmap.scale + this.bitmap.height / 2;
    return pixpos;
  }

  cleanEmmiter(f: (data: MapInteractionData) => void, event: string) {
    this.emitter.off(event, f);
  }

  dispose() {
    this.emitter.removeAllListeners();
  }
}
