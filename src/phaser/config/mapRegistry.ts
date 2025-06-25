import { SceneConfig } from '../map-engine';
import { simpleMapConfig, worldMapConfig } from './maps';

export enum MapType {
  SIMPLE = 'simple',
  WORLD = 'world'
  // EUROPE = 'europe'
}

export interface MapDefinition {
  id: MapType;
  name: string;
  config: SceneConfig;
}

export const AVAILABLE_MAPS: Record<MapType, MapDefinition> = {
  [MapType.SIMPLE]: {
    id: MapType.SIMPLE,
    name: 'Simple Map',
    config: simpleMapConfig
  },
  [MapType.WORLD]: {
    id: MapType.WORLD,
    name: 'World Map',
    config: worldMapConfig
  }
};

export const getAllMapTypes = (): MapType[] => Object.values(MapType);
export const getMapDefinition = (mapType: MapType): MapDefinition => AVAILABLE_MAPS[mapType];
export const getMapConfig = (mapType: MapType): SceneConfig => AVAILABLE_MAPS[mapType].config;
export const getMapName = (mapType: MapType): string => AVAILABLE_MAPS[mapType].name;
