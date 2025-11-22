import { Scene } from "phaser";

const preProd = true;
const levelKeys = ["AuroSymbology", "WombTetris", "LuteMan", "Fin"];
export default class Preloader extends Scene {
    constructor() {
        super("Preloader");
        this.levelButtons = {};
        this.startSequence;
    }

    startSequence() {}
    init() {
        this.add.image(0, 0, "bgWelcome").setOrigin(0, 0);

        const dims = {
            h: this.sys.game.canvas.height,
            w: this.sys.game.canvas.width,
        };

        //  A simple progress bar. This is the outline of the bar.
        this.add
            .rectangle(dims.w / 2, 1590, 468, 14)
            .setStrokeStyle(1, 0x333333);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(dims.w / 2 - 230, 1590, 4, 10, 0x333333);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });

        this.load.on("complete", () => {
            this.add
                .image(0, 0, "bgWelcomeRock")
                .setOrigin(0, 0)
                .setInteractive({ cursor: "pointer", pixelPerfect: true })
                .on("pointerup", () => {
                    this.cameras.main
                        .fadeOut(1000, 0, 0, 0)
                        .on("camerafadeoutcomplete", () =>
                            this.scene.start("AuroSymbology")
                        );
                });
            this.add
                .text(
                    dims.w / 2,
                    275,
                    "resolve the next 3 sonic puzzles\nto receive a free song by elsas",
                    {
                        fontFamily: "roobert",
                        fontSize: 36,
                        align: "center",
                        color: "#333333",
                        lineSpacing: 15,
                        letterSpacing: 1.2,
                        strokeThickness: 2,
                        stroke: "#333333",
                    }
                )
                .setOrigin(0.5, 0.5);
            this.add
                .text(dims.w / 2, 1375, "↑", {
                    fontFamily: "nobody",
                    fontSize: 78,
                    align: "center",
                    color: "#333333",
                    lineSpacing: 30,
                    letterSpacing: 1.5,
                    fontStyle: "bold",
                })
                .setOrigin(0.5, 0.5);
            this.add
                .text(
                    dims.w / 2,
                    1460,
                    "\nclick on the rock to begin the game",
                    {
                        fontFamily: "nobody",
                        fontSize: 26,
                        align: "center",
                        color: "#333333",
                        lineSpacing: 30,
                        letterSpacing: 1.5,
                        fontStyle: "bold",
                    }
                )
                .setOrigin(0.5, 0.5);
            this.add
                .text(
                    dims.w / 2,
                    1715,
                    "please make sure your phone is unmuted\nwearing headphones is recommended",
                    {
                        fontFamily: "roobert",
                        fontSize: 30,
                        align: "center",
                        color: "#e34727",
                        lineSpacing: 15,
                        letterSpacing: 1.2,
                    }
                )
                .setOrigin(0.5, 0.5)
                .setDepth(100);
        });

        // level skips for dev
        preProd &&
            levelKeys.forEach((levelKey, i) => {
                this.levelButtons[levelKey] = this.add
                    .text(25, 35 + i * 56, `L${i + 1}: ${levelKey}`, {
                        fontFamily: "roobert",
                        fill: "#cccccc",
                        backgroundColor: "#333333",
                        padding: 10,
                        fontSize: 28,
                        align: "left",
                    })
                    .setOrigin(0, 0.5)
                    .setInteractive({ useHandCursor: true })
                    .on("pointerup", () => {
                        this.cameras.main
                            .fadeOut(1000, 0, 0, 0)
                            .on("camerafadeoutcomplete", () =>
                                this.scene.start(levelKey)
                            );
                    });
            });
        this.cameras.main.fadeIn(1000);
    }

    preload() {
        const loadFont = (name, url) => {
            var newFont = new FontFace(name, `url(${url})`);
            newFont
                .load()
                .then(function (loaded) {
                    document.fonts.add(loaded);
                })
                .catch(function (error) {
                    return error;
                });
        };
        loadFont("nobody", "/assets/init/nobody.otf");
        loadFont("roobert", "/assets/init/roobert.otf");

        this.load.setPath("./assets/init");

        this.load.image("questionMark", "questionMark.png");
        this.load.audio("stonescrape", "stonescrape.mp3");
        this.load.audio("unselect", "unselect.mp3");

        // level 1
        this.load.setPath("assets/l1");

        this.load.image("bg", "bg.png");
        this.load.image("keyboard", "keyboard.png");
        this.load.image("altavoz-in", "altavoz-in.png");
        this.load.image("altavoz-out", "altavoz-out.png");
        this.load.image("splinter-in", "splinter-in.png");
        this.load.image("splinter-out", "splinter-out.png");
        this.load.image("womb-in", "womb-in.png");
        this.load.image("womb-out", "womb-out.png");
        this.load.image("finalise-in", "finalise-in.png");
        this.load.image("finalise-out", "finalise-out.png");
        this.load.image("nino-in", "nino-in.png");
        this.load.image("nino-out", "nino-out.png");
        this.load.image("fireworm-in", "fireworm-in.png");
        this.load.image("fireworm-out", "fireworm-out.png");

        this.load.audio("splinter", "splinter.mp3");
        this.load.audio("womb", "womb.mp3");
        this.load.audio("finalise", "finalise.mp3");
        this.load.audio("nino", "nino.mp3");
        this.load.audio("fireworm", "fireworm.mp3");

        // level 2
        this.load.setPath("assets/l2");

        this.load.image("arrowL", "arrowL.png");
        this.load.image("arrowR", "arrowR.png");
        this.load.image("rotacion", "rotacion.png");
        this.load.image("gem", "gem.png");
        this.load.image("womb-piedra", "womb-piedra.png");
        this.load.image("womb-gemas", "womb-gemas.png");
        this.load.image("womb-0", "womb-0.png");
        this.load.image("womb-parentesis-l", "womb-parentesis-l.png");
        this.load.image("womb-parentesis-r", "womb-parentesis-r.png");

        this.load.audio("wombVox", "womb-1-vox.mp3");
        this.load.audio("wombStrings", "womb-2-strings.mp3");
        this.load.audio("wombChords", "womb-3-guitar+piano.mp3");
        this.load.audio("wombHiPerc", "womb-4-claps+shakers.mp3");
        this.load.audio("wombLoPerc", "womb-5-kick+congas.mp3");
        this.load.audio("wombBass", "womb-6-bass.mp3");

        // level 3
        this.load.setPath("assets/l3");

        this.load.image("backboard", "backboard.png");
        this.load.image("moneda", "moneda.png");
        this.load.image("bgPlates", "bgPlates.png");
        this.load.image("bgFin", "bgFin.jpg");

        this.load.image("luteManClosed", "luteManClosed.png");
        this.load.image("luteManOpen", "luteManOpen.png");

        this.load.audio("gruntBirthdayParty", "gruntBirthdayParty.mp3");
        this.load.audio("eRhodes", "E rhodes.mp3");
        this.load.audio("fRhodes", "F rhodes.mp3");
        this.load.audio("gRhodes", "G rhodes.mp3");
        this.load.audio("clave", "clave.mp3");
        this.load.setPath("assets/l3/sounds");
        const notes = ["e", "f", "g"];
        const syllables = ["in", "my", "wo", "omb"];
        notes.forEach((note) => {
            syllables.forEach((syllable) => {
                this.load.audio(
                    `${syllable}-${note}`,
                    `${syllable}-${note}.mp3`
                );
            });
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.sound.pauseOnBlur = false;
    }
}

