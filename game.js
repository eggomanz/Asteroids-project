var gameSettings = {
  playerSpeed: 150,
  maxPowerups: 2,
  powerUpVel: 50,
}

var config = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: [LoaderScene, MainMenuScene, Scene1, Scene2, TwoPlayerScene, GameOverScene],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
        debug: false,
        debugShowVelocity: false
    }
  }
}


var game = new Phaser.Game(config);