import Phaser from "phaser";
import Hiscore from "../Hiscore";

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "end" });
  }

  create() {
    this.add.image(400, 300, "space");

    const hiscore = new Highscore("http://localhost:3000");

    // console.log(highscore.getScore(1));

    const handle = prompt("Skriv ditt namn här:");

    hiscore.postScore(666, this.game.score, handle);

    this.add
      .text(400, 200, "Game Over\n\n< menu >", {
        align: "center",
        fill: "white",
        fontFamily: "sans-serif",
        fontSize: 48,
      })
      .setOrigin(0.5, 0);

    this.input.on(
      "pointerdown",
      function () {
        this.scene.switch("menu");
      },
      this
    );
  }
}
