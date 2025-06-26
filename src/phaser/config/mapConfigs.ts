import { SceneConfig } from '../map-engine';
import { europaMapTextures, simpleMapTextures, worldMapTextures } from './textures';
import {
  defaultEuropaMapUniforms,
  defaultSimpleMapUniforms,
  defaultWorldMapUniforms
} from '../map-engine/rendering/uniforms/defaultMapShaderUniforms';

export const simpleMapConfig: SceneConfig = {
  mapTextures: simpleMapTextures,
  sceneSize: {
    width: 2048,
    height: 2048
  },
  provinceJsonKey: 'simple-provinces',
  provinceJson: '/assets/simple-map/provinces.json',
  defaultMapUniforms: defaultSimpleMapUniforms
};

export const worldMapConfig: SceneConfig = {
  mapTextures: worldMapTextures,
  sceneSize: {
    width: 2048,
    height: 2048
  },
  provinceJsonKey: 'world-provinces',
  provinceJson: '/assets/world-map/provinces.json',
  defaultMapUniforms: defaultWorldMapUniforms
};

export const europaMapConfig: SceneConfig = {
  mapTextures: europaMapTextures,
  sceneSize: {
    width: 2048,
    height: 2048
  },
  provinceJsonKey: 'europa-provinces',
  provinceJson: '/assets/europa-map/provinces.json',
  defaultMapUniforms: defaultEuropaMapUniforms
};
