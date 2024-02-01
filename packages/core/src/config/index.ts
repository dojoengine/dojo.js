export type DojoConfig = ReturnType<typeof createDojoConfig>;

interface DojoConfigParams {
    rpcUrl?: string;
    toriiUrl?: string;
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    manifest: any;
}

/**
 * Create Dojo Config: Creates a Dojo Config object. If no parameters are passed, it will use the default values of the current Dojo version.
 */
export function createDojoConfig({ ...config }: DojoConfigParams) {
    return {
        rpcUrl: "http://localhost:5050" || config.rpcUrl,
        toriiUrl: "http://0.0.0.0:8080" || config.toriiUrl,
        masterAddress:
            "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03" ||
            config.masterAddress,
        masterPrivateKey:
            "0x1800000000300000180000000000030000000000003006001800006600" ||
            config.masterPrivateKey,
        accountClassHash:
            "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c" ||
            config.accountClassHash,
        manifest: config.manifest,
    };
}
