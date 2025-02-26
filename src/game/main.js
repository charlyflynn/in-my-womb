// import { Boot } from "./scenes/Boot";
// import { Game } from "./scenes/Game";
// import { GameOver } from "./scenes/GameOver";
// import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
// import { Preloader } from "./scenes/Preloader";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const canvas = { x: 500, y: 500 };
const speed = { x: 300, y: 250 };

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.cursor;
        this.player;
        this.target;
        this.points = 0;
        this.bgMusic;
        this.matchSound;
        this.textScore;
    }

    preload() {
        this.load.image("background", "assets/bg.png");
        this.load.image("star", "assets/star.png");
        this.load.audio("bgMusic", "assets/Kokiri-Forest.mp3");
        this.load.audio("stoneScrape", "assets/stoneScrape.mp3");
    }

    create() {
        // environment
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.bgMusic = this.sound.add("bgMusic");
        this.matchSound = this.sound.add("stoneScrape");
        this.bgMusic.play();

        //ui
        this.textScore = this.add.text(canvas.x - 120, 10, "Score: 0", {
            font: "25px Arial",
            fill: "#000000",
        });

        //player
        this.player = this.physics.add
            .image(canvas.x / 2, 0, "star")
            .setOrigin(0.5, 1)
            .setMaxVelocity(speed.x, speed.y)
            .setCollideWorldBounds(true);

        this.player.body.setSize(20, 20);

        this.cursor = this.input.keyboard.createCursorKeys();

        // target
        this.target = this.physics.add
            .image(this.randomXLoc(), canvas.y, "star")
            .setOrigin(0.5, 1)
            .setCollideWorldBounds(true);
        this.target.body.setSize(20, 20).allowGravity = false;

        // mechanics
        this.physics.add.overlap(
            this.target,
            this.player,
            this.targetHit,
            null,
            this
        );
    }

    update() {
        // controls
        const { left, right } = this.cursor;
        if (left.isDown) this.player.setVelocityX(-speed.x);
        else if (right.isDown) this.player.setVelocityX(speed.x);
        else this.player.setVelocityX(0);
        if (this.player.y >= canvas.y) this.player.setY(0);
    }

    targetHit() {
        this.matchSound.play();
        this.player.setY(0);
        const newX = this.randomXLoc();
        this.target.setX(newX);
        this.points++;
        this.textScore.setText(`Score: ${this.points}`);
    }

    randomXLoc() {
        return Math.floor(Math.random() * canvas.x);
    }
}

const config = {
    type: Phaser.AUTO,
    width: canvas.x,
    height: canvas.y,
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
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

