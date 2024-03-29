import { StarknetWindowObject } from "get-starknet-core";
import { useEffect, useState } from "react";
import { DojoPredeployedStarknetWindowObject, PredeployedManager } from "..";

export const usePredeployedWindowObject = (
    predeployedManager?: PredeployedManager
) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initAsync = async () => {
            if (!predeployedManager) {
                setIsInitialized(true);
                return;
            }

            await predeployedManager.init();

            const starknetWindowObject =
                new DojoPredeployedStarknetWindowObject(predeployedManager);
            const key = `starknet_${starknetWindowObject.id}`;

            (window as any)[key as string] =
                starknetWindowObject as StarknetWindowObject;

            setIsInitialized(true);
        };

        initAsync();
    }, [predeployedManager]);

    return { isInitialized };
};
