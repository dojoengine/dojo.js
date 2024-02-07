import {
    KATANA_CLASS_HASH,
    KATANA_PREFUNDED_ADDRESS,
    KATANA_PREFUNDED_PRIVATE_KEY,
    LOCAL_KATANA,
    LOCAL_RELAY,
    LOCAL_TORII,
} from "../constants";

export type DojoConfig = ReturnType<typeof createDojoConfig>;

interface DojoConfigParams {
    rpcUrl?: string;
    toriiUrl?: string;
    relayUrl?: string;
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    manifest: any;
}

/**
 * Create Dojo Config: Creates a Dojo Config object. If no parameters are passed, it will use the default values of the current Dojo version.
 */
export function createDojoConfig({ manifest, ...config }: DojoConfigParams) {
    return {
        rpcUrl: LOCAL_KATANA || config.rpcUrl,
        toriiUrl: LOCAL_TORII || config.toriiUrl,
        relayUrl: LOCAL_RELAY || config.relayUrl,
        masterAddress: KATANA_PREFUNDED_ADDRESS || config.masterAddress,
        masterPrivateKey:
            KATANA_PREFUNDED_PRIVATE_KEY || config.masterPrivateKey,
        accountClassHash: KATANA_CLASS_HASH || config.accountClassHash,
        manifest,
    };
}
