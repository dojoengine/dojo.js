import { Account, RpcProvider, AccountInterface } from "starknet";

export type BurnerStorage = {
    [address: string]: BurnerRecord;
};

export type BurnerRecord = {
    privateKey: string;
    publicKey: string;
    deployTx: string;
    masterAccount: string;
    active: boolean;
    accountIndex?: number;
    metadata?: any;
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
    create: (options?: BurnerCreateOptions) => void;
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
    generateAddressFromSeed: (options?: BurnerCreateOptions) => string;
}

export interface BurnerCreateOptions {
    secret: string;
    index: number;
    metadata?: any;
}

export interface BurnerKeys {
    privateKey: string;
    publicKey: string;
    address: string;
}
