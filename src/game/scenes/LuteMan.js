import Phaser from "phaser";

const bar3 = 4.571;
const bar7 = 11.427;
const beatMs = 0.571;
const offset = 0;

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.audio = { beat: [] };
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
        this.flashes = [];
        // this.elements = [
        //     {
        //         key: "wombBass",
        //         img: "",
        //     },
        //     {
        //         key: "wombStrings",
        //         shape: "womb-gemas",
        //         position: { x: 235, y: (4 / 5) * 1920 + 12 },
        //         size: {
        //             x: 70,
        //             y: 70,
        //         },
        //     },
        //     {
        //         key: "wombHiPerc",
        //         shape: "womb-parentesis-l",
        //         position: { x: 366, y: (4 / 5) * 1920 },
        //         size: {
        //             x: 70,
        //             y: 70,
        //         },
        //     },
        //     {
        //         key: "wombLoPerc",
        //         shape: "womb-0",
        //         position: { x: 540, y: (4 / 5) * 1920 - 22 },
        //         size: {
        //             x: 70,
        //             y: 70,
        //         },
        //     },
        //     {
        //         key: "wombChords",
        //         shape: "womb-parentesis-r",
        //         position: {
        //             x: 1080 - 364,
        //             y: (4 / 5) * 1920,
        //         },
        //         size: {
        //             x: 70,
        //             y: 70,
        //         },
        //     },
        //     {
        //         key: "wombVox",
        //         shape: "womb-gemas",
        //         position: {
        //             x: 1080 - 230,
        //             y: (4 / 5) * 1920 + 12,
        //         },
        //         size: {
        //             x: 70,
        //             y: 70,
        //         },
        //     },
        // ];
    }

    preload() {
        this.load.audio("clave", "assets/l3/clave.mp3");
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        if (this.sound.getAll("audio").length === 0) {
            [
                "wombBass",
                "wombStrings",
                "wombHiPerc",
                "wombLoPerc",
                "wombChords",
                "wombVox",
            ].forEach((key) => {
                this.sound.play(key, { loop: true });
            });
        }

        [...new Array(8)].forEach((_, i) => {
            this.audio.beat[i] = this.sound.add("clave");
        });

        // this.add
        //     .image(
        //         0.5 * this.sys.game.canvas.width,
        //         (4 / 5) * this.sys.game.canvas.height,
        //         "womb-piedra"
        //     )
        //     .setOrigin(0.5, 0.5)
        //     .setScale(0.5625);

        // this.elements.slice(1).forEach(({ shape, position: { x, y } }) => {
        //     this.add.image(x, y, shape).setOrigin(0.5, 0.5).setScale(0.55);
        // });

        // luteman enters
        this.luteMan = this.add
            .image(950, 3000, "lute-man")
            .setOrigin(0.5, 1)
            .setScale(0.5)
            .setAngle(-10)
            .setDepth(1);

        this.tweens.add({
            targets: this.luteMan,
            y: 2300,
            duration: 1500,
            ease: "Bounce.easeOut",
        });

        // backboard setup
        this.backBoard = this.add
            .image(540, 888, "backboard")
            .setOrigin(0.5, 0.5)
            .setScale(1080 / 1200);

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
                .image(this.targets[0][i].x, 500, "marble")
                .setOrigin(0.5, 0.5)
                .setScale(0.22)
        );

        this.sound.get("wombBass").on("looped", () => {
            playBeat(0, this.marbleElements[0]);
            playBeat(1, this.marbleElements[1]);
            playBeat(2, this.marbleElements[2]);
            playBeat(3, this.marbleElements[3]);
            playBeat(4, this.marbleElements[0]);
            playBeat(5, this.marbleElements[1]);
            playBeat(6, this.marbleElements[2]);
            playBeat(7, this.marbleElements[3]);
        });

        const playBeat = (beat, marble) => {
            const delay = (beat < 4 ? bar3 : bar7) + beat * beatMs + offset;
            this.audio.beat[beat].play({
                delay,
            });
            setTimeout(() => {
                marble.setTint(0xaaaaaa);
                setTimeout(() => {
                    marble.clearTint();
                }, 100);
            }, delay * 1000);

            // this.tweens.addCounter({
            //     from: 0,
            //     to: 255,
            //     duration: 1000,
            //     ease: "Cubic.EaseIn",
            //     delay: delay * 1000,
            //     onUpdate: function (tween) {
            //         const value = Math.ceil(tween.getValue());

            //         marble.setTint(
            //             Phaser.Display.Color.GetColor(value, value, value)
            //         );
            //     },
            // });
        };
    }

    update() {}
}

