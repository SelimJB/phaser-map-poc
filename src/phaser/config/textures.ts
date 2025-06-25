import { MapTextures } from '../map-engine';

export const simpleMapTextures: MapTextures = {
  map: {
    key: 'simple-map',
    localUrl: '/assets/map/map.png'
  },
  bitmap: {
    key: 'simple-bitmap',
    localUrl: '/assets/map/bitmap.png'
  },
  mapBorders: {
    key: 'simple-mapBorders',
    localUrl: '/assets/map/map_borders_transparency.png'
  },
  blankMap: {
    key: 'simple-blankMap',
    localUrl: '/assets/map/map_debug.png'
  },
  initialProvincesDataTexture: {
    key: 'simple-initialProvincesDataTexture',
    localUrl: '/assets/map/province_colors.png'
  }
};

export const worldMapTextures: MapTextures = {
  map: {
    key: 'world-map',
    localUrl: '/assets/world-map/map.png'
  },
  bitmap: {
    key: 'world-bitmap',
    localUrl: '/assets/world-map/bitmap.png'
  },
  mapBorders: {
    key: 'world-mapBorders',
    localUrl: '/assets/world-map/map_borders_transparency.png'
  },
  blankMap: {
    key: 'world-blankMap',
    localUrl: '/assets/world-map/map_debug.png'
  },
  initialProvincesDataTexture: {
    key: 'world-initialProvincesDataTexture',
    localUrl: '/assets/world-map/province_colors.png'
  }
};
