import { Account, AccountInterface, RpcProvider } from "starknet";

export type BurnerStorage = {
    [address: string]: BurnerRecord;
};

export type BurnerRecord = {
    chainId: string;
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
    masterAccount?: string;
    accountIndex?: number;
};

export interface BurnerManagerOptions {
    masterAccount: Account;
    accountClassHash: string;
    feeTokenAddress: string;
    rpcProvider: RpcProvider;
}

export interface BurnerAccount {
    create: (options?: BurnerCreateOptions) => void;
    list: () => Burner[];
    get: (address: string) => AccountInterface;
    remove: (address: string) => void;
    account: AccountInterface;
    select: (address: string) => void;
    deselect: () => void;
    isDeploying: boolean;
    clear: () => void;
    count: number;
    copyToClipboard: () => Promise<void>;
    applyFromClipboard: () => Promise<void>;
    getActiveAccount?: () => Account | null;
    generateAddressFromSeed?: (options?: BurnerCreateOptions) => string;
}

export interface BurnerCreateOptions {
    secret?: string;
    index?: number;
    metadata?: any;
    prefundedAmount?: string;
}

export interface BurnerKeys {
    privateKey: string;
    publicKey: string;
    address: string;
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
