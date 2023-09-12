import { Account, AccountInterface } from "starknet";

export type BurnerStorage = {
    [address: string]: {
        privateKey: string;
        publicKey: string;
        deployTx: string;
        active: boolean;
    };
};

export type Burner = {
    address: string;
    active: boolean;
};

export interface BurnerManagerOptions {
    masterAccount?: AccountInterface | Account;
    accountClassHash: string;
    nodeUrl?: string;
}