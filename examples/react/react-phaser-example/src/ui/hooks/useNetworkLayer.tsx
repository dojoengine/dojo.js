import { useEffect, useMemo } from "react";
import { createNetworkLayer } from "../../dojo/createNetworkLayer";
import { usePromiseValue } from "./usePromiseValue";

export const useNetworkLayer = () => {
    const networkLayerPromise = useMemo(() => {
        return createNetworkLayer();
    }, []);

    useEffect(() => {
        return () => {
            networkLayerPromise.then((networkLayer) =>
                networkLayer.world.dispose()
            );
        };
    }, [networkLayerPromise]);

    return usePromiseValue(networkLayerPromise);
};
