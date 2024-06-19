import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";
import {
    Account,
    CallData,
    DeployAccountContractPayload,
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
import { derivePrivateKeyFromSeed } from "../utils/keyDerivation";
import { prefundAccount } from "./prefundAccount";

export const PREFUND_AMOUNT = "10000000000000000"; // 0.01 ETH

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
    public masterAccount: Account;
    public accountClassHash: string;
    public feeTokenAddress: string;
    public provider: RpcProvider;
    public chainId: string = "";

    public account: Account | null = null;
    public isDeploying: boolean = false;
    public isInitialized: boolean = false;

    private setIsDeploying?: (isDeploying: boolean) => void;
    private afterDeploying?: ({
        account,
        deployTx,
    }: {
        account: Account;
        deployTx: string;
    }) => Promise<void>;

    constructor({
        masterAccount,
        accountClassHash,
        feeTokenAddress = KATANA_ETH_CONTRACT_ADDRESS,
        rpcProvider,
    }: BurnerManagerOptions) {
        this.masterAccount = masterAccount;
        this.accountClassHash = accountClassHash;
        this.feeTokenAddress = feeTokenAddress;
        this.provider = rpcProvider;
    }

    public setIsDeployingCallback(
        callback: (isDeploying: boolean) => void
    ): void {
        this.setIsDeploying = callback;
    }

    public setAfterDeployingCallback(
        callback: ({
            account,
            deployTx,
        }: {
            account: Account;
            deployTx: string;
        }) => Promise<void>
    ): void {
        this.afterDeploying = callback;
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

    public async isBurnerDeployed(
        address: string,
        deployTx?: string
    ): Promise<boolean> {
        if (deployTx) {
            try {
                const receipt =
                    await this.masterAccount.getTransactionReceipt(deployTx);
                return receipt !== null;
            } catch {}
        }
        try {
            // if account has a nonce, it was already deployed
            const nonce = await this.masterAccount.getNonceForAddress(address);
            return BigInt(nonce) > 0n;
        } catch {}
        return false;
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
                address,
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
            ? derivePrivateKeyFromSeed(options.secret, options.index || 0)
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
        if (!this.masterAccount) {
            throw new Error("master wallet account not found");
        }

        this.updateIsDeploying(true);

        const { privateKey, publicKey, address } =
            this.generateKeysAndAddress(options);

        const burner = new Account(this.provider, address, privateKey, "1");

        let deployTx = "";

        const isDeployed = await this.isBurnerDeployed(address);

        if (!isDeployed) {
            const payload: DeployAccountContractPayload = {
                classHash: this.accountClassHash,
                constructorCalldata: CallData.compile({ publicKey }),
                addressSalt: publicKey,
            };

            let prefundAmount = BigInt(options?.prefundedAmount ?? 0);

            try {
                const { suggestedMaxFee } =
                    await this.masterAccount.estimateAccountDeployFee(payload, {
                        version: "0x3",
                    });
                if (suggestedMaxFee > prefundAmount) {
                    prefundAmount = suggestedMaxFee;
                }
            } catch (error) {
                console.warn(error);
                if (!prefundAmount) {
                    prefundAmount = BigInt(PREFUND_AMOUNT);
                }
            }

            if (prefundAmount > 0n) {
                try {
                    await prefundAccount(
                        address,
                        this.masterAccount,
                        this.feeTokenAddress,
                        prefundAmount.toString(),
                        options?.maxFee || 0
                    );
                } catch (e) {
                    console.error(`burner manager create() error:`, e);
                    this.updateIsDeploying(false);
                }
            }

            // deploy burner
            try {
                const { transaction_hash } =
                    await burner.deployAccount(payload);
                deployTx = transaction_hash;
            } catch (error) {
                this.updateIsDeploying(false);
                throw error;
            }

            // wait to deploy
            const receipt = await this.masterAccount.waitForTransaction(
                deployTx,
                {
                    retryInterval: 100,
                }
            );
            if (!receipt) {
                throw new Error("Transaction did not complete successfully.");
            }
        }

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

        if (this.afterDeploying) {
            try {
                await this.afterDeploying({ account: this.account, deployTx });
            } catch (e: any) {
                console.log("error on afterDeploying", e);
            }
        }

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
