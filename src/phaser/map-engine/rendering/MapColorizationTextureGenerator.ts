import { hexToNormalizedRgb, normalizedRgbToHexNumber } from '@/phaser/utils/colorUtils';
import Phaser from 'phaser';
import { ProvinceRepository } from '../data/ProvinceRepository';
import { Color } from '../types';
import palette from './palettes/palette1.json';

const TextureDim = 128;

export default class MapColorizationTextureGenerator {
  static provinceColorsTextureKey = 'provinceColors';
  private provinceColors: Map<number, Color> = new Map();

  constructor(
    private scene: Phaser.Scene,
    private viewData: ProvinceRepository
  ) {}

  _playerFactionIds: number[] = [];

  set playerFactionIds(value: number[]) {
    this._playerFactionIds = value;
  }

  getProvinceColor(quant: number): Color {
    const color = this.provinceColors.get(quant);
    if (!color) {
      console.error(`Province color for quant:${quant} not found`);
      return [0, 0, 0] as Color;
    }
    return color;
  }

  generateProvinceColorsTexture(): Phaser.Textures.Texture {
    this.provinceColors = new Map(
      this.viewData.provinces.map((province) => [
        province.hash,
        hexToNormalizedRgb(palette[Math.floor(Math.random() * palette.length)])
      ])
    );

    const provinceColors = Array.from(this.provinceColors.entries())
      .map(([hash, color]) => [hash, ...color])
      .flat();

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.clearAlpha();
    graphics.fillRect(0, 0, TextureDim, TextureDim);

    for (let i = 0; i < provinceColors.length; i += 4) {
      const color = provinceColors.slice(i + 1, i + 4) as Color;
      const quant = provinceColors[i];

      const y = Math.floor(quant / TextureDim);
      const x = quant % TextureDim;

      if (y >= TextureDim) {
        console.error(`Province:${i}, Quant:${quant} out of bounds: ${x}, ${y}`);
        continue;
      }

      graphics.fillStyle(normalizedRgbToHexNumber(color), 1);
      graphics.fillPoint(x, y);
    }

    graphics.generateTexture(
      MapColorizationTextureGenerator.provinceColorsTextureKey,
      TextureDim,
      TextureDim
    );
    graphics.destroy();

    const texture = this.scene.textures.get(
      MapColorizationTextureGenerator.provinceColorsTextureKey
    );
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    return texture;
  }
}
