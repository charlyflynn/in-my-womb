import { Scene } from "phaser";

export default class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image("bg", "assets/init/bg.png");
        this.load.image("bgWelcome", "assets/init/bgWelcome.jpg");
        this.load.image("bgWelcomeRock", "assets/init/bgWelcomeRock.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}

