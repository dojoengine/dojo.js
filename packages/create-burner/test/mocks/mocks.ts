import {
    KATANA_PREFUNDED_ADDRESS,
    KATANA_PREFUNDED_PRIVATE_KEY,
    LOCAL_KATANA,
} from "@dojoengine/core";
import { Account, RpcProvider } from "starknet";
import { BurnerConnector } from "../../src/connectors/burner";
import { BurnerManager } from "../../src/manager/burnerManager";

export const getBurnerManager = (): BurnerManager => {
    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            new RpcProvider({ nodeUrl: LOCAL_KATANA }),
            KATANA_PREFUNDED_ADDRESS,
            KATANA_PREFUNDED_PRIVATE_KEY
        ),
        accountClassHash: KATANA_PREFUNDED_PRIVATE_KEY,
        rpcProvider: new RpcProvider({ nodeUrl: LOCAL_KATANA }),
        feeTokenAddress:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH token address on testnet
    });
    return burnerManager;
};

export const getBurnerConnector = (): BurnerConnector => {
    const burnerObj = new BurnerConnector(
        {
            id: "Burner Account",
            name: "Burner Connector",
            icon: {
                dark: "my-dark-icon",
                light: "my-light-icon",
            },
        },
        new Account(
            new RpcProvider({ nodeUrl: LOCAL_KATANA }),
            KATANA_PREFUNDED_ADDRESS,
            KATANA_PREFUNDED_PRIVATE_KEY,
            "1"
        )
    );
    return burnerObj;
};
