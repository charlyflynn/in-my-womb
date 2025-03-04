import Phaser from "phaser";
import Boot from "./scenes/Boot";
import PreLoader from "./scenes/Preloader";
// import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
// import { MainMenu } from "./scenes/MainMenu";
import WombTetris from "./scenes/WombTetris";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Boot, PreLoader, WombTetris, GameOver],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 300 },
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

