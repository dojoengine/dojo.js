import { useEffect } from "react";
import { useNetworkLayer } from "./hooks/useNetworkLayer";
import { PhaserLayer } from "./phaser/phaserLayer";
import { store } from "./store/store";
import { UI } from "./ui";
import { DojoProvider } from "./DojoContext";

function App() {
    const networkLayer = useNetworkLayer();

    useEffect(() => {
        if (!networkLayer) return;

        console.log("Setting network layer");

        store.setState({ networkLayer });
    }, [networkLayer]);

    return (
        <div>
            <PhaserLayer networkLayer={networkLayer} />

            <DojoProvider>
                <UI />
            </DojoProvider>
        </div>
    );
}

export default App;
