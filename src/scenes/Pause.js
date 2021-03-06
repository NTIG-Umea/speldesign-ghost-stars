import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  constructor () {
    super({ key: 'pause' });
  }

  create () {
    console.log(this.scene.isSleeping('play'));

    this.add.text(400, 200, '- PAUSED -', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 55
    }).setOrigin(0.5, 0);

    const resumeButton = this.add.text(400, 300, '< RESUME >', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 45
    }).setOrigin(0.5, 0);
    resumeButton.setInteractive();
    resumeButton.on('pointerdown', () => { this.scene.switch('play'); });
  }
}
