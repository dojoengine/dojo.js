import {
    KATANA_CLASS_HASH,
    KATANA_ETH_CONTRACT_ADDRESS,
    KATANA_PREFUNDED_ADDRESS,
    KATANA_PREFUNDED_PRIVATE_KEY,
    LOCAL_KATANA,
    LOCAL_TORII,
} from "../constants";

export type DojoConfig = ReturnType<typeof createDojoConfig>;

interface DojoConfigParams {
    rpcUrl?: string;
    toriiUrl?: string;
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    feeTokenAddress?: string;
    manifest: any;
}

/**
 * Create Dojo Config: Creates a Dojo Config object. If no parameters are passed, it will use the default values of the current Dojo version.
 */
export function createDojoConfig({ manifest, ...config }: DojoConfigParams) {
    return {
        rpcUrl: config.rpcUrl ?? LOCAL_KATANA,
        toriiUrl: config.toriiUrl ?? LOCAL_TORII,
        masterAddress: config.masterAddress ?? KATANA_PREFUNDED_ADDRESS,
        masterPrivateKey:
            config.masterPrivateKey ?? KATANA_PREFUNDED_PRIVATE_KEY,
        accountClassHash: config.accountClassHash ?? KATANA_CLASS_HASH,
        feeTokenAddress: config.feeTokenAddress ?? KATANA_ETH_CONTRACT_ADDRESS,
        manifest: {
            ...manifest,
            world: { ...manifest.world, abi: manifest.abis },
        },
    };
}
