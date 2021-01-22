import Phaser from "phaser";
import Weapon from "../Weapon";
import Nisse from "../Nisse";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
      physics: {
        arcade: {},
      },
    });
  }

  create() {
    this.tileSize = 64;
    this.worldWidth = 16 * 128;
    this.worldHeight = 16 * 64;
    this.player;
    this.pointer = this.input.activePointer;
    this.weapon = [];
    this.weaponFlipped = 0;
    this.projectiles = this.physics.add.group();
    this.grenades = this.physics.add.group();
    this.grenadeCooldown = 0;

    this.weaponCooldown = 0;
    this.weaponActive = 0;
    this.playerSpeed = 3;
    this.projectileSpeed = 10;
    this.weaponSwitchCooldown = 0;

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileSprites", "tiles");

    const snow = map.createStaticLayer("Snow", tileset, 0, 0);
    const floor = map.createStaticLayer("Floor", tileset, 0, 0);
    const walls = map.createStaticLayer("Walls", tileset, 0, 0);

    walls.setCollisionByExclusion(-1, true);

    //Camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    
    this.player = this.physics.add.sprite(430, 350, "player");
    this.physics.add.collider(this.player, walls);

    var nissar = this.physics.add.group({
      key: "nisse",
      repeat: 5,
      setXY: { x: 256, y: 128, stepX: 96 },
      createCallback: function (go) {
        var nisseGo = go;
        nisseGo.body.onCollide = true;
      },
    });

    this.physics.add.collider(nissar, nissar);
    this.physics.add.collider(nissar, this.grenades);
    this.physics.add.collider(nissar, this.wall);
    this.physics.add.collider(nissar, this.player);

    //Weapon sprites
    let newLength = this.weapon.push(
      (this.pistol = new Weapon("pistol", 35, 5, 60, -2.5, 15, 1)),
      (this.uzi = new Weapon("uzi", 30, 5, 62, -6, 3, 1)),
      (this.shotgun = new Weapon("shotgun", 15, 5, 54, 5, 30, 8))
    );

    this.pistolSprite = this.add.sprite(this.player.x, this.player.y, this.weapon[0].getSprite);
    this.uziSprite = this.add.sprite(this.player.x, this.player.y, this.weapon[1].getSprite);
    this.shotgunSprite = this.add.sprite(this.player.x, this.player.y, this.weapon[2].getSprite);

    this.pistolSprite.alpha = 0;
    this.uziSprite.alpha = 0;
    this.shotgunSprite.alpha = 0;

    
    this.teleporters = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const teleporterObjects = map.getObjectLayer('Teleporters')['objects'];
    teleporterObjects.forEach(teleporterObject => {
      const teleporter = this.teleporters.create(teleporterObject.x, teleporterObject.y - 96, 'fireplace').setOrigin(0, 0);
    });

    //Player animations, turning, walking left and walking right.
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "stop",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //Destroy projectiles when they hit this.walls
    this.physics.add.collider(this.projectiles, walls, this.destroyProjectile, null, this);

    //Player WASD movement
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      grenade: Phaser.Input.Keyboard.KeyCodes.G,
      lastWeapon: Phaser.Input.Keyboard.KeyCodes.Q,
      nextWeapon: Phaser.Input.Keyboard.KeyCodes.E,
    });
    // this.scene.launch('pause');
    // // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/
    const esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    esc.on("down", () => {
      // this.scene.pause('play');
      // this.scene.setVisible(true, 'pause');
      // this.scene.moveUp('pause');
      this.scene.switch("pause");
    });
  }

  update() {
    if (this.weaponCooldown > 0) {
      this.weaponCooldown--;
    }
    if (this.grenadeCooldown > 0) {
      this.grenadeCooldown--;
    }
    if (this.weaponSwitchCooldown > 0) {
      this.weaponSwitchCooldown--;
    }

    if (this.pointer.x < this.player.x) {
      this.weaponFlipped = -1;
      this.pistolSprite.flipX = true;
      this.uziSprite.flipX = true;
      this.shotgunSprite.flipX = true;
    } else {
      this.weaponFlipped = 1;
      this.pistolSprite.flipX = false;
      this.uziSprite.flipX = false;
      this.shotgunSprite.flipX = false;
    }

    switch (this.weaponActive) {
      case 0:
        this.pistolSprite.x = this.player.x + this.weapon[0].getOffX * this.weaponFlipped;
        this.pistolSprite.y = this.player.y + this.weapon[0].getOffY;
        this.pistolSprite.alpha = 1;
        break;

      //SMG
      case 1:
        this.uziSprite.x = this.player.x + this.weapon[1].getOffX * this.weaponFlipped;
        this.uziSprite.y = this.player.y + this.weapon[1].getOffY;
        this.uziSprite.alpha = 1;
        break;

      //Shotgun
      case 2:
        this.shotgunSprite.x = this.player.x + this.weapon[2].getOffX * this.weaponFlipped;
        this.shotgunSprite.y = this.player.y + this.weapon[2].getOffY;
        this.shotgunSprite.alpha = 1;
        break;
    }

    if (
      (this.keys.lastWeapon.isDown || this.keys.nextWeapon.isDown) &&
      this.weaponSwitchCooldown === 0
    ) {
      if (this.keys.lastWeapon.isDown) {
        if (this.weaponActive == 0) {
          this.weaponActive = this.weapon.length - 1;
        } else {
          this.weaponActive--;
        }
      }
      if (this.keys.nextWeapon.isDown) {
        if (this.weaponActive == this.weapon.length - 1) {
          this.weaponActive = 0;
        } else {
          this.weaponActive++;
        }
      }
      this.pistolSprite.alpha = 0;
      this.uziSprite.alpha = 0;
      this.shotgunSprite.alpha = 0;
      this.weaponSwitchCooldown = 20;
    }

    //Camera
    var cam = this.cameras.main;

    /* Player movement
     *  the first variables decide the direction the player is moving.
     *  ex, if playerMovingX is -1 the player moves left, if its 1 they move right and if its 0 it stays in place.
     */
    let playerMovingX = 0;
    let playerMovingY = 0;

    //Checks if a specific direction is pressed, then adds or subracts from that direction by 1.
    if (this.keys.left.isDown) {
      playerMovingX += -1;
    }
    if (this.keys.right.isDown) {
      playerMovingX += 1;
    }
    if (this.keys.up.isDown) {
      playerMovingY += -1;
    }
    if (this.keys.down.isDown) {
      playerMovingY += 1;
    }

    if (playerMovingY === 1) {
      this.player.anims.play("down", true);
    } else if (playerMovingY === -1) {
      this.player.anims.play("up", true);
    } else {
      this.player.anims.play("stop", true);
    }

    /* Movement algoritm
     *  if the player is moving on both the X and Y axis then divide the movement algorithm by the square root of 2.
     *  This is done to prevent the player from moving faster on the hypotenuse.
     */
    if (!(playerMovingX === 0) && !(playerMovingY === 0)) {
      this.player.setVelocityX((playerMovingX * this.playerSpeed * 100) / Math.SQRT2);
      this.player.setVelocityY((playerMovingY * this.playerSpeed * 100) / Math.SQRT2);
    } else {
      this.player.setVelocityX(playerMovingX * this.playerSpeed * 100);
      this.player.setVelocityY(playerMovingY * this.playerSpeed * 100);
    }

    //Moves the camera to the players position
    this.cameras.main.centerOn(this.player.x, this.player.y);

    //if the mouse is clicked -> shoot
    if (this.pointer.isDown) {
      let angle = Phaser.Math.Angle.Between(
        this.player.x + this.weapon[this.weaponActive].getMuzX * this.weaponFlipped,
        this.player.y + this.weapon[this.weaponActive].getMuzY * this.weaponFlipped,
        this.pointer.x + this.cameras.main.worldView.x,
        this.pointer.y + this.cameras.main.worldView.y
      );

      let v = 100 * this.projectileSpeed;
      let uv = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      let vx = v * uv.x;
      let vy = v * uv.y;

      this.shoot(
        this.player.x + this.weapon[this.weaponActive].getMuzX * this.weaponFlipped,
        this.player.y + this.weapon[this.weaponActive].getMuzY * this.weaponFlipped,
        vx,
        vy,
        angle
      );
    }

    // G is pressed -> throw grenade
    if (this.keys.grenade.isDown) {
      let angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.pointer.x + this.cameras.main.worldView.x,
        this.pointer.y + this.cameras.main.worldView.y
      );

      let v = 100 * this.projectileSpeed;
      let uv = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      let vx = v * uv.x;
      let vy = v * uv.y;

      this.throwGrenade(this.player.x, this.player.y, vx, vy);
    }
  }

  shoot(x, y, vx, vy, angle) {
    if (this.weaponCooldown === 0) {
      for (var i = 0; i < this.weapon[this.weaponActive].getBulletMultiplier; i++) {
        this.createProjectile(x, y, vx, vy, angle, 8);
      }
      this.weaponCooldown = this.weapon[this.weaponActive].getCooldown;
    }
  }

  //Change how "spread" works in the future
  createProjectile(x, y, vx, vy, angle, spread) {
    this.projectile = this.projectiles.create(x, y, "projectile");
    this.projectile.setVelocityX(vx + spread * (Math.random() - 0.5) * 20);
    this.projectile.setVelocityY(vy + spread * (Math.random() - 0.5) * 20);

    this.particles = this.add.particles("particle");
    //Trail emitter configuration
    this.projectile.emitter = this.particles.createEmitter({
      speed: 0,
      tint: Math.random() * 0xff0000 + 50,
      rotate: (angle * 180) / Math.PI,
      scale: {
        start: 1,
        end: 0,
      },
      alpha: {
        start: 0.5,
        end: 0,
      },
      // 1 = 1 milisecond
      frequency: 1,
      lifespan: 400,
      blendmode: "ADD",
    });

    // Create a emmiter on the projectile
    this.projectile.emitter.startFollow(this.projectile);
  }

  destroyProjectile(projectile) {
    projectile.emitter.stop();
    projectile.destroy();
  }

  throwGrenade(x, y, vx, vy) {
    if (this.grenadeCooldown === 0) {
      this.createGrenade(x, y, vx, vy, 0);
      this.grenadeCooldown = 70;
    }
  }

  // Create grenade
  createGrenade(x, y, vx, vy) {
    this.grenade = this.grenades.create(x, y, "grenade");
    this.grenade.setVelocityX(vx * 0.5);
    this.grenade.setVelocityY(vy * 0.5);
    this.grenade.setBounce(0.3);
  }
}
