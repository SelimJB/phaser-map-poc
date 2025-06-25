import Phaser from 'phaser';
import { simpleMapConfig } from './config/config';
import { Map } from './map';

export default function initializePhaser(): void {
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
  let mapView: Map;

  function preload(this: Phaser.Scene) {
    mapView = new Map(this, simpleMapConfig);
  }

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });

  function create(this: Phaser.Scene) {
    mapView.create();
  }

  function update(this: Phaser.Scene) {
    mapView.update(this.game.loop.time);
  }
}
