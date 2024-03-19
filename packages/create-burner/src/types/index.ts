import { Account, RpcProvider, AccountInterface } from "starknet";

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
    masterAccount: AccountInterface;
    accountClassHash: string;
    rpcProvider: RpcProvider;
}

export interface BurnerAccount {
    create: () => void;
    list: () => Burner[];
    get: (address: string) => AccountInterface;
    account: AccountInterface;
    select: (address: string) => void;
    isDeploying: boolean;
    clear: () => void;
    count: number;
    copyToClipboard: () => Promise<void>;
    applyFromClipboard: () => Promise<void>;
    getActiveAccount?: () => Account | null;
}
