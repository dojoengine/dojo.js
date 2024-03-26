import { IStarknetWindowObject } from "get-starknet-core";
import { AccountInterface, RpcProvider } from "starknet";
import { PredeployedManager } from "..";
import { katanaIcon } from "./icons";

const VERSION = "0.0.1";

export class DojoPredeployedStarknetWindowObject
    implements IStarknetWindowObject
{
    id = "dojopredeployed";
    name = "Dojo Predeployed";
    icon = katanaIcon;
    account?: AccountInterface = undefined;
    provider?: RpcProvider = undefined;
    selectedAddress?: string = undefined;
    chainId?: string = undefined;
    isConnected = false;
    version = VERSION;
    //
    predeployedManager: PredeployedManager | null = null;

    constructor() {}

    setPredeployedManager(predeployedManager: PredeployedManager) {
        this.predeployedManager = predeployedManager;

        this.chainId = this.predeployedManager.chainId;
        this.provider = this.predeployedManager.provider;

        const activeAccount = this.predeployedManager.getActiveAccount();

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
        if (!this.predeployedManager) {
            // try to wait
            await new Promise((r) => setTimeout(r, 1500));
        }

        // retrieve active account
        const activeAccount = this.predeployedManager?.getActiveAccount();
        this.account = activeAccount ? activeAccount : undefined;

        if (!this.account) {
            // try to select first account
            const predeployed = this.predeployedManager?.list();
            if (predeployed && predeployed?.length > 0) {
                //select first
                this.predeployedManager?.select(predeployed[0].address);

                // retrieve active account
                const activeAccount =
                    this.predeployedManager?.getActiveAccount();
                this.account = activeAccount ? activeAccount : undefined;
            }
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
}
