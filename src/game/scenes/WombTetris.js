import Phaser from "phaser";

const speed = { x: 200, y: 350 };

export default class WombTetris extends Phaser.Scene {
    constructor() {
        super("WombTetris");
        this.cursor;
        this.player;
        this.players = {};
        this.playerShadow = {};
        this.targets = {};
        this.audio = {};
        this.tween = { hover: {}, shadow: {} };
        this.score = {
            showScore: false,
            matched: new Set(),
            remaining: new Set(),
        };
        this.emitter = {};
        this.background;
        this.currentTarget = { x: 0.5, y: 1 };
        this.controls;
        this.elements = [
            {
                key: "wombBass",
                img: "",
                tint: 0xffffff,
                shape: "",
                position: 0,
                size: {
                    x: 35,
                    y: 35,
                },
            },
            {
                key: "wombStrings",
                tint: 0x5c0b22,
                shape: "wombGems",
                position: 235,
                size: {
                    x: 35,
                    y: 35,
                },
            },
            {
                key: "wombHiPerc",
                tint: 0x040536,
                shape: "wombBrackets",
                position: 540,
                size: {
                    x: 35,
                    y: 35,
                },
            },
            {
                key: "wombLoPerc",
                tint: 0x040536,
                shape: "womb0",
                position: 540,
                size: {
                    x: 35,
                    y: 35,
                },
            },
            // {
            //     key: "wombChords",
            //     tint: 0x00ff00,
            //     shape: "wombBrackets",
            //     position: 1080 - 360,
            //     size: {
            //         x: 200,
            //         y: 200,
            //     },
            // },
            {
                key: "wombVox",
                tint: 0xffff00,
                shape: "wombGems",
                position: 1080 - 235,
                size: {
                    x: 35,
                    y: 35,
                },
            },
        ];
        this.colliders = {};
    }

    preload() {}

    create() {
        // set up game environment
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        // this.background.displayWidth = 1080;
        // this.background.displayHeight = 1920;

        // set up audio channel
        this.sound.pauseOnBlur = false;
        const audioConfig = { loop: true, volume: 0 };
        this.elements.slice(1).forEach(({ key }) => {
            this.score.remaining.add(key);
        });
        this.elements.forEach(({ key }) => {
            this.audio[key] = this.sound.add(key, audioConfig);
        });
        this.audio.hit = this.sound.add("hit", {
            volume: 0.1,
        });
        this.beginWombAudio();
        // this.sound.pauseAll();

        // set up audio channel fade-in tweens
        this.elements.forEach(({ key }, i) => {
            this.tween[key] = this.tweens.add({
                targets: this.audio[key],
                volume: 1,
                duration: i > 0 ? 1500 : 0,
            });
            if (i > 0) this.tween[key].pause();
        });

        this.cameras.main.fadeIn(600, 0, 0, 0);

        // ui
        this.score.text = this.score.showScore
            ? this.add.text(0, 10, this.updateScoreText(), {
                  font: "25px Arial",
                  fill: "#333333",
              })
            : null;

        // initialise game
        this.addPlayers();
        this.addTargets();
        this.addCollisions();
        this.addParticles();
        const playerKey = this.randomPlayerKey();
        this.setPlayer(playerKey);
        this.player.body.allowGravity = true;
        this.addControls();
    }

    updateScoreText() {
        return `Matched: ${this.score.matched
            .keys()
            .reduce(
                (a, b) => a + ", " + b,
                ""
            )} || Remaining: ${this.score.remaining
            .keys()
            .reduce((a, b) => a + ", " + b, "")}`;
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
    }

    addParticles() {
        const targets = this.elements.slice(1);
        // target particle emitters
        targets.forEach(({ key, tint }) => {
            this.emitter[key] = this.add
                .particles(0, 0, "gem", {
                    speed: 100,
                    gravityY: speed.y - 75,
                    scale: 0.05,
                    duration: 100,
                    tint: tint,
                })
                .startFollow(this.targets[key], 0, -32)
                .stop();
        });
    }

