import { useRef } from 'react';

import { PhaserGame } from './game/PhaserGame';

function App ()
{
    const phaserRef = useRef();

    return (
        <div id="app">
            <iframe id="success" height="100%" scrolling="no" src="https://elsas.os.fan/landing-page-for-game" style={{zIndex: "-1", border: "none", position: "absolute", aspectRatio: "9/16", backgroundColor: "white"}} />
            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
