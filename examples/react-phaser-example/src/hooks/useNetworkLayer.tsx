import { useEffect, useMemo } from "react";
import { createNetworkLayer } from "../dojo/createNetworkLayer";
import { usePromiseValue } from "./usePromiseValue";
import { useUIStore } from "../store/store";

// TODO: Current hack to reload phaser layer
export const useNetworkLayer = () => {
    const loggedIn = useUIStore((state: any) => state.loggedIn);
    const networkLayerPromise = useMemo(() => {
        return createNetworkLayer();
    }, [loggedIn]);

    useEffect(() => {
        return () => {
            networkLayerPromise.then((networkLayer) =>
                networkLayer.world.dispose()
            );
        };
    }, [networkLayerPromise]);

    return usePromiseValue(networkLayerPromise);
};
