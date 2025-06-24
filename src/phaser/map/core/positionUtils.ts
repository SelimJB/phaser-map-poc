import { Point, Size } from '../types/geometry';

export function relativeTo(
  x: number,
  y: number,
  object: Phaser.GameObjects.Components.Transform,
  camera: Phaser.Cameras.Scene2D.Camera
) {
  const objectPosition = {
    x: object.x - camera.worldView.x,
    y: object.y - camera.worldView.y
  };

  return {
    x: x / camera.zoom - objectPosition.x,
    y: y / camera.zoom - objectPosition.y
  };
}

export function getRelativePositionToCanvas(
  gameObject: Phaser.GameObjects.Components.Transform,
  camera: Phaser.Cameras.Scene2D.Camera
) {
  return {
    x: (gameObject.x - camera.worldView.x) * camera.zoom,
    y: (gameObject.y - camera.worldView.y) * camera.zoom
  };
}

export function calculateAbsolutePosition(
  pxPos: Point,
  sceneSize: Size,
  mapSprite: Phaser.GameObjects.Sprite
): Point {
  const offset = {
    x: sceneSize.width / 2,
    y: sceneSize.height / 2
  };

  return {
    x: (pxPos.x - mapSprite.width / 2) * mapSprite.scaleX + offset.x,
    y: (pxPos.y - mapSprite.height / 2) * mapSprite.scaleY + offset.y
  };
}
