import {
    Account,
    AccountInterface,
    CallData,
    ec,
    hash,
    RpcProvider,
    shortString,
    stark,
} from "starknet";
import {
    Burner,
    BurnerCreateOptions,
    BurnerManagerOptions,
    BurnerStorage,
    BurnerKeys,
} from "../types";
import Storage from "../utils/storage";
import { prefundAccount } from "./prefundAccount";
import { derivePrivateKeyFromSeed } from "./keyDerivation";

/**
 * A class to manage Burner accounts.
 * This class exposes methods and properties to manage Burner accounts.
 * This class uses LocalStorage to store the Burner accounts.
 * You can use this class to build your own Burner Wallet in any js framework.
 *
 * @example
 *
 * ```ts
 * export const createBurner = async () => {
 *     const rpcProvider = new RpcProvider({
 *          nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
 *    });
 *
 *  const masterAccount = new Account(
 *      rpcProvider,
 *      import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!,
 *      import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!,
 *      "1"
 *   );
 *
 *   const burnerManager = new BurnerManager({
 *      masterAccount,
 *      accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!,
 *      rpcProvider,
 *   });
 *
 *   try {
 *           await burnerManager.init();
 *           if (burnerManager.list().length === 0) {
 *                 await burnerManager.create();
 *           }
 *       } catch (e) {
 *           console.log(e);
 *       }
 *   }
 *
 *  return {
 *      account: burnerManager.account as Account,
 *      burnerManager,
 *   };
 * };
 *
 *
 */

export class BurnerManager {
    public masterAccount: AccountInterface;
    public accountClassHash: string;
    public provider: RpcProvider;
    public chainId: string = "";

    public account: Account | null = null;
    public isDeploying: boolean = false;
    public isInitialized: boolean = false;

    private setIsDeploying?: (isDeploying: boolean) => void;

    constructor({
        masterAccount,
        accountClassHash,
        rpcProvider,
    }: BurnerManagerOptions) {
        this.masterAccount = masterAccount;
        this.accountClassHash = accountClassHash;
        this.provider = rpcProvider;
    }

    public setIsDeployingCallback(
        callback: (isDeploying: boolean) => void
    ): void {
        this.setIsDeploying = callback;
    }

    private updateIsDeploying(status: boolean) {
        this.isDeploying = status;
        if (this.setIsDeploying) {
            this.setIsDeploying(status);
        }
    }

    private getBurnerKey(): string {
        return `burners_${this.chainId}`;
    }

    private getBurnerStorage(): BurnerStorage {
        return Storage.get(this.getBurnerKey()) || {};
    }

    private setActiveBurnerAccount(storage: BurnerStorage): void {
        for (let address in storage) {
            if (storage[address].active) {
                this.account = new Account(
                    this.provider,
                    address,
                    storage[address].privateKey,
                    "1"
                );
                return;
            }
        }
    }

    private async isBurnerDeployed(deployTx: string): Promise<boolean> {
        try {
            const receipt =
                await this.masterAccount.getTransactionReceipt(deployTx);
            return receipt !== null;
        } catch (error) {
            return false;
        }
    }

    public async init(keepNonDeployed = false): Promise<void> {
        if (this.isInitialized) {
            throw new Error("BurnerManager is already initialized");
        }
        this.chainId = shortString.decodeShortString(
            (await this.provider.getChainId()) as string
        );
        const storage = this.getBurnerStorage();
        const addresses = Object.keys(storage);

        const checks = addresses.map(async (address) => {
            const isDeployed = await this.isBurnerDeployed(
                storage[address].deployTx
            );
            return isDeployed ? null : address;
        });

        const toRemove = (await Promise.all(checks)).filter(
            (address): address is string => address !== null
        );

        toRemove.forEach((address) => {
            if (!keepNonDeployed) {
                console.log(
                    `Removing non-deployed burner at address ${address}.`
                );
                delete storage[address];
            }
        });

        if (Object.keys(storage).length) {
            Storage.set(this.getBurnerKey(), storage);
            this.setActiveBurnerAccount(storage); // Re-select the active burner account
        } else {
            this.clear();
        }

        this.isInitialized = true;
    }

    public list(): Burner[] {
        const storage = this.getBurnerStorage();
        return Object.keys(storage).map((address) => {
            return {
                address,
                active: storage[address].active,
                masterAccount: storage[address].masterAccount,
                accountIndex: storage[address].accountIndex,
            };
        });
    }

