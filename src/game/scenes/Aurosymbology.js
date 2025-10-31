import Phaser from "phaser";

export default class Aurosymbology extends Phaser.Scene {
    constructor() {
        super("Aurosymbology");
        this.audio = {};
        this.audioElements = {};
        this.symbolElements = {};
        this.selectedAudio = "";
        this.elements = [
            { key: "FIREWORM" },
            { key: "FINALISE" },
            { key: "NIÑO" },
            { key: "THE SPLINTER" },
            { key: "IN MY WOMB" },
        ];
        this.score = {
            matched: new Set(),
            remaining: new Set(),
        };
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        this.audio.grunts = this.sound.add("grunts");

        this.elements.forEach(({ key }, i) => {
            this.audioElements[key] = this.add
                .sprite(225, (i + 1) * (1920 / 6), "wombStone")
                .setOrigin(0.5, 0.5)
                .setScale(0.2)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => {
                    this.elements.forEach(({ key }) => {
                        this.audioElements[key].input.enabled &&
                            this.audioElements[key].clearTint();
                    });
                    this.selectedAudio = key;
                    this.audioElements[key].setTint(0xaaaaaa);
                    this.audio.grunts.play();
                });
        });
        this.elements.forEach(({ key }, i) => {
            this.symbolElements[key] = this.add
                .image(1080 - 225, (i + 1) * (1920 / 6), "wombStone")
                .setOrigin(0.5, 0.5)
                .setScale(0.2)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => {
                    if (this.selectedAudio === key) {
                        this.audioElements[key].setTint(0xaaaaaa);
                        this.audioElements[key].disableInteractive();
                        this.symbolElements[key].setTint(0xaaaaaa);
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

