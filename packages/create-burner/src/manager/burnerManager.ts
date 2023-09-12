import { Account, AccountInterface, CallData, ec, hash, RpcProvider, stark } from "starknet";
import Storage from "../utils/storage";
import { Burner, BurnerManagerOptions, BurnerStorage } from "../types";
import { prefundAccount } from "./prefundAccount";

export class BurnerManager {
    public masterAccount?: AccountInterface | Account;
    public accountClassHash: string;
    public provider: RpcProvider;

    public account: Account | null = null;
    public isDeploying: boolean = false;
    public burnerAccounts: Burner[] = [];

    constructor(options: BurnerManagerOptions) {
        this.masterAccount = options.masterAccount;
        this.accountClassHash = options.accountClassHash;
        this.provider = new RpcProvider({
            nodeUrl: options.nodeUrl || "http://localhost:5050",
        });;
    }

    private getBurnerStorage(): BurnerStorage {
        return Storage.get("burners") || {};
    }

    private setActiveBurnerAccount(storage: BurnerStorage): void {
        for (let address in storage) {
            if (storage[address].active) {
                this.account = new Account(this.provider, address, storage[address].privateKey);
                return;
            }
        }
    }

    public init(): void {
        const storage = this.getBurnerStorage();

        if (Object.keys(storage).length > 0) {
            const firstAddr = Object.keys(storage)[0];
            this.masterAccount?.getTransactionReceipt(storage[firstAddr].deployTx)
                .then(response => {
                    if (!response) {
                        this.account = null;
                        Storage.remove("burners");
                        throw new Error("Burners not deployed, chain may have restarted");
                    }
                })
                .catch(() => {
                    throw new Error("Error fetching transaction receipt");
                });

            this.setActiveBurnerAccount(storage);
        }
    }

    public list(): Burner[] {
        const storage = this.getBurnerStorage();
        return Object.keys(storage).map((address) => {
            return {
                address,
                active: storage[address].active,
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

        Storage.set("burners", storage);
        this.account = new Account(this.provider, address, storage[address].privateKey);
    }

    public get(address: string): Account {
        const storage = this.getBurnerStorage();
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        return new Account(this.provider, address, storage[address].privateKey);
    }

    getActiveAccount(): Account | null {
        const storage = this.getBurnerStorage();
        for (let address in storage) {
            if (storage[address].active) {
                return new Account(
                    this.provider,
                    address,
                    storage[address].privateKey
                );
            }
        }
        return null;
    }

    public async create(): Promise<Account> {
        this.isDeploying = true;

        const privateKey = stark.randomAddress();
        const publicKey = ec.starkCurve.getStarkKey(privateKey);
        const address = hash.calculateContractAddressFromHash(
            publicKey,
            this.accountClassHash,
            CallData.compile({ publicKey }),
            0,
        );

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
        }

        // deploy burner
        const burner = new Account(this.provider, address, privateKey);

        const nonce = await this.account?.getNonce();

        const { transaction_hash: deployTx } = await burner.deployAccount(accountOptions, {
            nonce,
            maxFee: 0 // TODO: update
        });

        const storage = this.getBurnerStorage();
        for (let address in storage) {
            storage[address].active = false;
        }

        storage[address] = {
            privateKey,
            publicKey,
            deployTx,
            active: true,
        };

        this.account = burner;
        this.isDeploying = false;
        Storage.set("burners", storage);

        return burner;
    }
}