    public select(address: string): void {
        const storage = this.getBurnerStorage();
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        for (let addr in storage) {
            storage[addr].active = false;
        }
        storage[address].active = true;

        Storage.set(this.getBurnerKey(), storage);
        this.account = new Account(
            this.provider,
            address,
            storage[address].privateKey,
            "1"
        );
    }

    public deselect(): void {
        const storage = this.getBurnerStorage();
        for (let addr in storage) {
            storage[addr].active = false;
        }
        Storage.set(this.getBurnerKey(), storage);
        this.account = null;
    }

    public get(address: string): Account {
        const storage = this.getBurnerStorage();
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        return new Account(
            this.provider,
            address,
            storage[address].privateKey,
            "1"
        );
    }

    public delete(address: string) {
        const storage = this.getBurnerStorage();
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        delete storage[address];

        Storage.set(this.getBurnerKey(), storage);
    }

    clear(): void {
        Storage.remove(this.getBurnerKey());
    }

    getActiveAccount(): Account | null {
        const storage = this.getBurnerStorage();
        for (let address in storage) {
            if (storage[address].active) {
                return new Account(
                    this.provider,
                    address,
                    storage[address].privateKey,
                    "1"
                );
            }
        }
        return null;
    }

    public generateKeysAndAddress(options?: BurnerCreateOptions): BurnerKeys {
        const privateKey = options?.secret
            ? derivePrivateKeyFromSeed(options.secret, options.index)
            : stark.randomAddress();
        const publicKey = ec.starkCurve.getStarkKey(privateKey);
        return {
            privateKey,
            publicKey,
            address: hash.calculateContractAddressFromHash(
                publicKey,
                this.accountClassHash,
                CallData.compile({ publicKey }),
                0
            ),
        };
    }

    public async create(options?: BurnerCreateOptions): Promise<Account> {
        if (!this.isInitialized) {
            throw new Error("BurnerManager is not initialized");
        }

        this.updateIsDeploying(true);

        const { privateKey, publicKey, address } =
            this.generateKeysAndAddress(options);

        if (!this.masterAccount) {
            throw new Error("wallet account not found");
        }
        try {
            await prefundAccount(address, this.masterAccount);
        } catch (e) {
            this.isDeploying = false;
        }

        const accountOptions = {
            classHash: this.accountClassHash,
            constructorCalldata: CallData.compile({ publicKey }),
            addressSalt: publicKey,
        };

        // deploy burner
        const burner = new Account(this.provider, address, privateKey, "1");

        const nonce = await this.account?.getNonce();

        const { transaction_hash: deployTx } = await burner.deployAccount(
            accountOptions,
            {
                nonce,
                maxFee: 0, // TODO: update
            }
        );

        // shouldn't we wait to make sure it was accepted?
        // console.log(`DEPLOY TX:`, deployTx)
        // const receipt = await this.masterAccount.waitForTransaction(deployTx)
        // console.log(`DEPLOY RECEIPT:`, receipt)

        const storage = this.getBurnerStorage();
        for (let address in storage) {
            storage[address].active = false;
        }

        storage[address] = {
            chainId: this.chainId,
            privateKey,
            publicKey,
            deployTx,
            masterAccount: this.masterAccount.address,
            active: true,
        };

        if (options?.secret) {
            storage[address].accountIndex = options.index;
        }
        if (options?.metadata) {
            storage[address].metadata = options.metadata;
        }

        this.account = burner;
        this.updateIsDeploying(false);
        Storage.set(this.getBurnerKey(), storage);

        return burner;
    }

    public async copyBurnersToClipboard(): Promise<void> {
        const burners = this.getBurnerStorage();
        try {
            await navigator.clipboard.writeText(JSON.stringify(burners));
        } catch (error) {
            throw error;
        }
    }

    public async setBurnersFromClipboard(): Promise<void> {
        try {
            const text = await navigator.clipboard.readText();
            const burners: BurnerStorage = JSON.parse(text);

            // Assume no burner is active
            let activeAddress: string | null = null;

            // Iterate over the pasted burners to find the active one
            for (const [address, burner] of Object.entries(burners)) {
                if (burner.active) {
                    activeAddress = address;
                    break;
                }
            }

            Storage.set(this.getBurnerKey(), burners);

            // If there's an active burner, select it
            if (activeAddress) {
                this.select(activeAddress);
            }
        } catch (error) {
            throw error;
        }
    }
}
