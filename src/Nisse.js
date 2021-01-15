import { DOWN, LEFT, RIGHT, UP } from "phaser"

var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
    
export default class Nisse extends Phaser.Physics.Arcade.Sprite
{
    direction = Direction.RIGHT;
    
    constructor(x, y, texture, frame)
    {
        super(x, y, texture, frame)

        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE);

    }

    handleTileCollision(Phaser.GameObjects.GameObject, Phaser.Tilemaps.Tile)
    {
        if (go !== this) {
            return;
        }
            var newDirection = Phaser.Math.Between(0, 3);
            this.direction = newDirection;
    }

    
    preUpdate(t, dt)
    {
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
