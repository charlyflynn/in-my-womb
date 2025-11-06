import { Scene } from "phaser";

const preProd = true;
const levelKeys = ["AuroSymbology", "WombTetris", "LuteMan", "Fin"];
export default class Preloader extends Scene {
    constructor() {
        super("Preloader");
        this.background;
        this.startButton;
        this.levelButtons = {};
    }

    init() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };
        if (dims.h > this.background.height)
            this.background.displayHeight = dims.h;
        if (dims.w > this.background.width)
            this.background.displayWidth = dims.w;

        //  A simple progress bar. This is the outline of the bar.
        this.add
            .rectangle(dims.w / 2, dims.h / 2, 468, 32)
            .setStrokeStyle(1, 0xcccccc);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(
            dims.w / 2 - 230,
            dims.h / 2,
            4,
            28,
            0xcccccc
        );

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });

        this.load.on("complete", () => {
            this.startButton = this.add
                .text(
                    this.sys.game.canvas.width / 2,
                    this.sys.game.canvas.height / 2 + 100,
                    "COMENZAR",
                    {
                        fill: "#333333",
                        backgroundColor: "#cccccc",
                        padding: 24,
                        fontSize: 64,
                        fontFamily: "Arial Black",
                    }
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerover", () => {
                    this.startButton.setStyle({ backgroundColor: "#cccccc" });
                })
                .on("pointerout", () => {
                    this.startButton.setStyle({ backgroundColor: "#cccccc" });
                })
                .on("pointerup", () => {
                    this.cameras.main
                        .fadeOut(1000, 0, 0, 0)
                        .on("camerafadeoutcomplete", () =>
                            this.scene.start("AuroSymbology")
                        );
                });

            preProd &&
                levelKeys.forEach((levelKey, i) => {
                    this.levelButtons[levelKey] = this.add
                        .text(
                            this.sys.game.canvas.width / 2,
                            this.sys.game.canvas.height / 2 +
                                200 +
                                (i + 1) * 140,
                            `L${i + 1}: ${levelKey}`,
                            {
                                fill: "#333333",
                                backgroundColor: "#cccccc",
                                padding: 24,
                                fontSize: 40,
                                align: "left",
                                fontFamily: "Arial Black",
                            }
                        )
                        .setOrigin(0.5, 0.5)
                        .setInteractive({ useHandCursor: true })
                        .on("pointerover", () => {
                            this.startButton.setStyle({
                                backgroundColor: "#cccccc",
                            });
                        })
                        .on("pointerout", () => {
                            this.startButton.setStyle({
                                backgroundColor: "#cccccc",
                            });
                        })
                        .on("pointerup", () => {
                            this.cameras.main
                                .fadeOut(1000, 0, 0, 0)
                                .on("camerafadeoutcomplete", () =>
                                    this.scene.start(levelKey)
                                );
                        });
                });
        });
        this.cameras.main.fadeIn(1000);
    }

    preload() {
        this.load.setPath("./assets");

        this.load.audio("stonescrape", "stonescrape.mp3");
        this.load.audio("unselect", "unselect.mp3");

        // level 1
        this.load.setPath("assets/l1");

        this.load.image("altavoz-in", "altavoz-in.png");
        this.load.image("altavoz-out", "altavoz-out.png");
        this.load.image("splinter-in", "splinter-in.png");
        this.load.image("splinter-out", "splinter-out.png");
        this.load.image("womb-in", "womb-in.png");
        this.load.image("womb-out", "womb-out.png");
        this.load.image("finalise-in", "finalise-in.png");
        this.load.image("finalise-out", "finalise-out.png");
        this.load.image("nino-in", "nino-in.png");
        this.load.image("nino-out", "nino-out.png");
        this.load.image("fireworm-in", "fireworm-in.png");
        this.load.image("fireworm-out", "fireworm-out.png");

        this.load.audio("splinter", "splinter.mp3");
        this.load.audio("womb", "womb.mp3");
        this.load.audio("finalise", "finalise.mp3");
        this.load.audio("nino", "nino.mp3");
        this.load.audio("fireworm", "fireworm.mp3");

        // level 2
        this.load.setPath("assets/l2");

        this.load.image("gem", "gem.png");
        this.load.image("womb-piedra", "womb-piedra.png");
        this.load.image("womb-gemas", "womb-gemas.png");
        this.load.image("womb-0", "womb-0.png");
        this.load.image("womb-parentesis-l", "womb-parentesis-l.png");
        this.load.image("womb-parentesis-r", "womb-parentesis-r.png");

        this.load.audio("wombVox", "womb-1-vox.mp3");
        this.load.audio("wombStrings", "womb-2-strings.mp3");
        this.load.audio("wombChords", "womb-3-guitar+piano.mp3");
        this.load.audio("wombHiPerc", "womb-4-claps+shakers.mp3");
        this.load.audio("wombLoPerc", "womb-5-kick+congas.mp3");
        this.load.audio("wombBass", "womb-6-bass.mp3");

        // level 3
        this.load.setPath("assets/l3");

        this.load.image("lute-man", "lute-man.png");
        this.load.image("backboard", "backboard.png");
        this.load.image("marble", "marble.png");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
    }
}

