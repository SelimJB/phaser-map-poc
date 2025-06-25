import { Color, QuantizationConfig } from '../types';

export class QuantizationService {
  private readonly config: QuantizationConfig;

  constructor(precision: number) {
    this.config = {
      precision,
      levelCount: Math.floor(255 / precision) + 1,
      offset: 255 % precision
    };
  }

  get precision(): number {
    return this.config.precision;
  }

  get levelCount(): number {
    return this.config.levelCount;
  }

  get offset(): number {
    return this.config.offset;
  }

  quantizeColor(normalizedColor: Color): number {
    const [r, g, b] = normalizedColor;
    return g + r * this.levelCount + b * this.levelCount ** 2;
  }

  dequantizeColor(value: number): Color {
    const g = value % this.levelCount;
    const r = Math.floor(value / this.levelCount) % this.levelCount;
    const b = Math.floor(value / this.levelCount ** 2);
    return [r, g, b];
  }

  normalizeColor(color: Color): Color {
    return color.map((c) => c / 255) as Color;
  }

  denormalizeColor(color: Color): Color {
    return color.map((c) => Math.floor(c * 255)) as Color;
  }
}
