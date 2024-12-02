import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../worlds/dojo-starter/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "http://localhost:5050/",
    toriiUrl: "http://localhost:8080",
    masterAddress:
        "0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
    // WARNING: Do not use this private key in production!
    // Use environment variables instead, e.g.: process.env.MASTER_PRIVATE_KEY
    masterPrivateKey:
        "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
});
