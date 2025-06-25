import Phaser from 'phaser';
import { MapType, simpleMapConfig, worldMapConfig } from './config';
import { GameMap } from './map';

export default function initializePhaser(): void {
  const mapViews: Map<string, GameMap> = new Map();
  let currentMapView: GameMap;
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
    mapViews.set(MapType.SIMPLE, new GameMap(this, simpleMapConfig));
    mapViews.set(MapType.WORLD, new GameMap(this, worldMapConfig));
    currentMapView = mapViews.get(MapType.SIMPLE)!;
  }

  function create(this: Phaser.Scene) {
    currentMapView.create();
  }

  function update(this: Phaser.Scene) {
    currentMapView.update(this.game.loop.time);
  }

  function switchMap(mapType: MapType) {
    if (mapType === currentMapType) return;

    const scene = game.scene.getScene('default');
    if (!scene) return;

    scene.children.removeAll();

    currentMapView = mapViews.get(mapType) as GameMap;
    currentMapView.create();
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
