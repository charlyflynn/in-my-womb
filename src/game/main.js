// import { Boot } from "./scenes/Boot";
// import { Game } from "./scenes/Game";
// import { GameOver } from "./scenes/GameOver";
// import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
// import { Preloader } from "./scenes/Preloader";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const speed = { x: 300, y: 200 };

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.cursor;
        this.player;
        this.target;
        this.points = 0;
        this.bgMusic;
        this.bgMusic1;
        this.bgMusic2;
        this.matchSound;
        this.textScore;
        this.emitter;
        this.background;
        this.currentTarget = { x: 0.5, y: 1 };
    }

    preload() {
        this.load.image("background", "assets/bg.png");
        this.load.image("star", "assets/star.png");
        this.load.audio("bgMusic", "assets/InMyRoom.mp3");
        this.load.audio("bgMusic2", "assets/InMyRoom.mp3");
        this.load.audio("bgMusic3", "assets/InMyRoom.mp3");
        this.load.audio("stoneScrape", "assets/stoneScrape.mp3");
    }

    resizeBg() {
        if (this.sys.game.canvas.height > this.background.height)
            this.background.displayHeight = this.sys.game.canvas.height;
        if (this.sys.game.canvas.width > this.background.width)
            this.background.displayWidth = this.sys.game.canvas.width;
    }

    create() {
        // environment
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.resizeBg();

        this.bgMusic = this.sound.add("bgMusic");
        this.bgMusic2 = this.sound.add("bgMusic2");
        this.bgMusic3 = this.sound.add("bgMusic3");
        this.matchSound = this.sound.add("stoneScrape");
        // this.bgMusic.play();
        // this.bgMusic2.play();
        // this.bgMusic3.play();

        //ui
        this.textScore = this.add.text(
            this.sys.game.canvas.width - 120,
            10,
            "Score: 0",
            {
                font: "25px Arial",
                fill: "#000000",
            }
        );

        //player
        this.player = this.physics.add
            .image(this.sys.game.canvas.width / 2, 0, "star")
            .setOrigin(0.5, 1)
            .setMaxVelocity(speed.x, speed.y);
        // .setCollideWorldBounds(true, true, false);

        this.player.body.setSize(20, 20);

        this.cursor = this.input.keyboard.createCursorKeys();

        // target
        this.target = this.physics.add
            .image(
                this.currentTarget.x * this.sys.game.canvas.width,
                this.sys.game.canvas.height,
                "star"
            )
            .setOrigin(0.5, 1);
        // .setCollideWorldBounds(true);
        this.target.body.setSize(20, 20).allowGravity = false;

        // collision physics
        this.physics.add.overlap(
            this.target,
            this.player,
            this.targetHit,
            null,
            this
        );

        // particle emitter
        this.emitter = this.add
            .particles(0, 0, "star", {
                speed: 100,
                gravityY: speed.y - 200,
                scale: 0.4,
                duration: 100,
            })
            .startFollow(
                this.target,
                this.target.width / 2,
                this.target.height / 2
            );
    }

    update() {
        // controls
        const { left, right } = this.cursor;
        if (left.isDown) this.player.setVelocityX(-speed.x);
        else if (right.isDown) this.player.setVelocityX(speed.x);
        else this.player.setVelocityX(0);
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
            this.target
                .setY(gameSize.height)
                .setX(Math.floor(this.currentTarget.x * gameSize.width));
        });
    }

    targetHit() {
        const newTarget = Math.random();
        this.currentTarget.x = newTarget;
        this.matchSound.play();
        this.player.setY(0);
        this.target.setX(Math.floor(newTarget * this.sys.game.canvas.width));
        this.points++;
        this.textScore.setText(`Score: ${this.points}`);
        this.emitter.start();
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
            debug: true,
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

