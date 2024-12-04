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
      .bitmapText(width /2, height / 2 - 30, 'pixelFont', 'Asteroids', 40)
      .setOrigin(0.5)

    // Instruction text for single-player mode
    const instructionText = this.add.bitmapText(width / 2, height / 2 + 20, 'pixelFont', 'Press SPACE for Single Player Mode', 20)
    .setOrigin(0.5);

    // Instruction text for two-player mode
    const instructionText2 = this.add.bitmapText(width / 2, height / 2 + 40, 'pixelFont', 'Press ENTER for 2 Player Mode', 20)
    .setOrigin(0.5);

    this.music = this.sound.add("music");
        
    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    
    this.music.play(musicConfig);

    // Define keys
    this.keys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER
    });
    
    }

    update() {
      // Check if SPACE key is pressed for single-player mode
      if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        this.scene.switch("bootGame");  
      }

    // Check if ENTER key is pressed for two-player mode
    if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
        this.scene.switch("two-player-mode"); 
    }
  }
}

