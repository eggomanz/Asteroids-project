class MainMenuScene extends Phaser.Scene {
    constructor() {
      super("main-menu-scene");
    }

    preload(){

    }

    create() {
      const width = this.cameras.main.width
      const height = this.cameras.main.height

      const titleText = this
      .add
      .bitmapText(width /2, height / 2 - 50, 'pixelFont', 'Asteroids', 40)
      .setOrigin(0.5)

      const instructionText = this
    .add
    .bitmapText(width / 2, height / 2 + 20, 'pixelFont', 'Press SPACE to start', 20)
    .setOrigin(0.5);

      this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
      if(this.cursors.space.isDown) {
        this.scene.switch("bootGame")
      }
    }
}
