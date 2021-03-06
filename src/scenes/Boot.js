import Phaser from "phaser";
import images from "../assets/*.png";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "boot" });
  }

  preload() {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    console.table(images);

    this.load.spritesheet("player", "assets/playerSanta.png", {
      frameWidth: 78,
      frameHeight: 96,
    });
    this.load.image("projectile", images.star);
    this.load.image("wall", images.wall);
    this.load.image("floor", images.floor);
    this.load.image("particle", images.trail);
    this.load.image("grenade", images.star);
    this.load.image("pistol", images.pistol);
    this.load.image("uzi", images.uzi);
    this.load.image("shotgun", images.shotgun);
    this.load.image("nisse", images.Elf);

    this.load.image("fireplace", "assets/Fireplace.png");
    this.load.image("tiles", "assets/tileSprites.png");
    this.load.tilemapTiledJSON("map", "levels/map.json");

    this.load.on("progress", function (progress) {
      bar.setScale(progress, 1);
    });
  }

  update() {
    this.scene.start("menu");
    // this.scene.start('play');
    // this.scene.remove();
  }
}
