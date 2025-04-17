import { init, KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk/node";
import { dojoConfig } from "./dojoConfig";

const sdk = await init({
    client: {
        toriiUrl: dojoConfig.toriiUrl,
        relayUrl: dojoConfig.relayUrl,
        worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {},
});

const query = new ToriiQueryBuilder()
    .withClause(
        KeysClause(
            ["dojo_starter-Position", "dojo_starter-Moves"],
            [undefined]
        ).build()
    )
    .includeHashedKeys();

function onEntityUpdated({ data, error }) {
    if (error) {
        console.error(error);
        return;
    }

    const entity = data.pop();
    if (entity && entity.entityId !== "0x0") {
        // do whatever you need here
        console.log(entity.models.dojo_starter);
    }
}

const [entities, sub] = await sdk.subscribeEntityQuery({
    query,
    callback: onEntityUpdated,
    historical: false,
});

console.log(entities);

process.on("SIGTERM", () => {
    // NOTE: do not forget to free sub here;
    sub.free();
    process.exit(0);
});

process.on("SIGINT", () => {
    // NOTE: do not forget to free sub here;
    sub.free();
    process.exit(0);
});
