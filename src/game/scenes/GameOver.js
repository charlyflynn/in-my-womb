import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xff0000);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };

        this.add
            .text(dims.w / 2, dims.h / 2, "YOU LOSE \n ESTAS PERDIDO", {
                fontFamily: "Arial Black",
                fontSize: 100,
                color: "#fff",
                stroke: "#000",
                strokeThickness: 20,
                align: "center",
                letterSpacing: 20,
                wordWrap: { width: 450, useAdvancedWrap: false },
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        // this.scene.start("MainMenu");
    }
}

