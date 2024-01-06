import manifest from "../../../dojo-starter/target/dev/manifest.json";

const { VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } = import.meta.env;

export function dojoConfig() {
    return {
        rpcUrl: VITE_PUBLIC_NODE_URL || "http://localhost:5050",
        toriiUrl: VITE_PUBLIC_TORII || "http://0.0.0.0:8080",
        manifest,
    };
}
