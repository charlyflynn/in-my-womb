import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export default class Fin extends Scene {
    constructor() {
        super("Fin");
    }

    create() {
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };

        const acceptButton = this.add
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
            .setOrigin(0.5, 0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => {
                this.cameras.main
                    .fadeOut(1500, 255, 255, 255)
                    .on("camerafadeoutcomplete", () => {
                        acceptButton.destroy();
                        bg.destroy();
                        document.getElementById("success").style.zIndex = -1;
                        // this.cameras.main.setBackgroundColor(0xffffff);
                        this.cameras.main
                            .fadeIn(1500, 255, 255, 255)
                            .on("camerafadeincomplete", () => {
                                document.getElementById(
                                    "success"
                                ).style.zIndex = 0;
                            });
                    });
            });

        EventBus.emit("current-scene-ready", this);
        this.cameras.main.fadeIn(1500);
    }

    changeScene() {
        // this.scene.start("MainMenu");
    }
}

