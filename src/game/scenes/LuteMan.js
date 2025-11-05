import Phaser from "phaser";

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.luteMan;
        this.elements = [
            {
                key: "wombBass",
                img: "",
            },
            {
                key: "wombStrings",
                tint: 0x5c0b22,
                shape: "womb-gemas",
                position: { x: 235, y: (4 / 5) * 1920 + 12 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombHiPerc",
                tint: 0x040536,
                shape: "womb-parentesis-l",
                position: { x: 366, y: (4 / 5) * 1920 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombLoPerc",
                tint: 0x040536,
                shape: "womb-0",
                position: { x: 540, y: (4 / 5) * 1920 - 22 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombChords",
                tint: 0x00ff00,
                shape: "womb-parentesis-r",
                position: {
                    x: 1080 - 364,
                    y: (4 / 5) * 1920,
                },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombVox",
                tint: 0xffff00,
                shape: "womb-gemas",
                position: {
                    x: 1080 - 230,
                    y: (4 / 5) * 1920 + 12,
                },
                size: {
                    x: 70,
                    y: 70,
                },
            },
        ];
    }

    preload() {}

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        this.add
            .image(
                0.5 * this.sys.game.canvas.width,
                (4 / 5) * this.sys.game.canvas.height,
                "womb-piedra"
            )
            .setOrigin(0.5, 0.5)
            .setScale(0.5625);

        this.elements.slice(1).forEach(({ shape, position: { x, y } }) => {
            this.add.image(x, y, shape).setOrigin(0.5, 0.5).setScale(0.55);
        });

        this.luteMan = this.add
            .image(888, 3000, "lute-man")
            .setOrigin(0.5, 1)
            .setScale(0.5)
            .setAngle(-10);

        this.tweens.add({
            targets: this.luteMan,
            y: 1920,
            duration: 1500,
            ease: "Bounce.easeOut",
        });
    }
    update() {}
}

