import Phaser from "phaser";
import Tooltip, { addTooltip } from "../phaserTooltip";

// 150BPM converted to ms
const beatMs = 571;
const barMs = beatMs * 4;
const bar3 = barMs * 2;
const bar7 = barMs * 6;

const objectSize = 120;
const objectScale = 0.15;
export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("LuteMan");
        this.luteMan;
        this.backBoard;
        this.selectedTones = [3, 3, 3, 3];
        this.win = false;
        this.winPlayed = false;
        this.timeline;
        this.lutemanSings = true;
        this.targetPositions = [
            [
                { x: 178, y: 645, sound: "in-g" },
                { x: 423, y: 645, sound: "my-g" },
                { x: 668, y: 645, sound: "wo-g" },
                { x: 910, y: 645, sound: "omb-g" },
            ],
            [
                { x: 178, y: 885, sound: "in-f" },
                { x: 423, y: 885, sound: "my-f" },
                { x: 668, y: 885, sound: "wo-f" },
                { x: 910, y: 885, sound: "omb-f" },
            ],
            [
                { x: 178, y: 1130, sound: "in-e" },
                { x: 423, y: 1130, sound: "my-e" },
                { x: 668, y: 1130, sound: "wo-e" },
                { x: 910, y: 1130, sound: "omb-e" },
            ],
            [
                { x: 178, y: 295, sound: "clave" },
                { x: 423, y: 295, sound: "clave" },
                { x: 668, y: 295, sound: "clave" },
                { x: 910, y: 295, sound: "clave" },
            ],
        ];
        this.draggableObjects = [];
        this.dropZoneObjects = [];
    }

    preload() {
        this.load.scenePlugin("Tooltip", Tooltip, "Tooltip", "tooltip");
    }

    create() {
        this.background = this.add.image(0, 0, "bgPlates").setOrigin(0, 0);
        this.sound.pauseOnBlur = false;
        this.sound.add("gruntBirthdayParty");
        this.cameras.main.fadeIn(1000);

        const notes = ["e", "f", "g"];
        const syllables = ["in", "my", "wo", "omb"];
        notes.forEach((note) => {
            syllables.forEach((syllable) => {
                this.sound.add(`${syllable}-${note}`);
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
        const soundObjects = sounds.map((sound) => this.sound.add(sound));

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

        // // add titles
        // this.add
        //     .text(1080 / 2, 125, "GEM-STONE SONG BUILDING", {
        //         fontFamily: "nobody",
        //         fontSize: 32,
        //         align: "center",
        //         color: "#cccccc",
        //         fontStyle: "bold",
        //         lineSpacing: 30,
        //         letterSpacing: 2,
        //         padding: 37,
        //     })
        //     .setOrigin(0.5, 0.5)
        //     .setBackgroundColor("#33333344");

        // add tooltip
        const questionMark = this.add
            .image(1080 - 120, 100, "questionMark")
            .setScale(0.15)
            .setAlpha(0.5)
            .on("pointerover", () => {
                questionMark.setAlpha(1);
            })
            .on("pointerout", () => {
                questionMark.setAlpha(0.5);
            });

        const rect = this.add
            .rectangle(0, -50, 920, 120, "#333333")
            .setAlpha(0.87)
            .on("pointerover", () => {
                questionMark.setAlpha(1);
            })
            .on("pointerout", () => {
                questionMark.setAlpha(0.5);
            });

        const text = this.add
            .text(
                0,
                -10,
                "build the ‘score’ for the lute-man to sing\nby positioning the coins (notes) in their slots,\nin order to match the melody you hear elsas sing",
                {
                    fontFamily: "roobert",
                    fontStyle: "bold",
                    fontSize: 26,
                    align: "center",
                    color: "#e34727",
                }
            )
            .setOrigin(0.5, 1);

        const tooltipContent = this.add.container(0, 415, [rect, text]);
        addTooltip(545, 0, questionMark, tooltipContent, this);

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

        this.tweens.add({
            targets: [this.sound],
            volume: 1,
            duration: 666,
            ease: "Linear",
        });

        // backboard setup
        this.backBoard = this.add
            .image(540, 888, "backboard")
            .setOrigin(0.5, 0.5)
            .setScale(1080 / 1200);

        // drop zones for draggable objects
        this.dropZoneObjects = this.targetPositions.map((row) =>
            row.map(({ x, y }) =>
                this.physics.add.existing(
                    this.add.zone(x, y, objectSize, objectSize),
                    true
                )
            )
        );

        // add draggable objects
        this.draggableObjects = [...new Array(4)].map((_, objectIndex) => {
            const object = this.physics.add
                .image(
                    this.targetPositions[3][objectIndex].x,
                    this.targetPositions[3][objectIndex].y,
                    "moneda"
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ cursor: "pointer", draggable: true })
                .on("dragleave", () => {
                    this.selectedTones[objectIndex] = 3;
                })
                .on("drag", (_, dragX, dragY) =>
                    // draggable through y axis
                    object.setY(dragY)
                )
                .on("dragend", () => {
                    // snap to target zones

                    soundObjects[this.selectedTones[objectIndex]].play();
                    // this.anims.play("sing", [this.luteMan]);
                    object.setY(
                        this.targetPositions[this.selectedTones[objectIndex]][
                            this.selectedTones[objectIndex]
                        ].y
                    );
                });
            object.setScale(objectScale);
            object.body.setSize(
                objectSize / objectScale,
                objectSize / objectScale
            );
            object.body.allowGravity = false;
            return object;
        });

        // select tones to play
        this.draggableObjects.forEach((object, i) => {
            this.dropZoneObjects.forEach((target, j) => {
                this.physics.add.overlap(object, target, () => {
                    this.selectedTones[i] = j;
                });
            });
        });

        const timedEvents = beats.map(
            (beat, beatIndex) => {
                return {
                    // sound: this.targetPositions[beatIndex % 4][
                    //     this.selectedTones[beatIndex % 4]
                    // ].sound,
                    at: beat,
                    // if: () => this.selectedTones[beatIndex % 4] === soundIndex,
                    run: () => {
                        // todo: replace with tween
                        if (this.lutemanSings)
                            this.sound.play(
                                this.targetPositions[
                                    this.selectedTones[beatIndex % 4]
                                ][beatIndex % 4].sound,
                                { volume: 2 }
                            );
                        this.draggableObjects[beatIndex % 4].setTint(0xcccccc);
                        if (this.selectedTones[beatIndex % 4] < 3)
                            this.anims.play("sing", [this.luteMan]);

                        setTimeout(() => {
                            this.draggableObjects[beatIndex % 4].clearTint();
                        }, 100);
                    },
                };
            }
            // })
            // )
        );
        // .flat();
        // const timedEvents = beats
        //     .map((beat, beatIndex) =>
        //         sounds.map((sound, soundIndex) => ({
        //             sound,
        //             at: beat,
        //             if: () => this.selectedTones[beatIndex % 4] === soundIndex,
        //             run: () => {
        //                 // todo: replace with tween
        //                 this.draggableObjects[beatIndex % 4].setTint(0xcccccc);
        //                 if (this.selectedTones[beatIndex % 4] < 3)
        //                     this.anims.play("sing", [this.luteMan]);

        //                 setTimeout(() => {
        //                     this.draggableObjects[beatIndex % 4].clearTint();
        //                 }, 100);
        //             },
        //         }))
        //     )
        //     .flat();

        const winConditionCheck = [
            {
                at: barMs * 3,
                if: () =>
                    this.selectedTones[0] === 1 &&
                    this.selectedTones[1] === 2 &&
                    this.selectedTones[2] === 0 &&
                    this.selectedTones[3] === 1 &&
                    !this.win,
                run: () => {
                    this.win = true;
                    this.sound.get("gruntBirthdayParty").play();
                },
            },
            {
                at: barMs * 4,
                if: () => this.win,
                run: () => {
                    // timeline.stop();
                    if (this.lutemanSings) this.game.scene.start("Fin");
                    this.lutemanSings = false;
                },
            },
            {
                at: barMs * 7,
                if: () =>
                    this.selectedTones[0] === 1 &&
                    this.selectedTones[1] === 2 &&
                    this.selectedTones[2] === 0 &&
                    this.selectedTones[3] === 1 &&
                    !this.win,
                run: () => {
                    this.win = true;
                    this.sound.get("gruntBirthdayParty").play();
                },
            },
            {
                at: barMs * 8,
                if: () => this.win,
                run: () => {
                    // timeline.stop();
                    if (this.lutemanSings) this.game.scene.start("Fin");
                    this.lutemanSings = false;
                },
            },
        ];

        this.timeline = this.add.timeline([
            ...tracks,
            ...timedEvents,
            ...winConditionCheck,
            { at: 18272 },
        ]);

        this.timeline.repeat().play();
    }

    update() {}
}

