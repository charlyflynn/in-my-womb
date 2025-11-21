import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export default class Fin extends Scene {
    constructor() {
        super("Fin");
    }

    create() {
        const bg = this.add.image(0, 0, "bgFin").setOrigin(0, 0);
        const endSequence = () => {
            this.cameras.main
                .fadeOut(500, 255, 255, 255)
                .on("camerafadeoutcomplete", () => {
                    bg.destroy();
                    gratitude.destroy();
                    win.destroy();
                    click.destroy();
                    arrow.destroy();
                    credits1.destroy();
                    credits2.destroy();

                    this.cameras.main.setBackgroundColor(0xffffff);
                    this.cameras.main
                        .fadeIn(500, 255, 255, 255)
                        .on("camerafadeincomplete", () => {
                            window.open(
                                "https://elsas.os.fan/in-my-womb-pre-save--download",
                                "_self"
                            );
                        });
                });
        };

        // text
        const gratitude = this.add
            .text(1080 / 2, 200, "congratulations!", {
                fontFamily: "roobert",
                fontSize: 72,
                align: "center",
                color: "#e34727",
                lineSpacing: 60,
                fontStyle: "bold",
                letterSpacing: 2,
            })
            .setOrigin(0.5, 0.5);

        const win = this.add
            .text(1080 / 2, 225, "\nyou won", {
                fontFamily: "nobody",
                fontSize: 72,
                align: "center",
                color: "#e34727",
                lineSpacing: 60,
                fontStyle: "bold",
                letterSpacing: 2,
            })
            .setOrigin(0.5, 0.5);

        const click = this.add
            .text(1080 / 2, 1460, "\nclick on the rock to claim your prize", {
                fontFamily: "nobody",
                fontSize: 26,
                align: "center",
                color: "#333333",
                lineSpacing: 30,
                letterSpacing: 1.5,
                fontStyle: "bold",
            })
            .setOrigin(0.5, 0.5);

        const credits1 = this.add
            .text(1040, 1920 - 70, "game developed by Charlie Flynn ⧉", {
                fontFamily: "roobert",
                fontSize: 24,
                align: "center",
                color: "#333333",
                lineSpacing: 60,
                fontStyle: "bold",
                letterSpacing: 1,
            })
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                window.open("https://instagram.com/flarliechynn", "_blank");
            })
            .setOrigin(1, 1);
        const credits2 = this.add
            .text(1040, 1920 - 20, "textures designed by Emerson Blanco ⧉", {
                fontFamily: "roobert",
                fontSize: 24,
                align: "center",
                color: "#333333",
                lineSpacing: 60,
                fontStyle: "bold",
                letterSpacing: 1,
            })
            .setOrigin(1, 1)
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                window.open("https://instagram.com/emersonyashin", "_blank");
            });

        const arrow = this.add
            .text(1080 / 2, 1375, "↑", {
                fontFamily: "nobody",
                fontSize: 78,
                align: "center",
                color: "#333333",
                lineSpacing: 30,
                letterSpacing: 1.5,
                fontStyle: "bold",
            })
            .setOrigin(0.5, 0.5);

        //clickable area mask
        this.add
            .rectangle(400, 600, 700, 325)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5)
            .setAngle(8)
            .on("pointerup", () => {
                endSequence();
            });
        this.add
            .rectangle(600, 945, 700, 450)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5)
            .on("pointerup", () => {
                endSequence();
            });
        this.add
            .rectangle(520, 800, 700, 450)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5)
            .setAngle(-25)
            .on("pointerup", () => {
                endSequence();
            });
        this.add
            .rectangle(830, 875, 290, 450)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5)
            .setAngle(-25)
            .on("pointerup", () => {
                endSequence();
            });
        this.add
            .rectangle(80, 510, 100, 150)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5)
            .setAngle(10)
            .on("pointerup", () => {
                endSequence();
            });

        EventBus.emit("current-scene-ready", this);
        this.cameras.main.fadeIn(1500);
    }
}

