import { Color } from '.';
import { Size } from './geometry';
import { ProvinceViewData } from './province';

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
