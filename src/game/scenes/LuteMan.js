import Phaser from "phaser";

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
        this.selection;
        this.win = false;
        this.targetPositions = [
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
            [
                { x: 182, y: 295 },
                { x: 425, y: 295 },
                { x: 666, y: 295 },
                { x: 905, y: 295 },
            ],
        ];
        this.draggableObjects = [];
        this.dropZoneObjects = [];
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

        // add titles
        this.add
            .text(1080 / 2, 125, "GEM-STONE SONG BUILDING", {
                fontFamily: "nobody",
                fontSize: 38,
                align: "center",
                color: "#cccccc",
                fontStyle: "bold",
                lineSpacing: 30,
                letterSpacing: 2,
                padding: 37,
            })
            .setOrigin(0.5, 0.5)
            .setBackgroundColor("#33333344");

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
                    object.setY(
                        this.targetPositions[this.selectedTones[objectIndex]][
                            this.selectedTones[objectIndex]
                        ].y
                    );
                });
            // snap to position
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
                        this.draggableObjects[beatIndex % 4].setTint(0xcccccc);
                        if (this.selectedTones[beatIndex % 4] < 3)
                            this.anims.play("sing", [this.luteMan]);

                        setTimeout(() => {
                            this.draggableObjects[beatIndex % 4].clearTint();
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

