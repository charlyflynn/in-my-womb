import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor() {
        super("Preloader");
        this.background;
        this.startButton;
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };
        if (dims.h > this.background.height)
            this.background.displayHeight = dims.h;
        if (dims.w > this.background.width)
            this.background.displayWidth = dims.w;

        //  A simple progress bar. This is the outline of the bar.
        this.add
            .rectangle(dims.w / 2, dims.h / 2, 468, 32)
            .setStrokeStyle(1, 0xcccccc);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(
            dims.w / 2 - 230,
            dims.h / 2,
            4,
            28,
            0xcccccc
        );

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });

        this.load.on("complete", () => {
            this.startButton = this.add
                .text(
                    this.sys.game.canvas.width / 2,
                    this.sys.game.canvas.height / 2 + 100,
                    "BEGIN",
                    {
                        fill: "#333333",
                        backgroundColor: "#cccccc",
                        padding: 24,
                        fontSize: 64,
                        fontFamily: "Arial Black",
                    }
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerover", () => {
                    this.startButton.setStyle({ backgroundColor: "#cccccc" });
                })
                .on("pointerout", () => {
                    this.startButton.setStyle({ backgroundColor: "#cccccc" });
                })
                .on("pointerup", () => {
                    this.cameras.main
                        .fadeOut(600, 0, 0, 0)
                        .on("camerafadeoutcomplete", () =>
                            this.scene.start("Aurosymbology")
                        );
                });
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");
        this.load.image("gem", "gem.png");
        this.load.image("wombStone", "womb-stone.png");
        this.load.image("wombGems", "womb-gems.png");
        this.load.image("womb0", "womb-0.png");
        this.load.image("wombBrackets", "womb-brackets.png");

        this.load.audio("hit", "stoneScrape.mp3");
        this.load.audio("wombBass", "womb-6-bass.mp3");
        this.load.audio("wombVox", "womb-1-vox.mp3");
        this.load.audio("wombStrings", "womb-2-strings.mp3");
        this.load.audio("wombChords", "womb-3-guitar+piano.mp3");
        this.load.audio("wombHiPerc", "womb-4-claps+shakers.mp3");
        this.load.audio("wombLoPerc", "womb-5-kick+congas.mp3");
        this.load.audio("grunts", "gruntBirthdayParty.mp3");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
    }
}

