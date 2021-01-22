import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menu' });
  }

  create () {
    this.add.text(400, 200, 'Nisse Headpopper', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 55
    })
      .setOrigin(0.5, 0);

      const startButton = this.add.text(400, 300, '< START >', {
        align: 'center',
        fill: 'white',
        fontFamily: 'sans-serif',
        fontSize: 45
      }).setOrigin(0.5, 0);
      startButton.setInteractive();
      startButton.on('pointerdown', () => { this.scene.switch('play'); });
  }
}