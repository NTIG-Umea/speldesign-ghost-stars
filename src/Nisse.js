import { DOWN, LEFT, RIGHT, UP } from "phaser";

var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
});

  var randomDirection = function (exclude) {
  
    var newDirection = Phaser.Math.Between(0, 3);
  
    while (newDirection === exclude) {
          newDirection = Phaser.Math.Between(0, 3);
      }
    };

    export default class nisse extends Phaser.Physics.Arcade.Sprite {
      direction = Direction.RIGHT;
      moveEvent = Phaser.Time.TimerEvent;

      constructor(x, y, texture, frame) {
        super(x, y, texture, frame);
      
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision);

        this.scene.time.addEvent({
          delay: 2000,
          callback: () => {
            this.direction = randomDirection(this.direction);
          },
          loop: true
        });
      }

    // handleTileCollision() {
    //   if (go !== this) {
    //     return;
    //   } else {
    //     this.direction = randomDirection(this.direction);
    //   }
    // }


  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) 
    {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;

      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;

      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;

      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }
  }
}

  var nisseHealth;