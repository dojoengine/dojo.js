import { BurnerManager } from "../../src/manager/burnerManager";
import { Account, RpcProvider } from "starknet";
import { BurnerConnector } from "../../src/connectors/burner";

export const getBurnerManager = (): BurnerManager => {
    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            new RpcProvider({ nodeUrl: "http://localhost:5050" }),
            "0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
            "0x1800000000300000180000000000030000000000003006001800006600"
        ),
        accountClassHash:
            "0x1800000000300000180000000000030000000000003006001800006600",
        rpcProvider: new RpcProvider({ nodeUrl: "http://localhost:5050" }),
    });
    return burnerManager;
};

export const getBurnerConnector = (): BurnerConnector => {
    const publicKey =
        "0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973";
    const burnerObj = new BurnerConnector(
        {},
        new Account(
            new RpcProvider({ nodeUrl: "http://localhost:5050" }),
            publicKey,
            "0x1800000000300000180000000000030000000000003006001800006600"
        )
    );
    return burnerObj;
};
