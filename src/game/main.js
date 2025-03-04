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
        this.players = {};
        this.playerShadow = {};
        this.targets = {};
        this.audio = {};
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
            { key: "wombBass", tint: 0xffffff },
            { key: "wombStrings", tint: 0xff0000 },
            { key: "wombHiPerc", tint: 0xff00ff },
            { key: "wombLoPerc", tint: 0x00ffff },
            { key: "wombChords", tint: 0x00ff00 },
        ];
        this.colliders = {};
    }

    preload() {
        this.load.plugin(
            "rexsoundfadeplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsoundfadeplugin.min.js",
            true
        );
        this.load.image("background", "assets/bg.png");
        this.load.image("gem", "assets/gem.png");
        // this.load.audio("bgMusic", "assets/InMyRoom.mp3");
        this.load.audio("hit", "assets/gruntBirthdayParty.mp3");
        this.load.audio("wombBass", "assets/womb-6-bass.mp3");
        // this.load.audio("wombVox", "assets/womb-1-vox.mp3");
        this.load.audio("wombStrings", "assets/womb-2-strings.mp3");
        this.load.audio("wombChords", "assets/womb-3-guitar+piano.mp3");
        this.load.audio("wombHiPerc", "assets/womb-4-claps+shakers.mp3");
        this.load.audio("wombLoPerc", "assets/womb-5-kick+congas.mp3");
    }

    create() {
        // environment
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.resizeBg();

        this.elements.slice(1).forEach(({ key }) => {
            this.score.remaining.add(key);
        });

        const audioConfig = { loop: true, volume: 0 };
        this.elements.forEach(({ key }) => {
            this.audio[key] = this.sound.add(key, audioConfig);
        });
        this.audio.hit = this.sound.add("hit", {
            volume: 0.1,
        });

        this.scene.pause();
        this.sound.pauseOnBlur = false;
        this.sound.pauseAll();

        // set up audio fade-in tweens
        this.elements.forEach(({ key }, i) => {
            this.tweens[key] = this.tweens.add({
                targets: this.audio[key],
                volume: 0.7,
                duration: i > 0 ? 1500 : 0,
            });
            if (i > 0) this.tweens[key].pause();
        });

        // ui
        this.score.text = this.score.showScore
            ? this.add.text(0, 10, this.updateScoreText(), {
                  font: "25px Arial",
                  fill: "#000000",
              })
            : null;

        //player element
        this.addPlayers();
        this.addTargets();
        this.addCollisions();
        this.addParticles();
        const playerKey = this.randomPlayerKey();
        this.addControls(playerKey);
        this.setCurrentPlayer(playerKey);
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

    setCurrentPlayer(key) {
        this.player = this.players[key];
    }

    update() {
        // keyboard controls
        // const { left, right } = this.cursor;
        // if (left.isDown) this.player.setVelocityX(-speed.x);
        // else if (right.isDown) this.player.setVelocityX(speed.x);
        // else this.player.setVelocityX(0);
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

    resizeBg() {
        // image css 'cover' behaviour
        if (this.sys.game.canvas.height > this.background.height)
            this.background.displayHeight = this.sys.game.canvas.height;
        if (this.sys.game.canvas.width > this.background.width)
            this.background.displayWidth = this.sys.game.canvas.width;
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
                () => this.targetHit(key),
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

    addControls(key) {
        // this.cursor = this.input.keyboard.createCursorKeys();
        this.players[key].body.allowGravity = true;
        // button controls
        this.controls = this.add
            .text(
                this.sys.game.canvas.width / 2 - 100,
                this.sys.game.canvas.height - 100,
                "< left",
                {
                    fill: "#f4f",
                    backgroundColor: "#ddd",
                    padding: 4,
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.players[key].setVelocityX(-speed.x);
            })
            .on("pointerup", () => {
                this.players[key].setVelocityX(0);
            });
        this.controls = this.add
            .text(
                this.sys.game.canvas.width / 2,
                this.sys.game.canvas.height - 100,
                "rotate",
                {
                    fill: "#f4f",
                    backgroundColor: "#ddd",
                    padding: 4,
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.players[key].setAngle(this.players[key].angle + 90);
            });
        this.controls = this.add
            .text(
                this.sys.game.canvas.width / 2 + 100,
                this.sys.game.canvas.height - 100,
                "right >",
                {
                    fill: "#f4f",
                    backgroundColor: "#ddd",
                    padding: 4,
                }
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.players[key].setVelocityX(speed.x);
            })
            .on("pointerup", () => {
                this.players[key].setVelocityX(0);
            });
    }

    addPlayers() {
        this.elements.slice(1).forEach(({ key, tint }) => {
            this.players[key] = this.physics.add
                .image(this.sys.game.canvas.width / 2, -64, "gem")
                .setOrigin(0.5, 0.5)
                .setMaxVelocity(speed.x, speed.y)
                .setDisplaySize(100, 100)
                .setDepth(2)
                .setAngle(Phaser.Math.RND.integerInRange(0, 3) * 90)
                .setTint(tint);
            this.players[key].body.setSize(200, 200).allowGravity = false;
            this.playerShadow[key] = this.players[key].postFX.addShadow(
                -10,
                10,
                0.006,
                0.7,
                0x333333,
                2
            );
            this.players;
        });
    }

    addTargets() {
        // target defintions
        const targets = this.elements.slice(1);

        // target elements
        targets.forEach(({ key, tint }, i) => {
            this.targets[key] = this.physics.add
                .image(
                    ((i + 1) * this.sys.game.canvas.width) /
                        (targets.length + 1),
                    (4 / 5) * this.sys.game.canvas.height,
                    "gem"
                )
                .setOrigin(0.5, 0.5)
                .setDisplaySize(80, 80)
                .setAngle(Phaser.Math.RND.integerInRange(0, 3) * 90)
                .setTint(tint);
            this.targets[key].body.setSize(200, 200).allowGravity = false;
            this.targets[key].postFX.addShadow(1, 1, 0.006, 0.7, 0x333333, 2);
        });
    }

    targetHit(key) {
        // succesful hit with correct rotation
        if (this.players[key].rotation === this.targets[key].rotation) {
            this.audio.hit.play();
            this.emitter[key].start();

            // allow animation to play properly
            this.physics.world.removeCollider(this.colliders[key]);
            this.players[key].body.allowGravity = false;
            this.players[key].setVelocityY(0);
            this.players[key].setGravityY(0);

            this.tweens.playerShadow = this.tweens.add({
                targets: this.playerShadow[key],
                x: 1,
                y: 1,
                duration: 2000,
            });
            this.tweens.playerSize = this.tweens.add({
                targets: this.players[key],
                displayHeight: 80,
                displayWidth: 80,
                x: this.targets[key].x,
                y: this.targets[key].y,
                duration: 2000,
            });

            this.tweens.playerShadow.on("complete", () => {
                this.targets[key].destroy();
                this.players[key].destroy();

                if (this.score.remaining.size > 0) {
                    const newPlayerKey = this.randomPlayerKey();
                    this.setCurrentPlayer(newPlayerKey);
                    this.addControls(newPlayerKey);
                } else this.game.destroy(true, true);
            });

            // update score
            this.score.matched.add(key);
            this.score.remaining.delete(key);
            this.score.showScore &&
                this.score.text.setText(this.updateScoreText());
        }
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
            debug: false,
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

