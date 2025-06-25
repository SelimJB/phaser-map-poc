import { MapViewTextures, SceneConfig } from '../map';

export const simpleMapTextures: MapViewTextures = {
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

export const worldMapTextures: MapViewTextures = {
  map: {
    key: 'map',
    localUrl: '/assets/world-map/map.png'
  },
  bitmap: {
    key: 'bitmap',
    localUrl: '/assets/world-map/bitmap.png'
  },
  fxBitmap: {
    key: 'fxBitmap',
    localUrl: '/assets/world-map/bitmap.png'
  },
  mapBorders: {
    key: 'mapBorders',
    localUrl: '/assets/world-map/map_borders_transparency.png'
  },
  blankMap: {
    key: 'blankMap',
    localUrl: '/assets/world-map/map_debug.png'
  },
  initialProvincesDataTexture: {
    key: 'initialProvincesDataTexture',
    localUrl: '/assets/world-map/province_colors.png'
  },
  patternTexture: {
    key: '',
    localUrl: ''
  }
};

export const simpleMapConfig: SceneConfig = {
  mapTextures: simpleMapTextures,
  sceneSize: {
    width: 1024,
    height: 1024
  },
  provinceJson: '/assets/map/provinces.json'
};

export const worldMapConfig: SceneConfig = {
  mapTextures: worldMapTextures,
  sceneSize: {
    width: 1600,
    height: 1600
  },
  provinceJson: '/assets/world-map/provinces.json'
};
