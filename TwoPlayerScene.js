class TwoPlayerScene extends Phaser.Scene {
    constructor() {
      super("two-player-mode");
    }

    preload() {
        this.load.audio("audio_pickup", ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
    }

    create() {

        //this.background = this.add.tileSprite(0, 0, config.width, config.height, "starbackground");
        //this.background.setOrigin(0, 0);
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
        this.player1Score = 0
        this.player2Score = 0

        this.player1 = this.physics.add.image(200, 200, "player")
        this.player1.setDrag(10)
        this.player1.setMaxVelocity(150)
        this.player1.setCollideWorldBounds(true)

        this.player2 = this.physics.add.image(250, 250, "player")
        this.player2.setDrag(10)
        this.player2.setMaxVelocity(150)
        this.player2.setCollideWorldBounds(true)


        this.cursors = this.input.keyboard.createCursorKeys()

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            Z: Phaser.Input.Keyboard.KeyCodes.Z
        });

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
        }

        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
          });

        this.player1BeamGroup = this.physics.add.group({
            classType: Beam2,
            maxSize: 2,
            runChildUpdate: true
        })

        this.player2BeamGroup = this.physics.add.group({
            classType: Beam2,
            maxSize: 2,
            runChildUpdate: true
        })

        this.physics.add.collider(this.player1BeamGroup, this.powerUps, function(projectile, powerUp) {
            projectile.destroy();
          });
        this.physics.add.collider(this.player2BeamGroup, this.powerUps, function(projectile, powerUp) {
            projectile.destroy();
          });
      
        this.physics.add.overlap(this.player1, this.powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.player2, this.powerUps, this.pickPowerUp, null, this);

        this.physics.add.overlap(this.player1BeamGroup, this.asteriodGroup, this.collisionPlayer1, null, this);
        this.physics.add.overlap(this.player2BeamGroup, this.asteriodGroup, this.collisionPlayer2, null, this);

        this.physics.add.overlap(this.player1, this.asteriodGroup, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.player2, this.asteriodGroup, this.hurtPlayer, null, this);

        this.player1ScoreText = this.add.bitmapText(10, 5, "pixelFont", "PLAYER1 SCORE: 0000", 16);
        this.player2ScoreText = this.add.bitmapText(10, 20, "pixelFont", "PLAYER1 SCORE: 0000", 16);

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
          });
    }
    pickPowerUp(player, powerUp) {
        console.log('Power-up picked up by', player === this.player1 ? 'Player 1' : 'Player 2');
    
        powerUp.disableBody(true, true);
        console.log('Power-up disabled');
    
        this.pickupSound.play();
    
        if (player === this.player1) {
            this.player1SpeedBoost = gameSettings.playerSpeed * 1.5;
            this.time.addEvent({
                delay: 5000,
                callback: () => {
                    this.player1SpeedBoost = gameSettings.playerSpeed;
                    console.log('Player 1 speed boost ended');
                },
                callbackScope: this,
                loop: false
            });
        } else if (player === this.player2) {
            this.player2SpeedBoost = gameSettings.playerSpeed * 1.5;
            this.time.addEvent({
                delay: 5000,
                callback: () => {
                    this.player2SpeedBoost = gameSettings.playerSpeed;
                    console.log('Player 2 speed boost ended');
                },
                callbackScope: this,
                loop: false
            });
        }
    }
    update(time, delta) {
        //this.background.tilePositionY -= 0.5;
        const player1Speed = this.player1SpeedBoost || gameSettings.playerSpeed;
        const player2Speed = this.player2SpeedBoost || gameSettings.playerSpeed;   
        // player1 movements
       if(this.cursors.left.isDown){
            this.player1.setAngularVelocity(-300)
        } else if (this.cursors.right.isDown){
            this.player1.setAngularVelocity(300)
        } else {
            this.player1.setAngularVelocity(0)
        }

        if (this.cursors.up.isDown) {
            this.addThrust(this.player1);
        } 

        // player2 movements
        if (this.keys.A.isDown) {
            this.player2.setAngularVelocity(-300);
        } else if (this.keys.D.isDown) {
            this.player2.setAngularVelocity(300);
        } else {
            this.player2.setAngularVelocity(0);
        }

        if (this.keys.W.isDown) {
            this.addThrust(this.player2);
        } 

        // player1 shooting
        if(this.cursors.space.isDown) {
            const shoot = this.player1BeamGroup.get()
            if (shoot) {
                shoot.fire(this.player1.x, this.player1.y, this.player1.rotation)
                this.sound.play("audio_beam")
            }
        }

        // player2 shooting
        if (this.keys.Z.isDown) {
            const shoot = this.player2BeamGroup.get();
            if (shoot) {
                shoot.fire(this.player2.x, this.player2.y, this.player2.rotation);
                this.sound.play("audio_beam");
            }
        }

        // Update scores 
        this.player1ScoreText.setText("PLAYER1 SCORE: " + this.player1Score)
        this.player2ScoreText.setText("PLAYER2 SCORE: " + this.player2Score)

        // Adjust score labels based on scores
        if (this.player1Score >= this.player2Score) {
            this.player1ScoreText.setPosition(10, 5); // Top
            this.player2ScoreText.setPosition(10, 30); // Bottom
        } else {
            this.player2ScoreText.setPosition(10, 5); // Top
            this.player1ScoreText.setPosition(10, 30); // Bottom
        }

        for (const asteriod of this.asteriodArray) {
            asteriod.update(time, delta)
        }

    }

    addThrust(player) {
        const angle = player.rotation - Math.PI / 2; // Convert angle to radians

        const thrust = 5; 
        const velocityX = Math.cos(angle) * thrust;
        const velocityY = Math.sin(angle) * thrust;

        player.setVelocity(player.body.velocity.x + velocityX, player.body.velocity.y + velocityY);
    }

    collisionPlayer1(beam, asteriod) {
        beam.destroy()
        asteriod.destroy()
        this.player1Score += 15

        new Explosion(this, asteriod.x, asteriod.y); 
        this.sound.play("audio_explosion")

        if(this.asteriodGroup.countActive() == 0) {
            this.scene.switch("game-over-scene")
        }
    }

    collisionPlayer2(beam, asteriod) {
        beam.destroy()
        asteriod.destroy()
        this.player2Score += 15

        new Explosion(this, asteriod.x, asteriod.y); 
        this.sound.play("audio_explosion")

        if(this.asteriodGroup.countActive() == 0) {
            this.scene.switch("game-over-scene")
        }
    }

    hurtPlayer(player, asteroid) {
        new Explosion(this, player.x, player.y);
        this.sound.play("audio_explosion");
    
        player.disableBody(true, true); // Temporarily disable the player
    
        this.time.addEvent({
            delay: 1000,
            callback: () => this.resetPlayer(player),
            callbackScope: this,
        });
    
        this.resetShipPos(asteroid);
    }
    
    resetPlayer(player) {
        player.enableBody(true, config.width / 2, config.height - 64, true, true);
        player.alpha = 0.5;
    
        this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 1500,
        });
    }
    
    resetShipPos(ship) {
        ship.setPosition(Phaser.Math.Between(0, config.width), 0);
    }
    


}



