import { StarknetWindowObject } from "get-starknet-core";
import { useEffect } from "react";
import { DojoPredeployedStarknetWindowObject } from "..";

export const usePredeployedWindowObject = () => {
    useEffect(() => {
        const starknet_dojopredeployed =
            new DojoPredeployedStarknetWindowObject();
        window.starknet_dojopredeployed =
            starknet_dojopredeployed as StarknetWindowObject;
    }, []);

    return {};
};
