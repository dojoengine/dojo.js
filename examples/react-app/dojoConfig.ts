import manifest from "../dojo-starter/target/dev/manifest.json";

const {
    VITE_PUBLIC_NODE_URL,
    VITE_PUBLIC_TORII,
    VITE_PUBLIC_MASTER_ADDRESS,
    VITE_PUBLIC_MASTER_PRIVATE_KEY,
    VITE_PUBLIC_ACCOUNT_CLASS_HASH,
} = import.meta.env;

export type Config = ReturnType<typeof dojoConfig>;

export function dojoConfig() {
    return {
        rpcUrl: VITE_PUBLIC_NODE_URL || "http://localhost:5050",
        toriiUrl: VITE_PUBLIC_TORII || "http://0.0.0.0:8080",
        masterAddress:
            VITE_PUBLIC_MASTER_ADDRESS ||
            "0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
        masterPrivateKey:
            VITE_PUBLIC_MASTER_PRIVATE_KEY ||
            "0x1800000000300000180000000000030000000000003006001800006600",
        accountClassHash:
            VITE_PUBLIC_ACCOUNT_CLASS_HASH ||
            "0x33ac2f528bb97cc7b79148fd1756dc368be0e95d391d8c6d6473ecb60b4560e",
        manifest,
    };
}
