import Phaser from 'phaser';
import { AVAILABLE_MAPS, MapType } from './config';
import { MapEngine } from './map-engine';

export default function initializePhaser(): void {
  const maps: Map<MapType, MapEngine> = new Map();
  let currentMap: MapEngine;
  let currentMapType: MapType = MapType.SIMPLE;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game-container',
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  const game = new Phaser.Game(config);

  function preload(this: Phaser.Scene) {
    for (const map of Object.values(AVAILABLE_MAPS)) {
      maps.set(map.id, new MapEngine(this, map.config));
    }
    currentMap = maps.get(MapType.SIMPLE)!;
  }

  function create(this: Phaser.Scene) {
    currentMap.create();
  }

  function update(this: Phaser.Scene) {
    currentMap.update(this.game.loop.time);
  }

  function switchMap(mapType: MapType) {
    if (mapType === currentMapType) return;

    const scene = game.scene.getScene('default');
    if (!scene) return;

    scene.children.removeAll();

    currentMap = maps.get(mapType) as MapEngine;
    currentMap.create();
    currentMapType = mapType;
  }

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
  window.switchMap = switchMap;
  window.getCurrentMapType = () => currentMapType;
}

declare global {
  interface Window {
    switchMap: (mapType: MapType) => void;
    getCurrentMapType: () => MapType;
  }
}
