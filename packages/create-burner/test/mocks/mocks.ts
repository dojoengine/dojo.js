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
    });
    return burnerManager;
};

export const getBurnerConnector = (): BurnerConnector => {
    const publicKey = KATANA_PREFUNDED_ADDRESS;
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
            publicKey,
            KATANA_PREFUNDED_PRIVATE_KEY
        )
    );
    return burnerObj;
};
