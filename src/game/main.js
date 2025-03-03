// import { Boot } from "./scenes/Boot";
// import { Game } from "./scenes/Game";
// import { GameOver } from "./scenes/GameOver";
// import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
// import { Preloader } from "./scenes/Preloader";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const speed = { x: 100, y: 300 };

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.cursor;
        this.player;
        this.targets = {};
        this.audio = {};
        this.score = { showScore: false, set: new Set() };
        this.emitter = {};
        this.background;
        this.currentTarget = { x: 0.5, y: 1 };
        this.controls;
    }

    preload() {
        this.load.image("background", "assets/bg.png");
        this.load.image("star", "assets/star.png");
        this.load.audio("bgMusic", "assets/InMyRoom.mp3");
        this.load.audio("hit", "assets/gruntBirthdayParty.mp3");
    }

    resizeBg() {
        // image css 'cover' behaviour
        if (this.sys.game.canvas.height > this.background.height)
            this.background.displayHeight = this.sys.game.canvas.height;
        if (this.sys.game.canvas.width > this.background.width)
            this.background.displayWidth = this.sys.game.canvas.width;
    }

    create() {
        // environment
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.resizeBg();
        this.scene.pause("scene-game");

        const audioConfig = { loop: true, volume: 0 };
        this.audio = {
            bg: this.sound.add("bgMusic", {
                volume: 0.7,
                pan: -0.5,
            }),
            bga: this.sound.add("bgMusic", {
                ...audioConfig,
                pan: -1,
                detune: -75,
            }),
            bgb: this.sound.add("bgMusic", {
                ...audioConfig,
                pan: 1,
                detune: -50,
            }),
            bgc: this.sound.add("bgMusic", {
                ...audioConfig,
                detune: -100,
            }),
        };
        this.audio.hit = this.sound.add("hit", {
            volume: 0.5,
            seek: 1,
        });
        this.audio.bg.play();
        this.audio.bga.play();
        this.audio.bgb.play();
        this.audio.bgc.play();

        //ui
        this.score.text = this.score.showScore
            ? this.add.text(0, 10, "Placed:", {
                  font: "25px Arial",
                  fill: "#000000",
              })
            : null;

        //player
        this.player = this.physics.add
            .image(this.sys.game.canvas.width / 2, 0, "star")
            .setOrigin(0.5, 1)
            .setMaxVelocity(speed.x, speed.y);
        this.player.body.setSize(20, 20);
        // this.cursor = this.input.keyboard.createCursorKeys();

        // target defintions
        const targets = [{ key: "a" }, { key: "b" }, { key: "c" }];

        // target elements
        targets.forEach((target, i) => {
            this.targets[target.key] = this.physics.add
                .image(
                    ((i + 1) * this.sys.game.canvas.width) /
                        (targets.length + 1),
                    (4 / 5) * this.sys.game.canvas.height,
                    "star"
                )
                .setOrigin(0.5, 1);
            this.targets[target.key].body.setSize(20, 20).allowGravity = false;
        });

        // target collisions
        targets.forEach((target) => {
            this.physics.add.overlap(
                this.targets[target.key],
                this.player,
                () => this.targetHit(target.key),
                null,
                this
            );
        });

        // target particle emitters
        targets.forEach(({ key }) => {
            this.emitter[key] = this.add
                .particles(0, 0, "star", {
                    speed: 100,
                    gravityY: speed.y - 200,
                    scale: 0.4,
                    duration: 100,
                })
                .startFollow(this.targets[key], 0, -32)
                .stop();
        });

        // button controls
        this.controls = this.add
            .text(
                this.sys.game.canvas.width / 2 - 50,
                this.sys.game.canvas.height - 100,
                "< left",
                {
                    fill: "#f4f",
                    backgroundColor: "#ddd",
                    padding: 4,
                }
            )
            .setInteractive()
            .on("pointerdown", () => {
                this.player.setVelocityX(-speed.x);
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            });
        this.controls = this.add
            .text(
                this.sys.game.canvas.width / 2 + 50,
                this.sys.game.canvas.height - 100,
                "right >",
                {
                    fill: "#f4f",
                    backgroundColor: "#ddd",
                    padding: 4,
                }
            )
            .setInteractive()
            .on("pointerdown", () => {
                this.player.setVelocityX(speed.x);
            })
            .on("pointerup", () => {
                this.player.setVelocityX(0);
            });
    }

    update() {
        // keyboard controls
        // const { left, right } = this.cursor;
        // if (left.isDown) this.player.setVelocityX(-speed.x);
        // else if (right.isDown) this.player.setVelocityX(speed.x);
        // else this.player.setVelocityX(0);

        // out of bounds conditions
        if (this.player.y >= this.sys.game.canvas.height) {
            this.player.setY(0);
        }
        if (this.player.x >= this.sys.game.canvas.width)
            this.player.setX(this.sys.game.canvas.width);
        else if (this.player.x <= 0) this.player.setX(0);

        // resize background on canvas size change, css 'cover' behaviour
        // move player and target back into game area
        this.scale.on("resize", (gameSize, xx, xxx, prevWidth) => {
            if (this.sys.game.canvas.height > this.background.height)
                this.background.displayHeight = this.sys.game.canvas.height;
            if (this.sys.game.canvas.width > this.background.width)
                this.background.displayWidth = this.sys.game.canvas.width;
            if (this.player.y >= this.sys.game.canvas.height) {
                this.player.setY(0);
            }

            // player/target on resizing
            if (this.player.x >= this.sys.game.canvas.width) {
                this.player.setX((this.player.x * gameSize.width) / prevWidth);
            }
        });
    }

    targetHit(key) {
        // successful collision effects
        this.audio.hit.play();
        this.emitter[key].start();
        this.audio[`bg${key}`].setVolume(0.7);
        this.audio.hit.on("complete", () => {
            this.audio.hit.detune -= 400;
        });

        // reset player and target
        this.player.setY(0).setVelocityY(0);
        this.targets[key].destroy();

        // update score
        this.score.set.add(key);
        this.score.showScore &&
            this.score.text.setText(
                `Placed: ${this.score.set.keys().reduce((a, b) => a + b)}`
            );
        if (this.score.set.size === 3)
            this.audio.hit.on("complete", () => {
                this.game.destroy(true, true);
            });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#028af8",
    // scene: [Boot, Preloader, MainMenu, Game, GameOver],
    scene: [GameScene],
    physics: {
        default: "arcade",
        arcade: {
            // debug: true,
            gravity: { y: speed.y },
        },
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

