import { StarknetWindowObject } from "get-starknet-core";
import { useEffect } from "react";
import { DojoBurnerStarknetWindowObject } from "..";

export const useBurnerWindowObject = () => {
    useEffect(() => {
        const starknet_dojoburner = new DojoBurnerStarknetWindowObject();
        window.starknet_dojoburner =
            starknet_dojoburner as StarknetWindowObject;
    }, []);

    return {};
};
