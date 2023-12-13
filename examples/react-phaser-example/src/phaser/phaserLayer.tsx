import { useEffect } from "react";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { store, useUIStore } from "../store";
import { usePhaserLayer } from "../ui/hooks/usePhaserLayer";

type Props = {
    networkLayer: NetworkLayer | null;
};

export const PhaserLayer = ({ networkLayer }: Props) => {
    const loggedIn = useUIStore((state: any) => state.loggedIn);
    const { phaserLayer, ref } = usePhaserLayer({ networkLayer });

    useEffect(() => {
        if (phaserLayer) {
            store.setState({ phaserLayer });

            console.log("Setting phaser layer");
        }
    }, [phaserLayer, loggedIn]);

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
            }}
        />
    );
};
