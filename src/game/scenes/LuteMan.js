import Phaser from "phaser";

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.luteMan;
        this.backBoard;
        this.targets = [
            [
                { x: 260, y: 510 },
                { x: 450, y: 510 },
                { x: 1080 - 442, y: 510 },
                { x: 1080 - 252, y: 510 },
            ],
            [
                { x: 260, y: 698 },
                { x: 450, y: 698 },
                { x: 1080 - 442, y: 698 },
                { x: 1080 - 252, y: 698 },
            ],
            [
                { x: 260, y: 888 },
                { x: 450, y: 888 },
                { x: 1080 - 442, y: 888 },
                { x: 1080 - 252, y: 888 },
            ],
        ];
        this.marbles = [...new Array(4)];
        this.marbleElements = [];
        // targets['note']['position']
        this.targetElements = [...this.targets];
        this.elements = [
            {
                key: "wombBass",
                img: "",
            },
            {
                key: "wombStrings",
                shape: "womb-gemas",
                position: { x: 235, y: (4 / 5) * 1920 + 12 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombHiPerc",
                shape: "womb-parentesis-l",
                position: { x: 366, y: (4 / 5) * 1920 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombLoPerc",
                shape: "womb-0",
                position: { x: 540, y: (4 / 5) * 1920 - 22 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombChords",
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

        // luteman enters
        this.luteMan = this.add
            .image(888, 3000, "lute-man")
            .setOrigin(0.5, 1)
            .setScale(0.5)
            .setAngle(-10)
            .setDepth(1);

        this.tweens.add({
            targets: this.luteMan,
            y: 1920,
            duration: 1500,
            ease: "Bounce.easeOut",
        });

        // backboard setup
        this.backBoard = this.add
            .image(540, 700, "backboard")
            .setOrigin(0.5, 0.5)
            .setScale(0.7);

        this.targetElements = this.targets.map((row) =>
            row.map(
                ({ x, y }) =>
                    (this.physics.add.existing(
                        this.add
                            .rectangle(x, y, 75, 75)
                            .setSize(90, 90)
                            .setInteractive({ cursor: "pointer" })
                    ).body.allowGravity = false)
            )
        );

        // add marbles
        this.marbleElements = this.marbles.map((_, i) =>
            this.add
                .image(this.targets[0][i].x, 255, "marble")
                .setOrigin(0.5, 0.5)
                .setScale(0.22)
        );
    }

    update() {}
}

