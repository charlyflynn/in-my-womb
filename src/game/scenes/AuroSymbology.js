import Phaser from "phaser";
import Tooltip, { addTooltip } from "../phaserTooltip";

export default class AuroSymbology extends Phaser.Scene {
    constructor() {
        super("AuroSymbology");
        this.audio = {};
        this.audioElements = {};
        this.symbolElements = {};
        this.selectedAudio = "";
        this.elements = [
            { key: "fireworm" },
            { key: "finalise" },
            { key: "nino" },
            { key: "splinter" },
            { key: "womb" },
        ];
        this.score = {
            matched: new Set(),
            remaining: new Set(),
        };
    }

    preload() {
        this.load.scenePlugin("Tooltip", Tooltip, "Tooltip", "tooltip");
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        // add womb speifically for animation
        this.womb = this.add
            .image(1080 - 225, (5 / 6) * 1920, "womb-piedra")
            .setOrigin(0.5, 0.5)
            .setScale(450 / 1920)
            .setDepth(0);

        // add titles
        const title = this.add
            .text(1080 / 2, 125, "SOUND TO SYMBOL ASSOCIATION", {
                fontFamily: "nobody",
                fontSize: 32,
                align: "center",
                color: "#cccccc",
                fontStyle: "bold",
                lineSpacing: 30,
                letterSpacing: 2,
                padding: 37,
            })
            .setOrigin(0.5, 0.5)
            .setBackgroundColor("#33333344");

        // add tooltip
        const questionMark = this.add
            .image(1080 - 60, 125, "questionMark")
            .setScale(0.08)
            // .image(1080 - 60, 125, "questionMark")
            .setAlpha(0.5)
            .on("pointerover", () => {
                questionMark.setAlpha(1);
            })
            .on("pointerout", () => {
                questionMark.setAlpha(0.5);
            });

        const rect = this.add
            .rectangle(0, -50, 920, 400, "#333333")
            .setAlpha(0.87);

        const text = this.add.text(
            -250,
            -240,
            "Tap on the sonic rocks to hear each typing sound\nand match it with the respective typed symbol",
            {
                fontFamily: "roobert",
                fontStyle: "bold",
                fontSize: 26,
                align: "center",
                color: "#e34727",
            }
        );
        // .setOrigin(0, 0);

        const keyboard = this.add
            .image(0, -20, "keyboard")
            .setScale(0.65)
            .setAlpha(0.9);
        const tooltipContent = this.add.container(0, 550, [
            rect,
            keyboard,
            text,
        ]);
        addTooltip(545, 0, questionMark, tooltipContent, this);

        // add all other elements
        this.elements.forEach(({ key }) => {
            this.audio[key] = this.sound.add(key, { volume: 3 });
        });
        this.audio.stonescrape = this.sound.add("stonescrape", { volume: 0.3 });
        this.audio.unselect = this.sound.add("unselect", { volume: 1 });

        // shuffle game to be unique
        const shuffledElements = this.elements
            .map((element) => ({
                ...element,
                index: Math.random(),
            }))
            .sort((a, b) => {
                if (a.index < b.index) return -1;
                else if (a.index > b.index) return 1;
                else return 0;
            });

        shuffledElements.forEach(({ key }, i) => {
            this.audioElements[key] = this.add
                .image(
                    225,
                    (i + 1) * (1920 / (this.elements.length + 1)),
                    "altavoz-out"
                )
                .setOrigin(0.5, 0.5)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true, pixelPerfect: true })
                .on("pointerup", () => {
                    this.elements.forEach(({ key }) => {
                        this.audioElements[key].input.enabled &&
                            this.audioElements[key].clearTint();
                    });
                    this.selectedAudio = key;
                    this.audioElements[key].setTint(0xcccccc);
                    this.game.sound.stopAll();
                    this.audio[key].play();
                });
        });
        this.elements.forEach(({ key }, i) => {
            this.symbolElements[key] = this.add
                .image(
                    1080 - 225,
                    (i + 1) * (1920 / (this.elements.length + 1)),
                    `${key}-out`
                )
                .setOrigin(0.5, 0.5)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true, pixelPerfect: true })
                .on("pointerup", () => {
                    if (this.selectedAudio === key) {
                        // win condition where audio matches symbol
                        this.audioElements[key].setTexture("altavoz-in");
                        this.audioElements[key].clearTint();
                        this.audioElements[key].disableInteractive();
                        this.symbolElements[key].setTexture(`${key}-in`);
                        this.symbolElements[key].disableInteractive();

                        this.score.matched.add(key);

                        this.game.sound.stopAll();
                        this.audio.stonescrape.play(); // confirmation sound

                        if (this.score.matched.size === this.elements.length) {
                            // game success
                            this.tweens.add({
                                targets: [
                                    ...Object.keys(this.audioElements).map(
                                        (audioKey) =>
                                            this.audioElements[audioKey]
                                    ),
                                    ...Object.keys(this.symbolElements)
                                        // .slice(0, -1)
                                        .map(
                                            (symbolKey) =>
                                                this.symbolElements[symbolKey]
                                        ),
                                    title,
                                ],
                                duration: 1000,
                                alpha: 0,
                                onComplete: () => {
                                    this.scene.start("WombTetris");
                                    this.scene.destroy();
                                },
                            });
                        }
                    } else {
                        // incorrect element match
                        this.audioElements[this.selectedAudio].clearTint();
                        this.selectedAudio = "";
                        this.game.sound.stopAll();
                        this.audio.unselect.play();
                    }
                });

            this.cameras.main.fadeIn(1000);
        });
    }
}

