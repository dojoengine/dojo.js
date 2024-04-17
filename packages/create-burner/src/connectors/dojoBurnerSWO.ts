import { IStarknetWindowObject } from "get-starknet-core";
import { AccountInterface, RpcProvider } from "starknet";
import { BurnerManager } from "..";
import { katanaIcon } from "./icons";

const ID = "dojoburner";
const NAME = "Dojo Burner";
const VERSION = "0.0.1";

export class DojoBurnerStarknetWindowObject implements IStarknetWindowObject {
    id = ID;
    name = NAME;
    icon = katanaIcon;
    account?: AccountInterface = undefined;
    provider?: RpcProvider = undefined;
    selectedAddress?: string = undefined;
    chainId?: string = undefined;
    isConnected = false;
    version = VERSION;
    //
    burnerManager: BurnerManager;

    constructor(burnerManager: BurnerManager) {
        if (!burnerManager.isInitialized) {
            throw new Error("burnerManager should be initialized");
        }

        this.burnerManager = burnerManager;

        this.chainId = this.burnerManager.chainId;
        this.provider = this.burnerManager.provider;

        const activeAccount = this.burnerManager.getActiveAccount();

        this.account = activeAccount ? activeAccount : undefined;
        this.selectedAddress = this.account?.address;
    }

    ///@ts-ignore
    async request(call: any) {
        //console.log("request", call);
    }

    ///@ts-ignore
    async enable({ starknetVersion = "v5" } = {}) {
        //console.log("enable");
        if (!this.burnerManager) {
            // try to wait
            await new Promise((r) => setTimeout(r, 1500));
        }

        // retrieve active account
        const activeAccount = this.burnerManager?.getActiveAccount();
        this.account = activeAccount ? activeAccount : undefined;

        if (!this.account) {
            this.account = await this.burnerManager?.create();
        }
        if (!this.account) {
            this.isConnected = false;
            return [];
        }

        this.isConnected = true;

        return [this.account.address];
    }

    async isPreauthorized() {
        return true;
    }

    ///@ts-ignore
    on = (event: any, handleEvent: any) => {
        //console.log("on", event);
    };

    ///@ts-ignore
    off = (event: any, handleEvent: any) => {
        //console.log("off", event);
    };

    /** @returns {string} the connector id */
    static getId(): string {
        return ID;
    }

    /** @returns {string} the connector name */
    static getName(): string {
        return NAME;
    }
}
