class LoaderScene extends Phaser.Scene {
    constructor() {
      super("loader-scene");
    }

preload(){
    this.load.image("small-asteroid", "assets/images/meteorGrey_small1.png")
    this.load.image("med-asteroid", "assets/images/meteorGrey_med1.png")
    this.load.image("big-asteroid", "assets/images/meteorGrey_big4.png")
    this.load.image("starbackground", "assets/images/starbackground.jpeg");
    //
    this.load.spritesheet("ship", "assets/spritesheets/ship.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png",{
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("player", "assets/spritesheets/player.png",{
      frameWidth: 16,
      frameHeight: 24
    });
    this.load.spritesheet("beam", "assets/spritesheets/beam.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("smallasteroid", "assets/spritesheets/smallasteroid.png",{
      frameWidth: 20,
      frameHeight: 20
    });
    this.load.spritesheet("medasteroid", "assets/spritesheets/medasteroid.png",{
      frameWidth: 39,
      frameHeight: 39
    });

    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    this.load.audio("audio_beam", ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
    this.load.audio("audio_explosion", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
    this.load.audio("audio_pickup", ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
    this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platformer12.mp3"]);
  }

  create() {
    this.scene.switch("main-menu-scene")
  }
}