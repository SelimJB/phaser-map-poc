import { Color, MapUniforms } from '.';
import { Size } from './geometry';
import { ProvinceData } from './province';
import { MapTextures } from './textures';

export type SceneParameters = {
  sceneSize: Size;
};

export type MapInteractionData = {
  pxPosition: { x: number; y: number };
  screenPosition: { x: number; y: number };
  absolutePxPosition: { x: number; y: number };
  province?: ProvinceData;
  quantization: number;
  bitmapColor: Color;
};

export type SceneConfig = {
  mapTextures: MapTextures;
  provinceJsonKey: string;
  sceneSize: Size;
  provinceJson: string;
  defaultMapUniforms: MapUniforms;
};
