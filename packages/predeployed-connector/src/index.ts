import { InjectedConnector } from "@starknet-react/core";
import {
    Account,
    type AccountInterface,
    constants,
    type ProviderInterface,
    RpcChannel,
    RpcProvider,
    type TypedData,
    WalletAccount,
} from "starknet";
import {
    type AddInvokeTransactionParameters,
    type Errors,
    Permission,
    type RequestFn,
    type StarknetWindowObject,
    type WalletEventHandlers,
    type WalletEventListener,
    type WalletEvents,
} from "@starknet-io/types-js";

class PredeployedAccountsChannel extends RpcChannel {
    async getPredeployedAccounts() {
        try {
            // @ts-ignore
            return await this.fetchEndpoint("dev_predeployedAccounts");
        } catch (error) {
            console.warn(
                "Failed to get `dev_predeployedAccounts` endpoint",
                error
            );
            return [];
        }
    }
}

export type PredeployedAccountsConnectorOptions = {
    id: string;
    name: string;
    rpc: string;
};
export type WithAccount<T> = T & {
    account: PredeployedWalletAccount;
};

export type PredeployedAccount = {
    id: string;
    name: string;
    account: PredeployedWalletAccount;
};

// type ConnectorIcons = { dark: string; light: string };

const icon =
    "data:image/png;base64,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";

export class PredeployedAccountsConnector extends InjectedConnector {
    constructor(
        private options: WithAccount<PredeployedAccountsConnectorOptions>
    ) {
        super({ options: { id: options.id, name: options.name } });
    }

    available(): boolean {
        return !!this.options.account;
    }
}

class PredeployedWalletAccount extends WalletAccount {
    private _inner: PredeployedWallet;
    constructor(base: any, rpc: string) {
        super({ nodeUrl: rpc }, base, "1", base.account.address);
        this._inner = base;
    }
    request: RequestFn = async (call) => {
        return await this._inner.request(call);
    };
}

class PredeployedWallet implements StarknetWindowObject {
    public version = "v0.0.1";
    public icon = {
        dark: icon,
        light: icon,
    };
    subscriptions: any;

    constructor(
        public id: string,
        public name: string,
        private account: AccountInterface
    ) {
        this.subscriptions = [];

        if (typeof window !== "undefined") {
            (window as any)[`starknet_${id}`] = this;
        }
    }

    // @ts-ignore
    request: RequestFn = async (call) => {
        switch (call.type) {
            case "wallet_getPermissions":
                if (this.account) {
                    return [Permission.ACCOUNTS];
                }
                return [];

            case "wallet_requestAccounts": {
                if (this.account) {
                    return [this.account.address];
                }
                return [];
            }

            case "wallet_watchAsset":
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: "wallet_watchAsset not implemented",
                } as Errors.UNEXPECTED_ERROR;

            case "wallet_addStarknetChain":
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: "wallet_addStarknetChain not implemented",
                } as Errors.UNEXPECTED_ERROR;

            case "wallet_switchStarknetChain":
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: "wallet_switchStarknetChain not implemented",
                } as Errors.UNEXPECTED_ERROR;

            case "wallet_requestChainId":
                if (!this.account) {
                    throw {
                        code: 63,
                        message: "An unexpected error occurred",
                        data: "wallet_deploymentData not implemented",
                    } as Errors.UNEXPECTED_ERROR;
                }

                return await this.account.getChainId();

            case "wallet_deploymentData":
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: "wallet_deploymentData not implemented",
                } as Errors.UNEXPECTED_ERROR;

            case "wallet_addInvokeTransaction":
                if (!this.account) {
                    throw {
                        code: 63,
                        message: "An unexpected error occurred",
                        data: "wallet_deploymentData not implemented",
                    } as Errors.UNEXPECTED_ERROR;
                }

                let params = call.params as AddInvokeTransactionParameters;
                return await this.account.execute(
                    params.calls.map((call) => ({
                        contractAddress: call.contract_address,
                        entrypoint: call.entry_point,
                        calldata: call.calldata,
                    }))
                );

            case "wallet_addDeclareTransaction":
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: "wallet_addDeclareTransaction not implemented",
                } as Errors.UNEXPECTED_ERROR;

            case "wallet_signTypedData": {
                if (!this.account) {
                    throw {
                        code: 63,
                        message: "An unexpected error occurred",
                        data: "Account not initialized",
                    } as Errors.UNEXPECTED_ERROR;
                }

                return await this.account.signMessage(call.params as TypedData);
            }

            case "wallet_supportedSpecs":
                return [];
            case "wallet_supportedWalletApi":
                return [];
            default:
                throw {
                    code: 63,
                    message: "An unexpected error occurred",
                    data: `Unknown RPC call type: ${call.type}`,
                } as Errors.UNEXPECTED_ERROR;
        }
    };

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
        const idx = this.subscriptions.findIndex(
            (sub: any) => sub.type === event && sub.handler === handler
        );
        if (idx >= 0) {
            this.subscriptions.splice(idx, 1);
        }
    };
}

type PredeployedAccountRpcResponse = {
    address: string;
    publicKey: string;
    privateKey: string;
    classHash: string;
    balance: string;
};

export async function predeployedAccounts(
    options: PredeployedAccountsConnectorOptions
): Promise<PredeployedAccountsConnector[]> {
    async function getAccounts(
        provider: ProviderInterface,
        id: string,
        name: string
    ): Promise<PredeployedAccount[]> {
        // @ts-ignore
        const res = await provider.channel.getPredeployedAccounts();
        return res.map((a: PredeployedAccountRpcResponse, idx: number) => ({
            id: `${id}-${idx}`,
            name: `${name} ${idx}`,
            account: new PredeployedWalletAccount(
                new PredeployedWallet(
                    `${id}-${idx}`,
                    `${name} ${idx}`,
                    new Account(
                        provider,
                        a.address,
                        a.privateKey,
                        undefined,
                        constants.TRANSACTION_VERSION.V3
                    )
                ),
                options.rpc
            ),
        }));
    }

    // @ts-ignore
    const provider = new RpcProvider({
        channel: new PredeployedAccountsChannel({ nodeUrl: options.rpc }),
    });
    const accounts = await getAccounts(provider, options.id, options.name);

    return accounts.map(
        (a) =>
            new PredeployedAccountsConnector({
                rpc: options.rpc,
                id: a.id,
                name: a.name,
                account: a.account,
            })
    );
}
