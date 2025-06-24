import Phaser from 'phaser';
import { Map, MapViewPipelineType, MapPipelineItem } from './map';

export default function initializePhaser(): void {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
    this.load.image('clouds', '/assets/clouds.png');

    const shaderItems = [
      {
        shaderPath: '/assets/map.frag',
        pipelineType: MapViewPipelineType.Default
      }
    ] as MapPipelineItem[];

    (async () => {
      const loadPipeline = Map.loadPipelines(this.game, shaderItems);
      await Promise.all([loadPipeline]);
      mapView = new Map(this);
    })();
  }

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });

  function create(this: Phaser.Scene) {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'clouds');
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, 'Hello ! (Phaser)', {
        fontSize: '70px',
        color: '#fff'
      })
      .setOrigin(0.5);

    mapView.create();
  }

  function update(this: Phaser.Scene) {
    mapView.update(this.game.loop.time);
  }
}