    addControls() {
        this.controls = this.add
            .text(
                this.sys.game.canvas.width * 0.25,
                this.sys.game.canvas.height * 0.95,
                "<",
                {
                    fill: "#333333",
                    backgroundColor: "#cccccc",
                    padding: 18,
                    fontSize: 64,
                    fontFamily: "Arial Black",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setVelocityX(-speed.x);
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });
        this.controls = this.add
            .text(
                this.sys.game.canvas.width * 0.5,
                this.sys.game.canvas.height * 0.95,
                "↻",
                {
                    fill: "#333333",
                    backgroundColor: "#cccccc",
                    padding: 18,
                    fontSize: 64,
                    fontFamily: "Arial Black",
                    align: "center",
                    fontStyle: "bold",
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setAngle(this.player.angle + 90);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });
        this.controls = this.add
            .text(
                this.sys.game.canvas.width * 0.75,
                this.sys.game.canvas.height * 0.95,
                ">",
                {
                    fill: "#333333",
                    backgroundColor: "#cccccc",
                    padding: 18,
                    fontSize: 64,
                    fontFamily: "Arial Black",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.player.setVelocityX(speed.x);
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            })
            .on("pointerout", () => {
                this.player.setVelocityX(0);
            });
    }

    addPlayers() {
        // falling elements to match to gems

        // falling gems to match to slots
        this.elements.slice(1).forEach(({ key, shape, size: { x, y } }) => {
            this.players[key] = this.physics.add
                .image(this.sys.game.canvas.width / 2, -400, shape)
                .setOrigin(0.5, 0.5)
                .setMaxVelocity(speed.x, speed.y)
                // .setDisplaySize(200, 200)
                .setScale(1.3)
                .setDepth(2)
                .setAngle(Phaser.Math.RND.integerInRange(0, 3) * 90);
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
        this.add
            .image(
                0.5 * this.sys.game.canvas.width,
                (4 / 5) * this.sys.game.canvas.height,
                "wombStone"
            )
            .setOrigin(0.5, 0.5)
            .setScale(0.5625)
            .setDepth(0);

        // target slots
        const targets = this.elements.slice(1);
        targets.forEach(({ key, position }) => {
            this.targets[key] = this.physics.add
                .image(position, (4 / 5) * this.sys.game.canvas.height, "gem")
                .setOrigin(0.5, 0.5)
                .setDepth(-1);
            this.targets[key].body.setSize(35, 35).allowGravity = false;
        });
    }

    onCollision(key) {
        // succesful hit with correct rotation
        if (this.player.rotation === this.targets[key].rotation) {
            this.audio.hit.play();
            // this.emitter[key].start();
            this.tween[key].play();

            // animate in place
            this.physics.world.removeCollider(this.colliders[key]);
            this.players[key].body.allowGravity = false;
            this.players[key].setVelocityY(0);
            this.players[key].setGravityY(0);
            this.players[key].setDepth(1);

            this.tween.playerShadow = this.tweens.add({
                targets: this.playerShadow[key],
                x: 1,
                y: 1,
                duration: 1000,
                ease: Phaser.Math.Easing.Expo.InOut,
            });

            this.tween.playerSize = this.tweens.add({
                targets: this.players[key],
                scale: 1.1,
                x: this.targets[key].x,
                y: this.targets[key].y,
                duration: 1000,
                ease: Phaser.Math.Easing.Expo.InOut,
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
                    const newPlayerKey = this.randomPlayerKey();
                    this.setPlayer(newPlayerKey);
                    this.player.body.allowGravity = true;
                } else {
                    this.cameras.main
                        .fadeOut(600, 0, 0, 0)
                        .on("camerafadeoutcomplete", () => {
                            this.scene.start("GameOver");
                            this.scene.destroy();
                        });
                }
            });
        }
    }
}

