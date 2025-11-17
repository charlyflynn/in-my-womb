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
                    // acceptButton.destroy();
                    bg.destroy();
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

        this.add
            .rectangle(1080 / 2, 1660, 700, 450)
            .setStrokeStyle(2, 0x333333);

        this.add
            .text(
                1080 / 2,
                1665,
                "CONGRATULATIONS\nCLICK ON THE ROCK\nTO CLAIM YOUR PRIZE\n>>>>",
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
            .setOrigin(0.5, 0.5)
            .setDepth(100);

        // const dims = {
        //     h: this.sys.game.canvas.height,
        //     w: this.sys.game.canvas.width,
        // };

        // const acceptButton = this.add
        //     .text(dims.w / 2, dims.h / 2, "CLAIM\nYOUR\nPRIZE", {
        //         fontFamily: "Arial Black",
        //         fontSize: 72,
        //         color: "#333333",
        //         padding: 30,
        //         backgroundColor: "#cccccc",
        //         align: "center",
        //         letterSpacing: 20,
        //         wordWrap: { width: 450, useAdvancedWrap: false },
        //     })
        //     .setOrigin(0.5, 0.5)
        //     .setDepth(100)
        //     .setInteractive({ useHandCursor: true })
        //     .on("pointerup", () => {
        //         this.cameras.main
        //             .fadeOut(1500, 255, 255, 255)
        //             .on("camerafadeoutcomplete", () => {
        //                 acceptButton.destroy();
        //                 bgMain.destroy();
        //                 const success = document.getElementById("success");
        //                 success.style.zIndex = -1;
        //                 success.style.display = "block";
        //                 // this.cameras.main.setBackgroundColor(0xffffff);
        //                 this.cameras.main
        //                     .fadeIn(1500, 255, 255, 255)
        //                     .on("camerafadeincomplete", () => {
        //                         success.style.zIndex = 0;
        //                     });
        //             });

        EventBus.emit("current-scene-ready", this);
        this.cameras.main.fadeIn(1500);
    }

    changeScene() {
        // this.scene.start("MainMenu");
    }
}

