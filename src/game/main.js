import Phaser from "phaser";
import Boot from "./scenes/Boot";
import PreLoader from "./scenes/Preloader";
import AuroSymbology from "./scenes/AuroSymbology";
import WombTetris from "./scenes/WombTetris";
import LuteMan from "./scenes/LuteMan";
import Fin from "./scenes/Fin";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#000000",
    scene: [Boot, PreLoader, AuroSymbology, WombTetris, LuteMan, Fin],
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 300 },
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1080,
        height: 1920,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

