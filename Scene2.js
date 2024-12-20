//this.ship1.setScale(2) makes the ship bigger
//this.ship1.flipY = true 
//this.ship1.angle +=3 rotates the ship
class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");

  }
  preload() {
    this.load.image("small-asteroid", "assets/images/meteorGrey_small1.png")
    this.load.image("med-asteroid", "assets/images/meteorGrey_med1.png")
    this.load.image("big-asteroid", "assets/images/meteorGrey_big4.png")
}

  create() {
/*
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "starbackground");
    this.background.setOrigin(0, 0);

    this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

    this.smallasteroid = this.add.sprite(config.width / 2 - 50, config.height / 2, "smallasteroid");
    this.medasteroid = this.add.sprite(config.width / 2 - 50, config.height / 2, "medasteroid");
*/
    this.enemies = this.physics.add.group();
    this.spawnEnemies();
    /*
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.enemies.add(this.smallasteroid);
    this.enemies.add(this.medasteroid);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.smallasteroid.play("smallasteroid_anim");
    this.medasteroid.play("medasteroid_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.smallasteroid.setInteractive();
    this.medasteroid.setInteractive();
*/
    this.input.on('gameobjectdown', this.destroyShip, this);

    this.physics.world.setBoundsCollision();

    this.powerUps = this.physics.add.group();


    for (var i = 0; i < gameSettings.maxPowerups; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(gameSettings.powerUpVel, gameSettings.powerUpVel);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);

    }
    /*
   //generate our asteriods
   this.asteriodGroup = this.physics.add.group()
   this.asteriodArray = []

   for (let i = 0; i < 15; i++) {
       const asteriod = new Asteroid(this, 300, 300)

       const xPos = Phaser.Math.RND.between(0, 800)
       const yPos = Phaser.Math.RND.between(0, 600)
       asteriod.setPosition(xPos, yPos)
       asteriod.setActive(true)
       asteriod.setVisible(true)

       this.asteriodGroup.add(asteriod, true)
       this.asteriodArray.push(asteriod)
   }*/
   this.projectiles = this.physics.add.group({
       classType: Beam2,
       maxSize: 1,
       runChildUpdate: true
   })


    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setDrag(2)
    this.player.setMaxVelocity(3000)
    this.player.setCollideWorldBounds(true);


    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //this.projectiles = this.add.group();

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    //this.physics.add.overlap(this.projectiles, this.asteriodGroup, this.collisionPlayer1, null, this);

    var graphics = this.add.graphics();
    graphics.fillStyle("Black");
    graphics.fillRect(0,0,config.width,20);

    this.score = 0;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + scoreFormated  , 16);

    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.pickupSound = this.sound.add("audio_pickup");

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

  }
    spawnEnemies() {
      for (var i = 0; i < Phaser.Math.Between(3, 30); i++) {
        var randomDirection = Phaser.Math.Between(0, 3);
        var x, y;
        switch (randomDirection) {
          case 0: // spawn from the top
            x = Phaser.Math.Between(0, config.width);
            y = 0;
            break;
          case 1: // spawn from the bottom
            x = Phaser.Math.Between(0, config.width);
            y = config.height;
            break;
          case 2: // spawn from the left
            x = 0;
            y = Phaser.Math.Between(0, config.height);
            break;
          case 3: // spawn from the right
            x = config.width;
            y = Phaser.Math.Between(0, config.height);
            break;
        }
        var asteroidType = Phaser.Math.RND.pick(["small-asteroid", "med-asteroid", "big-asteroid"]);
        var asteroid = this.physics.add.sprite(x, y, asteroidType);
        this.enemies.add(asteroid);
        asteroid.setInteractive();
        asteroid.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        asteroid.setCollideWorldBounds(true);
        asteroid.setBounce(1);
      }
    }
  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
    this.pickupSound.play();
 
    this.playerSpeedBoost = gameSettings.playerSpeed * 1.5;
    this.time.addEvent({
       delay: 5000,  // Duration of power-up effect (e.g., 5 seconds)
       callback: () => {
          this.playerSpeedBoost = gameSettings.playerSpeed;
       },
       callbackScope: this,
       loop: false
    });
 }

  hurtPlayer(player, enemy) {

    this.resetShipPos(enemy);

    // 4.3 don't hurt the player if it is invincible
    if(this.player.alpha < 1){
        return;
    }

    // 2.2 spawn a explosion animation
    var explosion = new Explosion(this, player.x, player.y);

    // 2.3 disable the player and hide it
    player.disableBody(true, true);

    // 3.1 after a time enable the player again
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  resetPlayer(){
    // 3.2 enable the player again
    var x = config.width / 2 - 8;
    var y = config.height + 64;
    this.player.enableBody(true, x, y, true, true);


    //
    // 4.1 make the player transparent to indicate invulnerability
    this.player.alpha = 0.5;
    //
    //
    // 4.2 move the ship from outside the screen to its original position
    var tween = this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: function(){
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  hitEnemy(projectile, enemy) {

    // 2.1 spawn an explosion animation
    var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;

     var scoreFormated = this.zeroPad(this.score, 6);
     this.scoreLabel.text = "SCORE " + scoreFormated;
     this.explosionSound.play();
  }


  zeroPad(number, size){
      var stringNumber = String(number);
      while(stringNumber.length < (size || 2)){
        stringNumber = "0" + stringNumber;
      }
      return stringNumber;
  }




  update() {



    /*this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);
    // for testing purpouses
    // this.ship1.destroy();
    // this.ship2.destroy();
    // this.ship3.destroy();
    this.moveShip(this.smallasteroid, 1);
    this.moveShip(this.medasteroid, 2);*/

    //this.background.tilePositionY -= 0.5;


    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      const shoot = this.projectiles.get()
            if (shoot) {
                shoot.fire(this.player.x, this.player.y, this.player.rotation)
                this.sound.play("audio_beam")
            }
        }


  }

  shootBeam() {
      var beam = new Beam(this);
      this.beamSound.play();
  }
  movePlayerManager() {
    this.player.setVelocity(0);
    this.player.setAngularVelocity(0); // Reset angular velocity
    const playerSpeed = this.playerSpeedBoost || gameSettings.playerSpeed;
  
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
      this.player.setAngularVelocity(-200); // Adjust this value as needed
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(playerSpeed);
      this.player.setAngularVelocity(200); // Adjust this value as needed
    }
  
    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(playerSpeed);
    }
  
    // Add this to make the player face the direction of movement
    if (this.player.body.velocity.length() > 0) {
      this.player.rotation = Math.atan2(this.player.body.velocity.y, this.player.body.velocity.x) + Math.PI/2;
    }
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
      }
}

  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  
  }



  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }


}