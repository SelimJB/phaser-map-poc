import { Color } from '.';
import { Size } from './geometry';
import { ProvinceViewData } from './province';
import { MapViewTextures } from './textures';

export type SceneParameters = {
  sceneSize: Size;
};

export type MapInteractionData = {
  pxPosition: { x: number; y: number };
  screenPosition: { x: number; y: number };
  absolutePxPosition: { x: number; y: number };
  province?: ProvinceViewData;
  quantization: number;
  bitmapColor: Color;
};

export type SceneConfig = {
  mapTextures: MapViewTextures;
  provinceJsonKey: string;
  sceneSize: Size;
  provinceJson: string;
};
