import { SceneConfig } from '../map-engine';
import { europaMapTextures, simpleMapTextures, worldMapTextures } from './textures';

export const simpleMapConfig: SceneConfig = {
  mapTextures: simpleMapTextures,
  sceneSize: {
    width: 1024,
    height: 1024
  },
  provinceJsonKey: 'simple-provinces',
  provinceJson: '/assets/simple-map/provinces.json'
};

export const worldMapConfig: SceneConfig = {
  mapTextures: worldMapTextures,
  sceneSize: {
    width: 1600,
    height: 1600
  },
  provinceJsonKey: 'world-provinces',
  provinceJson: '/assets/world-map/provinces.json'
};

export const europaMapConfig: SceneConfig = {
  mapTextures: europaMapTextures,
  sceneSize: {
    width: 1024,
    height: 1024
  },
  provinceJsonKey: 'europa-provinces',
  provinceJson: '/assets/europa-map/provinces.json'
};
