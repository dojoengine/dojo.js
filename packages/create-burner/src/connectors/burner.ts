import { AccountInterface, Account } from "starknet";
import { Connector } from "@starknet-react/core";

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
    private _account: AccountInterface | Account | null;
    public _name: string = "Burner Connector";

    constructor(options: object, account: AccountInterface | Account | null) {
        super({ options });
        this._account = account;
    }

    available(): boolean {
        return true;
    }

    async ready(): Promise<boolean> {
        return true;
    }

    async connect(): Promise<AccountInterface> {
        if (!this._account) {
            throw new Error("account not found");
        }
        return Promise.resolve(this._account);
    }

    async disconnect(): Promise<void> {
        Promise.resolve(this._account == null);
    }

    async initEventListener(): Promise<void> {
        return Promise.resolve();
    }

    async removeEventListener(): Promise<void> {
        return Promise.resolve();
    }

    async account(): Promise<AccountInterface | null> {
        return Promise.resolve(this._account);
    }

    get id(): string {
        return this._account?.address.toString() || "Burner Account";
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return "my-icon-url";
    }
}
