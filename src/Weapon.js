export default class Weapon {
  constructor(Sprite, offsetX, offsetY, muzzleX, muzzleY, Cooldown, bulletMultiplier) {
    this.sprite = Sprite;
    this.offX = offsetX;
    this.offY = offsetY;
    this.muzX = muzzleX;
    this.muzY = muzzleY;
    this.cd = Cooldown;
    this.bm = bulletMultiplier;
  }

  get getSprite() {
    return this.sprite;
  }
  get getOffX() {
    return this.offX;
  }
  get getOffY() {
    return this.offY;
  }
  get getMuzX() {
    return this.muzX;
  }
  get getMuzY() {
    return this.muzY;
  }
  get getCooldown() {
    return this.cd;
  }
  get getBulletMultiplier() {
    return this.bm;
  }
}
