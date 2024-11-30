class GameOverScene extends Phaser.Scene {

    constructor() {
        super("game-over-scene")
    }

    preload(){
    }

    create() {
        const width = this.cameras.main.width
        const height = this.cameras.main.height
  
        const titleText = this
        .add
        .bitmapText(width /2, height / 2, 'pixelFont', 'GAME OVER', 40)
        .setOrigin(0.5)

      }
      
}
