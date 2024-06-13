import Phaser from 'phaser';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload(this: Phaser.Scene) {
  this.load.image('clouds', 'assets/clouds.png');
}

function create(this: Phaser.Scene) {
  this.add.image(400, 300, 'clouds');
  this.add.text(400, 500, 'Hello !', { fontSize: '70px', color: '#fff' }).setOrigin(0.5);
}

function update(this: Phaser.Scene) {}

ReactDOM.render(<App />, document.getElementById('root'));