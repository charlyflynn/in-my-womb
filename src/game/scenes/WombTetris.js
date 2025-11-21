import Phaser from "phaser";
import Tooltip, { addTooltip } from "../phaserTooltip";

const speed = { x: 200, y: 350 };
const speedScale = [1, 1.3, 1.6, 1.8, 2.0];
const shuffled = false;

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("WombTetris");
        this.cursor;
        this.player;
        this.players = {};
        this.womb;
        this.playerShadow = {};
        this.targets = {};
        this.audio = {};
        this.tween = { hover: {}, shadow: {} };
        this.score = {
            showScore: false,
            matched: new Set(),
            remaining: new Set(),
        };
        this.background;
        this.currentTarget = { x: 0.5, y: 1 };
        this.controls = {};
        this.elements = [
            {
                key: "wombBass",
                img: "",
            },
            {
                key: "wombChords",
                shape: "womb-gemas",
                position: { x: 235, y: 1432 + 12 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombStrings",
                shape: "womb-parentesis-l",
                position: { x: 366, y: 1432 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombLoPerc",
                shape: "womb-0",
                position: { x: 540, y: 1432 - 22 },
                size: {
                    x: 70,
                    y: 70,
                },
            },
            {
                key: "wombHiPerc",
                shape: "womb-parentesis-r",
                position: {
                    x: 1080 - 364,
                    y: 1432,
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
                    y: 1432 + 12,
                },
                size: {
                    x: 70,
                    y: 70,
                },
            },
        ];
        this.colliders = {};
    }

    preload() {
        this.load.scenePlugin("Tooltip", Tooltip, "Tooltip", "tooltip");
    }

    create() {
        // set up game environment
        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0);

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
                -25,
                "set the gems into the slots using the\narrow and rotation buttons to build the song",
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

        // set up audio channel
        const audioConfig = { loop: true, volume: 0 };
        this.audio.stonescrape = this.sound.add("stonescrape", {
            volume: 0.2,
        });

        this.elements.slice(1).forEach(({ key }) => {
            this.score.remaining.add(key);
        });
        this.elements.forEach(({ key }) => {
            this.audio[key] = this.sound.add(key, audioConfig);
        });

        this.beginWombAudio();

        // set up audio channel fade-in tweens
        this.elements.forEach(({ key }, i) => {
            this.tween[key] = this.tweens.add({
                targets: this.audio[key],
                volume: 1,
                duration: i > 0 ? 1500 : 0,
            });
            if (i > 0) this.tween[key].pause();
        });

        // initialise game
        this.addPlayers();
        this.addTargets();
        this.addCollisions();

        const playerKey = shuffled
            ? this.randomPlayerKey()
            : this.elements[1].key;
        this.setPlayer(playerKey);
        this.player.body.allowGravity = true;
        this.addControls();
    }

    randomPlayerKey() {
        const remaining = Array.from(this.score.remaining);
        return remaining[Phaser.Math.RND.between(0, remaining.length - 1)];
    }

    setPlayer(key) {
        this.player = this.players[key];
    }

    update() {
        // // out of bounds conditions
        if (
            this.player.y >=
            this.sys.game.canvas.height + this.player.displayHeight
        ) {
            this.player.setY(0 - this.player.displayHeight / 2);
        }
        if (this.player.x >= this.sys.game.canvas.width)
            this.player.setX(this.sys.game.canvas.width);
        else if (this.player.x <= 0) this.player.setX(0);
    }

    beginWombAudio() {
        this.elements.forEach(({ key }) => this.audio[key].play());
    }

    addCollisions() {
        const targets = this.elements.slice(1);
        // target collisions
        targets.forEach(({ key }) => {
            this.colliders[key] = this.physics.add.overlap(
                this.targets[key],
                this.players[key],
                () => this.onCollision(key),
                null,
                this
            );
        });

        // extra collisions to handle similar gems
        // this.colliders["wombVox-alt"] = this.physics.add.overlap(
        //     this.targets.wombVox,
        //     this.players.wombStrings,
        //     () => this.onCollision("wombVox"),
        //     null,
        //     this
        // );
        // this.colliders["wombStrings-alt"] = this.physics.add.overlap(
        //     this.targets.wombStrings,
        //     this.players.wombVox,
        //     () => this.onCollision("wombChords"),
        //     null,
        //     this
        // );
    }

    addControls() {
        this.controls.left = this.add
            .text(this.sys.game.canvas.width * 0.25, 2040, "<", {
                fill: "#333333",
                backgroundColor: "#cccccc",
                padding: 18,
                fontSize: 64,
                fontFamily: "Arial Black",
                align: "center",
            })
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setVelocityX(
                    -speed.x * speedScale[this.score.matched.size]
                );
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });
        this.controls.left = this.add
            .image(this.sys.game.canvas.width * 0.25, 2040, "arrowL")
            .setOrigin(0.5, 0.5)
            .setScale(0.18)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setVelocityX(
                    -speed.x * speedScale[this.score.matched.size]
                );
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });
        this.controls.rotate = this.add
            .image(this.sys.game.canvas.width * 0.5, 2040, "rotacion")
            .setOrigin(0.5, 0.5)
            .setScale(0.18)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {})
            .on("pointerup", () => {
                if (this.player.angle === 0) this.player.setAngle(90);
                else if (this.player.angle === 90) this.player.setAngle(0);
                //     this.player.setVelocityX(0);
            });
        this.controls.right = this.add
            .image(this.sys.game.canvas.width * 0.75, 2040, "arrowR")
            .setOrigin(0.5, 0.5)
            .setScale(0.18)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setVelocityX(
                    speed.x * speedScale[this.score.matched.size]
                );
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });

        this.tweens.add({
            targets: [
                this.controls.left,
                this.controls.rotate,
                this.controls.right,
            ],
            y: this.sys.game.canvas.height * 0.95,
            duration: 1000,
            ease: "Quart.easeInOut",
        });
    }

    enableControls() {
        for (let key in this.controls) {
            this.controls[key].setInteractive();
        }
    }
    disableControls() {
        for (let key in this.controls) {
            this.controls[key].disableInteractive();
        }
    }

    addPlayers() {
        // falling gems to match to slots

        // set play order randomly
        const shuffledElements = shuffled
            ? this.elements
                  .slice(1)
                  .map((element) => ({
                      ...element,
                      index: Math.random(),
                  }))
                  .sort((a, b) => {
                      if (a.index < b.index) return -1;
                      else if (a.index > b.index) return 1;
                      else return 0;
                  })
            : this.elements.slice(1);

        shuffledElements.forEach(({ key, shape, size: { x, y } }) => {
            this.players[key] = this.physics.add
                .image(Phaser.Math.RND.integerInRange(100, 980), -400, shape)
                .setOrigin(0.5, 0.5)
                .setMaxVelocity(speed.x, speed.y)
                // .setDisplaySize(200, 200)
                .setScale(0.65)
                .setDepth(2)
                .setAngle(Phaser.Math.RND.integerInRange(0, 1) * 90);
            // .setTint(tint);
            this.players[key].body.setSize(x, y).allowGravity = false;
            this.playerShadow[key] = this.players[key].postFX.addShadow(
                -15,
                15,
                0.006,
                0.7,
                0x333333,
                2,
                0.7
            );
            this.tween.hover[key] = this.tweens.add({
                targets: this.players[key],
                displayHeight: this.players[key].displayHeight + 10,
                displayWidth: this.players[key].displayWidth + 10,
                duration: 500,
                yoyo: true,
                repeat: -1,
            });
            this.tween.shadow[key] = this.tweens.add({
                targets: this.playerShadow[key],
                x: this.playerShadow[key].x - 8,
                y: this.playerShadow[key].y + 8,
                duration: 500,
                yoyo: true,
                repeat: -1,
            });
        });
    }

    addTargets() {
        // wombstone
        this.womb = this.add
            .image(1080 - 225, (5 / 6) * 1920, "womb-piedra")
            .setOrigin(0.5, 0.5)
            .setScale(450 / 1920)
            .setDepth(0);

        this.tweens.add({
            targets: this.womb,
            x: 540,
            y: 1432,
            scale: 0.5625,
            delay: 1000,
            duration: 1500,
            ease: "Quart.easeInOut",
        });

        // target slots
        const targets = this.elements.slice(1);
        targets.forEach(({ key, position: { x, y } }) => {
            this.targets[key] = this.physics.add
                .image(x, y, "gem")
                .setOrigin(0.5, 0.5)
                .setDepth(-1);
            this.targets[key].body.setSize(35, 35).allowGravity = false;
        });
    }

    onCollision(key) {
        // succesful hit with correct rotation
        if (this.player.rotation === this.targets[key].rotation) {
            this.audio.stonescrape.play();
            if (key !== "wombVox") this.tween[key].play();

            // animate in place
            this.disableControls();
            this.physics.world.removeCollider(this.colliders[key]);
            this.players[key].body.allowGravity = false;
            this.players[key].setVelocityX(0);
            this.players[key].setVelocityY(0);
            this.players[key].setGravityY(0);
            this.players[key].setDepth(1);

            this.tween.playerShadow = this.tweens.add({
                targets: this.playerShadow[key],
                x: 1,
                y: 1,
                duration: 1000,
                ease: "Quart.easeInOut",
            });

            this.tween.playerSize = this.tweens.add({
                targets: this.players[key],
                scale: 0.55,
                x: this.targets[key].x,
                y: this.targets[key].y,
                duration: 1000,
                ease: "Quart.easeInOut",
            });

            // update score
            this.score.matched.add(key);
            this.score.remaining.delete(key);
            this.score.showScore &&
                this.score.text.setText(this.updateScoreText());

            // continue game once animation has finished
            this.tween.playerShadow.on("complete", () => {
                this.targets[key].destroy();
                this.tween.hover[key].stop();
                this.tween.shadow[key].stop();

                if (this.score.remaining.size > 0) {
                    const newPlayerKey = shuffled
                        ? this.randomPlayerKey()
                        : this.elements[
                              this.elements.findIndex(
                                  (element) => element.key === key
                              ) + 1
                          ].key;
                    this.setPlayer(newPlayerKey);
                    this.player.setMaxVelocity(
                        speed.x * speedScale[this.score.matched.size],
                        speed.y * speedScale[this.score.matched.size]
                    );
                    this.player.body.allowGravity = true;
                    this.enableControls();
                } else {
                    this.tweens.add({
                        targets: [
                            this.controls.left,
                            this.controls.rotate,
                            this.controls.right,
                        ],
                        y: 2040,
                        duration: 1000,
                        ease: "Quart.easeInOut",
                        onComplete: () => {
                            this.tweens
                                .add({
                                    targets: [this.sound],
                                    volume: 0,
                                    duration: 1333,
                                    ease: "Linear",
                                })
                                .on("complete", () => {
                                    this.cameras.main.fadeOut(1000);
                                    this.sound.stopAll();
                                    this.scene.start("LuteMan");
                                    this.scene.destroy();
                                });
                        },
                    });
                }
            });
        }
    }
}

