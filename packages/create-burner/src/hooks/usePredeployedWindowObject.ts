import { useEffect, useState } from "react";
import { StarknetWindowObject } from "get-starknet-core";

import { DojoPredeployedStarknetWindowObject, PredeployedManager } from "..";

export const usePredeployedWindowObject = (
    predeployedManager?: PredeployedManager
) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const initAsync = async () => {
            if (!predeployedManager) {
                setIsInitialized(true);
                return;
            }

            try {
                if (!predeployedManager.isInitialized) {
                    await predeployedManager.init();
                }

                const starknetWindowObject =
                    new DojoPredeployedStarknetWindowObject(predeployedManager);

                const key = `starknet_${starknetWindowObject.id}`;
                (window as any)[key as string] =
                    starknetWindowObject as StarknetWindowObject;

                setIsInitialized(true);
            } catch (e: any) {
                console.log(e);
                setIsError(true);
                setError("failed to initialize predeployedManager");
            }
        };

        initAsync();
    }, [predeployedManager]);

    return { isInitialized, isError, error };
};
