import Phaser from "phaser";

const bar3 = 4568;
const bar7 = 13704;
const beatMs = 571;

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.audio = { beat: [] };
        this.luteMan;
        this.backBoard;
        this.selected = [1, 0, 2, 1];
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
        this.targetElements = [...this.targets];
    }

    preload() {
        this.load.audio("clave", "assets/l3/clave.mp3");
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        // luteman enters
        this.luteMan = this.add
            .image(950, 3000, "luteMan")
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
                        this.add.rectangle(x, y, 75, 75).setSize(90, 90)
                        // .setInteractive({ cursor: "pointer" })
                    ).body.allowGravity = false)
            )
        );

        // add marbles
        this.marbleElements = this.marbles.map((_, i) =>
            this.add
                .image(this.targets[0][i].x, 500, "marble")
                .setOrigin(0.5, 0.5)
                .setScale(0.22)
                .setInteractive({ cursor: "pointer" })
                .on("pointerup", () => {
                    if (this.selected[i] < 2)
                        this.selected[i] = this.selected[i] + 1;
                    else this.selected[i] = 0;

                    console.log(this.selected);
                })
        );

        const tracks = [
            { sound: "wombBass", at: 0 },
            { sound: "wombStrings", at: 0 },
            { sound: "wombHiPerc", at: 0 },
            { sound: "wombLoPerc", at: 0 },
            { sound: "wombChords", at: 0 },
            { sound: "wombVox", at: 0 },
        ];

        const sounds = ["clave", "clave", "clave"];
        const beats = [
            bar3,
            bar3 + beatMs,
            bar3 + 2 * beatMs,
            bar3 + 3 * beatMs,
            bar7,
            bar7 + beatMs,
            bar7 + 2 * beatMs,
            bar7 + 3 * beatMs,
        ];
        const timedEvents = beats
            .map((beat, beatIndex) =>
                sounds.map((sound, soundIndex) => ({
                    sound,
                    at: beat,
                    if: () => this.selected[beatIndex % 4] === soundIndex,
                    run: () => {
                        // todo: replace with tween
                        this.marbleElements[beatIndex % 4].setTint(0xcccccc);
                        setTimeout(() => {
                            this.marbleElements[beatIndex % 4].clearTint();
                        }, 100);
                    },
                }))
            )
            .flat();

        const timeline = this.add.timeline([
            ...tracks,
            ...timedEvents,
            { at: 18272 },
        ]);

        timeline.repeat().play();
    }

    update() {}
}

