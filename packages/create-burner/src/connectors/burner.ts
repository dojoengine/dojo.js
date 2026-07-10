import { StarknetInjectedWallet } from "@starknet-io/get-starknet-core";
import {
    type AddInvokeTransactionParameters,
    type UNKNOWN_ERROR,
    Permission,
    type RequestFn,
    type StarknetWindowObject,
    type WalletEventHandlers,
    type WalletEventListener,
    type WalletEvents,
} from "@starknet-io/types-js";
import {
    Account,
    type AccountInterface,
    shortString,
    type TypedData,
} from "starknet";

import { katanaIcon } from "./icons";

/** Burner connector options. */
interface BurnerConnectorOptions {
    /** The connector id. */
    id: string;
    /** Connector human readable name. */
    name?: string;
    /** Connector icons. */
    icon?: ConnectorIcons;
}

/** Connector icons, as base64 encoded svg. */
type ConnectorIcons = StarknetWindowObject["icon"];

/** Connector data retained for callers of the legacy direct API. */
type ConnectorData = {
    account?: string;
    chainId?: bigint;
};

class BurnerWallet implements StarknetWindowObject {
    readonly version = "v0.0.1";
    readonly id: string;
    readonly name: string;
    readonly icon: ConnectorIcons;
    private readonly subscriptions: WalletEvents[] = [];

    constructor(
        options: BurnerConnectorOptions,
        private readonly account: AccountInterface | Account
    ) {
        this.id = options.id;
        this.name = options.name ?? "Dojo Burner";
        this.icon = options.icon ?? {
            light: katanaIcon,
            dark: katanaIcon,
        };
    }

    request: RequestFn = async (call) => {
        return (await this.handleRequest(call)) as never;
    };

    private async handleRequest(
        call: Parameters<RequestFn>[0]
    ): Promise<unknown> {
        switch (call.type) {
            case "wallet_getPermissions":
                return [Permission.ACCOUNTS];
            case "wallet_requestAccounts":
                return [this.account.address];
            case "wallet_requestChainId": {
                const chainId = await this.account.provider.getChainId();
                return shortString.encodeShortString(chainId);
            }
            case "wallet_addInvokeTransaction": {
                const params = call.params as AddInvokeTransactionParameters;
                return await this.account.execute(
                    params.calls.map((item) => ({
                        contractAddress: item.contract_address,
                        entrypoint: item.entry_point,
                        calldata: item.calldata,
                    }))
                );
            }
            case "wallet_signTypedData":
                return await this.account.signMessage(call.params as TypedData);
            case "wallet_switchStarknetChain":
                return true;
            case "wallet_supportedSpecs":
            case "wallet_supportedWalletApi":
                return [];
            default:
                throw {
                    code: 163,
                    message: "An error occurred (UNKNOWN_ERROR)",
                    data: `BurnerConnector request not implemented: ${call.type}`,
                } as UNKNOWN_ERROR;
        }
    }

    on: WalletEventListener = <E extends keyof WalletEventHandlers>(
        event: E,
        handler: WalletEventHandlers[E]
    ): void => {
        if (event !== "accountsChanged" && event !== "networkChanged") {
            throw new Error(`Unknown event: ${event}`);
        }
        this.subscriptions.push({ type: event, handler } as WalletEvents);
    };

    off: WalletEventListener = <E extends keyof WalletEventHandlers>(
        event: E,
        handler: WalletEventHandlers[E]
    ): void => {
        if (event !== "accountsChanged" && event !== "networkChanged") {
            throw new Error(`Unknown event: ${event}`);
        }
        const index = this.subscriptions.findIndex(
            (subscription) =>
                subscription.type === event && subscription.handler === handler
        );
        if (index >= 0) {
            this.subscriptions.splice(index, 1);
        }
    };
}

/**
 * A wallet-standard burner connector for Starknet Start.
 *
 * The direct connector methods are retained for existing Dojo consumers,
 * while Starknet Start connects through the inherited wallet-standard
 * feature set.
 */
export class BurnerConnector extends StarknetInjectedWallet {
    private readonly wallet: BurnerWallet;

    constructor(
        private readonly options: BurnerConnectorOptions,
        private readonly innerAccount: AccountInterface | Account
    ) {
        const wallet = new BurnerWallet(options, innerAccount);
        super(wallet);
        this.wallet = wallet;
    }

    available(): boolean {
        return true;
    }

    async ready(): Promise<boolean> {
        return true;
    }

    async connect(): Promise<ConnectorData> {
        if (!this.innerAccount) {
            throw new Error("account not found");
        }

        return {
            account: this.innerAccount.address,
            chainId: await this.chainId(),
        };
    }

    async disconnect(): Promise<void> {
        return Promise.resolve();
    }

    async account(): Promise<AccountInterface> {
        return this.innerAccount;
    }

    async chainId(): Promise<bigint> {
        const chainId = await this.innerAccount.provider.getChainId();
        return BigInt(shortString.encodeShortString(chainId));
    }

    get id(): string {
        return this.options.id;
    }

    request: RequestFn = async (call) => this.wallet.request(call);
}
