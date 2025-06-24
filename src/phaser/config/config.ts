import { MapViewTextures, SceneParameters } from '../map';

export const mapViewTextures: MapViewTextures = {
  map: {
    key: 'map',
    localUrl: '/assets/map/map.png'
  },
  bitmap: {
    key: 'bitmap',
    localUrl: '/assets/map/bitmap.png'
  },
  fxBitmap: {
    key: 'fxBitmap',
    localUrl: '/assets/map/bitmap.png'
  },
  mapBorders: {
    key: 'mapBorders',
    localUrl: '/assets/map/map_borders_transparency.png'
  },
  blankMap: {
    key: 'blankMap',
    localUrl: '/assets/map/map_debug.png'
  },
  initialProvincesDataTexture: {
    key: 'initialProvincesDataTexture',
    localUrl: '/assets/map/province_colors.png'
  },
  patternTexture: {
    key: '',
    localUrl: ''
  }
};

export const sceneParameters: SceneParameters = {
  sceneSize: {
    width: 1024,
    height: 1024
  }
};
