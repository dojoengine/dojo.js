import { StarknetWindowObject } from "get-starknet-core";
import { useEffect, useState } from "react";
import { BurnerManager, DojoBurnerStarknetWindowObject } from "..";

export const useBurnerWindowObject = (burnerManager?: BurnerManager) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initAsync = async () => {
            if (!burnerManager) {
                setIsInitialized(true);
                return;
            }

            await burnerManager.init();

            const starknetWindowObject = new DojoBurnerStarknetWindowObject(
                burnerManager
            );
            const key = `starknet_${starknetWindowObject.id}`;

            (window as any)[key] = starknetWindowObject as StarknetWindowObject;

            setIsInitialized(true);
        };

        initAsync();
    }, [burnerManager]);

    return { isInitialized };
};
