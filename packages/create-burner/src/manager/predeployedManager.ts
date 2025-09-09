import { Account, RpcProvider, shortString } from "starknet";
import { newAccount } from ".";

import {
    Predeployed,
    PredeployedAccount,
    PredeployedManagerOptions,
    PredeployedStorage,
} from "../types";
import Storage from "../utils/storage";

/**
 * A class to manage Predeployed accounts.
 * This class exposes methods and properties to manage Predeployed accounts.
 * This class uses LocalStorage to store the Predeployed accounts.
 *
 * @example
 *
 * ```ts
 * export const createPredeployed = async () => {
 *     const rpcProvider = new RpcProvider({
 *          nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
 *    });
 *
 *   const predeployedManager = new PredeployedManager({
 *      rpcProvider,
 *      predeployedAccounts: [
 *       {
 *           name: "Deployer",
 *           address: "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03",
 *           privateKey: "0x1800000000300000180000000000030000000000003006001800006600",
 *           active: true
 *       },
 *       {
 *           name: "Treasury",
 *           address: "0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a",
 *           privateKey: "0x14d6672dcb4b77ca36a887e9a11cd9d637d5012468175829e9c6e770c61642",
 *           active: false
 *       }
 *      ]
 *   });
 *
 *
 *  await predeployedManager.init();
 *
 *  return predeployedManager
 * };
 *
 *
 */

export class PredeployedManager {
    public provider: RpcProvider;
    public chainId: string = "";

    public account: Account | null = null;
    public predeployedAccounts: PredeployedAccount[] = [];
    public isInitialized: boolean = false;

    constructor({
        rpcProvider,
        predeployedAccounts,
    }: PredeployedManagerOptions) {
        this.provider = rpcProvider;
        this.predeployedAccounts = predeployedAccounts;
    }

    private getStorageKey(): string {
        return `predeployed_${this.chainId}`;
    }

    private getStorage(): PredeployedStorage {
        return Storage.get(this.getStorageKey()) || {};
    }

    private setActiveAccount(storage: PredeployedStorage): void {
        for (let address in storage) {
            if (storage[address].active) {
                this.account = newAccount(
                    this.provider,
                    address,
                    storage[address].privateKey,
                    "1"
                );
                return;
            }
        }
    }

    public async init(): Promise<void> {
        this.chainId = shortString.decodeShortString(
            (await this.provider.getChainId()) as string
        );

        const storage = this.getStorage();
        const addresses = Object.keys(storage);

        if (addresses.length) {
            Storage.set(this.getStorageKey(), storage);
            this.setActiveAccount(storage); // Re-select the active account
        } else {
            // set predeployed accounts in storage
            const storage = this.getStorage();
            for (let predeployed of this.predeployedAccounts) {
                storage[predeployed.address] = predeployed;
            }
            Storage.set(this.getStorageKey(), storage);
        }

        this.isInitialized = true;
    }

    public list(): Predeployed[] {
        const storage = this.getStorage();
        return Object.keys(storage).map((address) => {
            return {
                address,
                name: storage[address].name,
                active: storage[address].active,
            };
        });
    }

    public select(address: string): void {
        const storage = this.getStorage();
        if (!storage[address]) {
            throw new Error("predeployed not found");
        }

        for (let addr in storage) {
            storage[addr].active = false;
        }
        storage[address].active = true;

        Storage.set(this.getStorageKey(), storage);
        this.account = newAccount(
            this.provider,
            address,
            storage[address].privateKey,
            "1"
        );
    }

    public get(address: string): Account {
        const storage = this.getStorage();
        if (!storage[address]) {
            throw new Error("predeployed not found");
        }

        return newAccount(
            this.provider,
            address,
            storage[address].privateKey,
            "1"
        );
    }

    public delete(address: string) {
        const storage = this.getStorage();
        if (!storage[address]) {
            throw new Error("predeployed not found");
        }

        delete storage[address];

        Storage.set(this.getStorageKey(), storage);
    }

    clear(): void {
        Storage.remove(this.getStorageKey());
    }

    getActiveAccount(): Account | null {
        const storage = this.getStorage();
        for (let address in storage) {
            if (storage[address].active) {
                return newAccount(
                    this.provider,
                    address,
                    storage[address].privateKey,
                    "1"
                );
            }
        }
        return null;
    }
}
