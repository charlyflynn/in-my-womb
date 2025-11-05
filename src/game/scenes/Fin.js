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
            .text(dims.w / 2, dims.h / 2, "CLAIM\nYOUR\nPRIZE", {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#333333",
                padding: 30,
                backgroundColor: "#cccccc",
                align: "center",
                letterSpacing: 20,
                wordWrap: { width: 450, useAdvancedWrap: false },
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => {
                const url = "assets/download/WMI.mp3";
                const a = document.createElement("a");
                a.href = url;
                a.download = url.split("/").pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });

        EventBus.emit("current-scene-ready", this);
        this.cameras.main.fadeIn(1500);
    }

    changeScene() {
        // this.scene.start("MainMenu");
    }
}

