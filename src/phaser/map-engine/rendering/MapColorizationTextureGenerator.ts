import { normalizedRgbToHexNumber } from '@/phaser/utils/colorUtils';
import Phaser from 'phaser';
import { ProvinceRepository } from '../data/ProvinceRepository';
import { Color } from '../types';

const TextureDim = 128;

export default class MapColorizationTextureGenerator {
  static provinceColorsTextureKey = 'provinceColors';

  constructor(
    private scene: Phaser.Scene,
    private viewData: ProvinceRepository
  ) {}

  _playerFactionIds: number[] = [];

  set playerFactionIds(value: number[]) {
    this._playerFactionIds = value;
  }

  generateProvinceColorsTexture(): Phaser.Textures.Texture {
    const provinceColors = this.viewData.provinces
      .map((province) => [province.hash, Math.random(), Math.random(), Math.random()])
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
