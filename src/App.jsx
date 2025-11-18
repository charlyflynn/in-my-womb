import { useRef } from 'react';

import { PhaserGame } from './game/PhaserGame';

function App ()
{
    const phaserRef = useRef();

    return (
        <div id="app">
            <iframe id="success" height="100%" src="https://elsas.os.fan/landing-page-for-game" style={{display: "none", zIndex: "-1", border: "none", position: "absolute", aspectRatio: "9/16", backgroundColor: "white", margin: "auto"}} />
            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
