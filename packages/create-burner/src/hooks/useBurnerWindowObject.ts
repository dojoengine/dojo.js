import { useEffect, useState } from "react";
import { StarknetWindowObject } from "@starknet-io/get-starknet-core";

import { BurnerManager, DojoBurnerStarknetWindowObject } from "..";

export const useBurnerWindowObject = (burnerManager?: BurnerManager) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const initAsync = async () => {
            if (!burnerManager) {
                setIsInitialized(true);
                return;
            }

            try {
                if (!burnerManager.isInitialized) {
                    await burnerManager.init();
                }

                const starknetWindowObject = new DojoBurnerStarknetWindowObject(
                    burnerManager
                );

                const key = `starknet_${starknetWindowObject.id}`;
                (window as any)[key] =
                    starknetWindowObject as StarknetWindowObject;

                setIsInitialized(true);
            } catch (e: any) {
                console.log(e);
                setIsError(true);
                setError("failed to initialize burnerManager");
            }
        };

        initAsync();
    }, [burnerManager]);

    return { isInitialized, isError, error };
};
