import { Account, AccountInterface, RpcProvider } from "starknet";

export type BurnerStorage = {
    [address: string]: {
        chainId: string;
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
    account: Account;
    select: (address: string) => void;
    isDeploying: boolean;
    clear: () => void;
    count: number;
    copyToClipboard: () => Promise<void>;
    applyFromClipboard: () => Promise<void>;
    getActiveAccount?: () => Account | null;
}

export type Predeployed = Burner & { name?: string };

export type PredeployedStorage = {
    [address: string]: PredeployedAccount;
};

export interface PredeployedManagerOptions {
    rpcProvider: RpcProvider;
    predeployedAccounts: PredeployedAccount[];
}

export type PredeployedAccount = {
    name?: string;
    address: string;
    privateKey: string;
    active: boolean;
};
