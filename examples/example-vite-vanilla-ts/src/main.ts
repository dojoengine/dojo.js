// Step 1. Import dojoConfig. This pulls data out of manifest and makes it reusable throughout your entire application.
import { dojoConfig } from "./dojoConfig.ts";

import { init } from "@dojoengine/sdk/experimental";
import { schema, SchemaType } from "./typescript/models.gen.ts";
import { ClauseBuilder, ToriiQueryBuilder } from "@dojoengine/sdk";

async function main() {
    // Step 2. Instanciate sdk. It's considered a good practice to instanciate it once and then use this handle.
    const sdk = await init<SchemaType>({
        client: {
            rpcUrl: dojoConfig.rpcUrl,
            toriiUrl: dojoConfig.toriiUrl,
            relayUrl: dojoConfig.relayUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    });

    const events = await sdk.getEvents(
        new ToriiQueryBuilder()
            .withClause(new ClauseBuilder().keys([], [undefined]).build())
            .build()
    );
    console.log(events);
}

main().catch(console.error);
