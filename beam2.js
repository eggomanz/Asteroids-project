class Beam2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "beam")

        this.speed = Phaser.Math.GetSpeed(500, 1)
    }

    fire(x, y, direction) {
        this.setPosition(x, y)
        this.setActive(true)
        this.setVisible(true)
    
        this.direction = direction - Math.PI / 2
        this.rotation = this.direction + Math.PI / 2

        this.play("beam_anim")
    }

    update(time, delta) {
        this.x += Math.cos(this.direction) * this.speed * delta
        this.y += Math.sin(this.direction) * this.speed * delta

        if(this.x < -50 || this.y < -50 || this.x > 850 || this.y > 650 ) {
            this.setActive(false)
            this.setVisible(false)
            this.stop("beam_anim")
        }
    }
}




