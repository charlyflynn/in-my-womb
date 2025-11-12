import Phaser from "phaser";

// 150BPM converted to ms
const beatMs = 571;
const barMs = beatMs * 4;
const bar3 = barMs * 2;
const bar7 = barMs * 6;

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.luteMan;
        this.backBoard;
        this.selected = [3, 3, 3, 3];
        this.win = false;
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
        this.load.texture("luteManClosed", {
            IMG: { textureURL: "assets/l3/luteManClosed.png" },
        });
        this.load.texture("luteManOpen", {
            IMG: { textureURL: "assets/l3/luteManOpen.png" },
        });
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        // luteman enters
        this.luteMan = this.add
            .sprite(950, 3000, "luteManClosed")
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

        this.anims.create({
            key: "sing",
            duration: 571,
            frames: [
                {
                    key: "luteManOpen",
                    frame: 0,
                    duration: 400,
                },
                {
                    key: "luteManClosed",
                    frame: 0,
                    duration: 171,
                },
            ],
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

        const sounds = ["clave", "clave", "clave", "clave"]; // low, med, hi, no pitch respectively
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
                        this.anims.play("sing", [this.luteMan]);

                        setTimeout(() => {
                            this.marbleElements[beatIndex % 4].clearTint();
                        }, 100);
                    },
                }))
            )
            .flat();

        const winConditionCheck = [
            {
                at: barMs * 3,
                if: () =>
                    this.selected[0] === 1 &&
                    this.selected[1] === 0 &&
                    this.selected[2] === 2 &&
                    this.selected[3] === 1,
                run: () => {
                    this.win = true;
                },
            },
            {
                at: barMs * 4,
                if: () => this.win,
                run: () => {
                    timeline.stop();
                    this.scene.start("Fin");
                },
            },
            {
                at: barMs * 7,
                if: () =>
                    this.selected[0] === 1 &&
                    this.selected[1] === 0 &&
                    this.selected[2] === 2 &&
                    this.selected[3] === 1,
                run: () => {
                    this.win = true;
                },
            },
            {
                at: barMs * 8,
                if: () => this.win,
                run: () => {
                    timeline.stop();
                    this.scene.start("Fin");
                },
            },
        ];

        const timeline = this.add.timeline([
            ...tracks,
            ...timedEvents,
            ...winConditionCheck,
            { at: 18272 },
        ]);

        timeline.repeat().play();
    }

    update() {}
}

