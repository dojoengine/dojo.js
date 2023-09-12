import { AccountInterface, Account } from 'starknet'
import { Connector } from '@starknet-react/core'

/*  
    This is a custom connector to use within Starknet React.
*/

export class BurnerConnector extends Connector {
    private _account: AccountInterface | Account | null;
    public _name: string = 'Burner Connector';

    // Use the "options" type as per your need. Here, I am assuming it to be an object.
    constructor(options: object, account: AccountInterface | Account | null) {
        super({ options })
        this._account = account
    }

    available(): boolean {
        // Implement your logic here.
        return true;
    }

    async ready(): Promise<boolean> {
        // Implement your logic here.
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
        return this._account?.address.toString() || 'Burner Account';
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return 'my-icon-url';
    }
}