import Phaser from "phaser";
import { draggable } from "./draggable";

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
        this.selectedTones = [3, 3, 3, 3];
        this.selection;
        this.win = false;
        this.targets = [
            [
                { x: 182, y: 642 },
                { x: 425, y: 642 },
                { x: 666, y: 642 },
                { x: 905, y: 642 },
            ],
            [
                { x: 182, y: 885 },
                { x: 425, y: 885 },
                { x: 666, y: 885 },
                { x: 905, y: 885 },
            ],
            [
                { x: 182, y: 1130 },
                { x: 425, y: 1130 },
                { x: 666, y: 1130 },
                { x: 905, y: 1130 },
            ],
        ];
        this.marbles = [...new Array(4)];
        this.marbleElements = [];
        this.targetElements = [...this.targets];
    }

    preload() {
        this.load.texture("luteManClosed", {
            IMG: { textureURL: "assets/l3/luteManClosed.png" },
        });
        this.load.texture("luteManOpen", {
            IMG: { textureURL: "assets/l3/luteManOpen.png" },
        });
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.sound.add("gruntBirthdayParty");

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
            row.map(({ x, y }) =>
                this.physics.add.existing(this.add.zone(x, y, 120, 120), true)
            )
        );

        // add marbles
        this.marbleElements = this.marbles.map((_, i) =>
            draggable(
                this.physics.add
                    .image(this.targets[0][i].x, 250, "moneda")
                    .setOrigin(0.5, 0.5)
                    .setScale(0.15)
                    .on("pointerout", () => {
                        this.selectedTones[i] = 3;
                    })
            )
        );

        this.marbleElements.forEach((marble, i) => {
            this.targetElements.forEach((target, j) => {
                this.physics.add.overlap(marble, target, () => {
                    this.selectedTones[i] = j;
                });
            });
        });

        const tracks = [
            { sound: "wombBass", at: 0 },
            { sound: "wombStrings", at: 0 },
            { sound: "wombHiPerc", at: 0 },
            { sound: "wombLoPerc", at: 0 },
            { sound: "wombChords", at: 0 },
            { sound: "wombVox", at: 0 },
        ];

        const sounds = ["gRhodes", "fRhodes", "eRhodes", "clave"]; // hi, med, low, no pitch respectively
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
                    if: () => this.selectedTones[beatIndex % 4] === soundIndex,
                    run: () => {
                        // todo: replace with tween
                        this.marbleElements[beatIndex % 4].setTint(0xcccccc);
                        if (this.selectedTones[beatIndex % 4] < 3)
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
                    this.selectedTones[0] === 1 &&
                    this.selectedTones[1] === 2 &&
                    this.selectedTones[2] === 0 &&
                    this.selectedTones[3] === 1,
                run: () => {
                    this.win = true;
                    this.sound.get("gruntBirthdayParty").play();
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
                    this.selectedTones[0] === 1 &&
                    this.selectedTones[1] === 2 &&
                    this.selectedTones[2] === 0 &&
                    this.selectedTones[3] === 1,
                run: () => {
                    this.win = true;
                    this.sound.get("gruntBirthdayParty").play();
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

