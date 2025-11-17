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
                .fadeOut(1500, 255, 255, 255)
                .on("camerafadeoutcomplete", () => {
                    bg.destroy();
                    gratitude.destroy();
                    instruction.destroy();
                    stroke.destroy();
                    const success = document.getElementById("success");
                    success.style.zIndex = -1;
                    success.style.display = "block";
                    // this.cameras.main.setBackgroundColor(0xffffff);
                    this.cameras.main
                        .fadeIn(1500, 255, 255, 255)
                        .on("camerafadeincomplete", () => {
                            success.style.zIndex = 0;
                        });
                });
        };

        // text
        const gratitude = this.add
            .text(1080 / 2, 250, "CONGRATULATIONS", {
                fontFamily: "nobody",
                fontSize: 72,
                align: "center",
                color: "#e34727",
                lineSpacing: 30,
                fontStyle: "bold",
                letterSpacing: 2,
            })
            .setOrigin(0.5, 0.5);

        const instruction = this.add
            .text(
                1080 / 2,
                1600,
                "CLICK ON THE ROCK\nTO CLAIM YOUR PRIZE\n>>>>",
                {
                    fontFamily: "nobody",
                    fontSize: 38,
                    align: "center",
                    color: "#333333",
                    lineSpacing: 30,
                    fontStyle: "bold",
                    letterSpacing: 2,
                }
            )
            .setOrigin(0.5, 0.5);

        const stroke = this.add
            .rectangle(1080 / 2, 1600, 700, 250)
            .setStrokeStyle(2, 0x333333);

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

