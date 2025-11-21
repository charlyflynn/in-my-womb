import { useRef } from "react";

import { PhaserGame } from "./game/PhaserGame";

function App() {
    const phaserRef = useRef();

    return (
        <div id="app">
            {/* <iframe id="success" height="100%" src="https://elsas.os.fan/in-my-womb-pre-save--download" style={{display: "none", zIndex: "-1", border: "none 0px", position: "absolute", backgroundColor: "white", margin: "auto"}} /> */}
            {/* <iframe id="success" height="100%" width="100%" src="https://elsas.os.fan/in-my-womb-pre-save--download" style={{ zIndex: "100", border: "none 0px", aspectRation: "9/16", position: "absolute", backgroundColor: "white", margin: "auto"}} /> */}
            <div
                id="success"
                style={{
                    zIndex: -1,
                    height: "100%",
                    aspectRatio: "9/16",
                    position: "absolute",
                    background: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
                className="sonikit-patch"
                data-id="6920b83c348bc9b1b5fd3dbd"
            ></div>
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;

