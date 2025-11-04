import Phaser from "phaser";

export default class Aurosymbology extends Phaser.Scene {
    constructor() {
        super("Aurosymbology");
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

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        this.elements.forEach(({ key }) => {
            this.audio[key] = this.sound.add(key);
        });

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
                .sprite(
                    225,
                    (i + 1) * (1920 / (this.elements.length + 1)),
                    "altavoz-in"
                )
                .setOrigin(0.5, 0.5)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => {
                    this.elements.forEach(({ key }) => {
                        this.audioElements[key].input.enabled &&
                            this.audioElements[key].clearTint();
                    });
                    this.selectedAudio = key;
                    this.audioElements[key].setTint(0xaaaaaa);
                    this.game.sound.stopAll();
                    this.audio[key].play();
                });
        });
        this.elements.forEach(({ key }, i) => {
            this.symbolElements[key] = this.add
                .image(
                    1080 - 225,
                    (i + 1) * (1920 / (this.elements.length + 1)),
                    `${key}-in`
                )
                .setOrigin(0.5, 0.5)
                .setScale(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => {
                    if (this.selectedAudio === key) {
                        this.audioElements[key].setTexture("altavoz-out");
                        this.audioElements[key].clearTint();
                        this.audioElements[key].disableInteractive();
                        this.symbolElements[key].setTexture(`${key}-out`);
                        this.symbolElements[key].disableInteractive();
                        this.score.matched.add(key);

                        if (this.score.matched.size === this.elements.length) {
                            this.cameras.main
                                .fadeOut(600, 0, 0, 0)
                                .on("camerafadeoutcomplete", () => {
                                    this.scene.start("WombTetris");
                                    this.scene.destroy();
                                });
                        }
                    } else {
                        this.audioElements[this.selectedAudio].clearTint();
                        this.selectedAudio = "";
                    }
                });
        });
    }
}

