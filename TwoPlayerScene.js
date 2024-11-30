class TwoPlayerScene extends Phaser.Scene {
    constructor() {
      super("two-player-mode");
    }

    preload() {
    }

    create() {

        this.player1Score = 0
        this.player2Score = 0

        this.player1 = this.physics.add.image(200, 200, "player")
        this.player1.setDrag(2)
        this.player1.setMaxVelocity(150)
        this.player1.setCollideWorldBounds(true)

        this.player2 = this.physics.add.image(250, 250, "player")
        this.player2.setDrag(2)
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

        this.player1BeamGroup = this.physics.add.group({
            classType: Beam2,
            maxSize: 1,
            runChildUpdate: true
        })

        this.player2BeamGroup = this.physics.add.group({
            classType: Beam2,
            maxSize: 1,
            runChildUpdate: true
        })

        this.physics.add.overlap(this.player1BeamGroup, this.asteriodGroup, this.collisionPlayer1, null, this);
        this.physics.add.overlap(this.player2BeamGroup, this.asteriodGroup, this.collisionPlayer2, null, this);

        this.player1ScoreText = this.add.bitmapText(10, 5, "pixelFont", "PLAYER1 SCORE: 0000", 16);
        this.player2ScoreText = this.add.bitmapText(10, 20, "pixelFont", "PLAYER1 SCORE: 0000", 16);
    }

    update(time, delta) {
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

        //update scores 
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

        // Calculate velocity components
        const thrust = 5; 
        const velocityX = Math.cos(angle) * thrust;
        const velocityY = Math.sin(angle) * thrust;

        // Apply the velocity to the player
        player.setVelocity(player.body.velocity.x + velocityX, player.body.velocity.y + velocityY);
    }

    collisionPlayer1(beam, asteriod) {
        beam.destroy()
        asteriod.destroy()
        this.player1Score += 15
        this.sound.play("audio_explosion")

        if(this.asteriodGroup.countActive() == 0) {
            this.scene.switch("game-over-scene")
        }
    }

    collisionPlayer2(beam, asteriod) {
        beam.destroy()
        asteriod.destroy()
        this.player2Score += 15
        this.sound.play("audio_explosion")

        if(this.asteriodGroup.countActive() == 0) {
            this.scene.switch("game-over-scene")
        }
    }

}



