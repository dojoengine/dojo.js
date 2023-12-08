
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "./burnerManager";

interface BurnerConfig {
    nodeUrl: string;
    masterAddress: string;
    masterPrivateKey: string;
    accountClassHash: string;
}

export class BurnerHandler {
    private burnerManager: BurnerManager;

    constructor(config: BurnerConfig) {
        const rpcProvider = new RpcProvider({ nodeUrl: config.nodeUrl });

        const masterAccount = new Account(
            rpcProvider,
            config.masterAddress,
            config.masterPrivateKey
        );

        this.burnerManager = new BurnerManager({
            masterAccount,
            accountClassHash: config.accountClassHash,
            rpcProvider,
        });
    }

    async initialize() {
        try {
            await this.burnerManager.create();
            this.burnerManager.init();
        } catch (e) {
            console.error("Error initializing Burner Manager:", e);
            throw e;
        }
    }

    listBurner() {
        return this.burnerManager.list();
    };
    
    selectBurner = (address : string) => {
        this.burnerManager.select(address);
        return this.burnerManager.getActiveAccount();
    };
    
    getBurner = (address: string) => {
        return this.burnerManager.get(address);
    };
    
    createBurnerAccount = async (burnerManager: string) => {
        return await this.burnerManager.create();;
    };
    
    clearBurner() {
        this.burnerManager.clear();
    };
    
};