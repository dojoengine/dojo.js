import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { DojoProvider } from "@dojoengine/core";
import { createDojoConfig } from "@dojoengine/core";
import { init, KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { Subscription } from "@dojoengine/grpc";
import { constants } from "starknet";

import manifest from "./manifest_sepolia.json" with { type: "json" };
const dojoConfig = createDojoConfig({
    manifest: manifest,
    toriiUrl: "https://api.cartridge.gg/x/nums-bal/torii",
});

function Root({ sdk }) {
    const [sub, setSub] = useState<Subscription | null>(null);

    const subscription = useCallback(async () => {
        return await sdk.subscribeEntityQuery({
            query: new ToriiQueryBuilder().withClause(
                KeysClause([], [], "VariableLen").build()
            ),
            callback: ({ data, error }) => {
                console.log(data, error);
            },
        });
    }, [sdk]);
    useEffect(() => {
        subscription().then(([data, sub]) => setSub(sub));
        return () => {
            if (sub) {
                sub.cancel();
            }
        };
    }, [sdk]);

    const provider = new DojoProvider(dojoConfig.manifest);
    return <div>Hello Dojo</div>;
}

async function main() {
    const sdk = await init({
        client: {
            toriiUrl: dojoConfig.toriiUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "nums",
            version: "1.0",
            chainId: constants.StarknetChainId.SN_SEPOLIA,
            revision: "1",
        },
    });

    const container = document.getElementById("root");
    if (!container) {
        throw new Error("Root element not found");
    }

    createRoot(container).render(
        <StrictMode>
            <Root sdk={sdk} />
        </StrictMode>
    );
}

main().catch(console.error);
