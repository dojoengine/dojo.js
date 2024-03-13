import { Connector } from "@starknet-react/core";
import { Account, AccountInterface, shortString } from "starknet";
import { katanaIcon } from "./icons";

/** Burner connector options. */
interface BurnerConnectorOptions {
    /** The wallet id. */
    id: string;
    /** The chain id. */
    chainId: string;
    /** Wallet human readable name. */
    name?: string;
    /** Wallet icons. */
    icon?: ConnectorIcons;
}

/** Non exported types from @starknet-react/core*/

/** Connector icons, as base64 encoded svg. */
type ConnectorIcons = {
    /** Dark-mode icon. */
    dark?: string;
    /** Light-mode icon. */
    light?: string;
};
/** Connector data. */
type ConnectorData = {
    /** Connector account. */
    account?: string;
    /** Connector network. */
    chainId?: bigint;
};

/**
 *
 * @class BurnerConnector
 *
 * @description Extends the Connector class and implements the AccountInterface.
 *             This class is used to connect to the Burner Wallet.
 *
 *
 */
export class BurnerConnector extends Connector {
    private _options: BurnerConnectorOptions;
    private _account: AccountInterface | Account;
    // private _provider: RpcProvider;

    constructor(
        options: BurnerConnectorOptions,
        account: AccountInterface | Account
        // provider: RpcProvider
    ) {
        super();

        this._options = options;
        this._account = account;
        // this._provider = provider;
    }

    available(): boolean {
        return true;
    }

    async ready(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async connect(): Promise<ConnectorData> {
        if (!this._account) {
            throw new Error("account not found");
        }

        const chainId = await this.chainId();

        return Promise.resolve({
            account: this._account.address,
            chainId,
        });
    }

    async disconnect(): Promise<void> {
        Promise.resolve(this._account == null);
    }

    async account(): Promise<AccountInterface> {
        return Promise.resolve(this._account);
    }

    async chainId(): Promise<bigint> {
        return Promise.resolve(
            BigInt(shortString.encodeShortString(this._options.chainId))
        );
    }

    get id(): string {
        return this._options.id;
    }

    get name(): string {
        return this._options.name || "Dojo Burner";
    }

    get icon(): ConnectorIcons {
        return (
            this._options.icon || {
                light: katanaIcon,
                dark: katanaIcon,
            }
        );
    }
}
