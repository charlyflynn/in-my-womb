import { useRef } from 'react';

import { PhaserGame } from './game/PhaserGame';

function App ()
{
    const phaserRef = useRef();

    return (
        <div id="app">
            {/* <iframe id="success" height="100%" width="100%" src="https://elsas.os.fan/in-my-womb-pre-save--download" style={{display: "none", zIndex: "-1", border: "none 0px", position: "absolute", backgroundColor: "white", margin: "auto"}} /> */}
            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
