import Phaser from 'phaser';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload(this: Phaser.Scene) {
  this.load.image('clouds', 'assets/clouds.png');
}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

function create(this: Phaser.Scene) {
  this.add.image(this.scale.width / 2, this.scale.height / 2, 'clouds');
  this.add
    .text(this.scale.width / 2, this.scale.height / 2 + 100, 'Hello ! (Phaser)', {
      fontSize: '70px',
      color: '#fff',
    })
    .setOrigin(0.5);
}

function update(this: Phaser.Scene) {}

ReactDOM.render(<App />, document.getElementById('root'));
