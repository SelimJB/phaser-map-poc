import { Color } from '../types';
import { QuantizationService } from './QuantizationService';

export default class ColorQuantizer {
  private bitmapTexture: HTMLImageElement;
  private bitmapCanvas!: HTMLCanvasElement;
  private bitmapCtx!: CanvasRenderingContext2D;
  private quantizationLevelCount: number;
  private quantizationPrecision: number;

  constructor(bitmapTexture: HTMLImageElement, quantizationConfig: QuantizationService) {
    this.quantizationPrecision = quantizationConfig.precision;
    this.bitmapTexture = bitmapTexture;
    this.init();
    this.quantizationLevelCount = quantizationConfig.levelCount;
  }

  private init() {
    this.bitmapCanvas = document.createElement('canvas');
    this.bitmapCanvas.width = this.bitmapTexture.width;
    this.bitmapCanvas.height = this.bitmapTexture.height;
    this.bitmapCtx = this.bitmapCanvas.getContext('2d')!;
    this.bitmapCtx.imageSmoothingEnabled = false;
    this.bitmapCtx.drawImage(this.bitmapTexture, 0, 0);
  }

  getPixelColor(x: number, y: number): Phaser.Display.Color {
    const pixelData = this.bitmapCtx.getImageData(x, y, 1, 1).data;
    return new Phaser.Display.Color(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);
  }

  getCanvas(): HTMLCanvasElement {
    return this.bitmapCanvas;
  }

  getQuantizedValue(x: number, y: number): number {
    const color = this.getPixelColor(x, y);

    const r = Math.floor(color.red / this.quantizationPrecision);
    const g = Math.floor(color.green / this.quantizationPrecision);
    const b = Math.floor(color.blue / this.quantizationPrecision);

    if (color.alphaGL < 1) return 0;

    const quantization = g + r * this.quantizationLevelCount + b * this.quantizationLevelCount ** 2;

    return quantization;
  }

  getPixelShaderColor(x: number, y: number): Color {
    const pixelData = this.bitmapCtx.getImageData(x, y, 1, 1).data;
    return [pixelData[0] / 255, pixelData[1] / 255, pixelData[2] / 255];
  }
}
