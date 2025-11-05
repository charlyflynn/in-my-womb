import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export default class Fin extends Scene {
    constructor() {
        super("Fin");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x333333);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };

        this.add
            .text(dims.w / 2, dims.h / 2, "YOU\nWON!", {
                fontFamily: "Arial Black",
                fontSize: 100,
                color: "#cccccc",
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

