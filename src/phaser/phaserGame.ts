import Phaser from 'phaser';
import { Map, MapViewPipelineType, MapPipelineItem } from './map';

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
    mapView = new Map(this);

    const shaderItems = [
      {
        shaderPath: '/assets/map.frag',
        pipelineType: MapViewPipelineType.Default
      }
    ] as MapPipelineItem[];

    (async () => {
      const loadPipeline = Map.loadPipelines(this.game, shaderItems);
      await Promise.all([loadPipeline]);
    })();
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
