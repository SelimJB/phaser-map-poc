export default class CameraController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private zoomLevel: number = 1;
  private readonly ZOOM_SPEED = 0.1;
  private readonly MOVE_SPEED = 20;

  constructor(private scene: Phaser.Scene) {
    this.camera = scene.cameras.main;

    if (!scene.input.keyboard) throw new Error('Keyboard input not available');
    this.cursors = scene.input.keyboard.createCursorKeys();

    const width = scene.game.config.width as number;
    const height = scene.game.config.height as number;
    this.camera.setBounds(-width, -height, width * 2, height * 2);
    this.camera.centerOn(0, 0);

    this.scene.input.on(
      'wheel',
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[],
        deltaX: number,
        deltaY: number
      ) => {
        if (deltaY > 0) {
          this.zoomOut();
        } else {
          this.zoomIn();
        }
      }
    );
  }

  private zoomIn() {
    this.zoomLevel = Phaser.Math.Clamp(this.zoomLevel + this.ZOOM_SPEED, 0.5, 2);
    this.camera.setZoom(this.zoomLevel);
  }

  private zoomOut() {
    this.zoomLevel = Phaser.Math.Clamp(this.zoomLevel - this.ZOOM_SPEED, 0.5, 2);
    this.camera.setZoom(this.zoomLevel);
  }

  update() {
    const speed = this.MOVE_SPEED / this.zoomLevel;

    if (this.cursors.left.isDown) {
      this.camera.scrollX = Phaser.Math.Clamp(
        this.camera.scrollX - speed,
        this.camera.getBounds().x,
        this.camera.getBounds().right
      );
    }
    if (this.cursors.right.isDown) {
      this.camera.scrollX = Phaser.Math.Clamp(
        this.camera.scrollX + speed,
        this.camera.getBounds().x,
        this.camera.getBounds().right
      );
    }
    if (this.cursors.up.isDown) {
      this.camera.scrollY = Phaser.Math.Clamp(
        this.camera.scrollY - speed,
        this.camera.getBounds().y,
        this.camera.getBounds().bottom
      );
    }
    if (this.cursors.down.isDown) {
      this.camera.scrollY = Phaser.Math.Clamp(
        this.camera.scrollY + speed,
        this.camera.getBounds().y,
        this.camera.getBounds().bottom
      );
    }
  }
}
