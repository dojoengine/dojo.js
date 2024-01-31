import manifest from "../../dojo-starter/target/dev/manifest.json" assert { type: "json" };

const {
    NODE_URL,
    TORII,
    MASTER_ADDRESS,
    MASTER_PRIVATE_KEY,
    ACCOUNT_CLASS_HASH,
} = process.env;

export type Config = ReturnType<typeof dojoConfig>;

export function dojoConfig() {
    return {
        rpcUrl: NODE_URL || "http://localhost:5050",
        toriiUrl: TORII || "http://0.0.0.0:8080",
        masterAddress:
            MASTER_ADDRESS ||
            "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03",
        masterPrivateKey:
            MASTER_PRIVATE_KEY ||
            "0x1800000000300000180000000000030000000000003006001800006600",
        accountClassHash:
            ACCOUNT_CLASS_HASH ||
            "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
        manifest,
    };
}
