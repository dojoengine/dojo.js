import { init, ToriiQueryBuilder, KeysClause } from "@dojoengine/sdk/node";

import {
    DirectionValue,
    dojoConfig,
    setup,
    type Position,
    type Moves,
    type DojoStarterSchema,
} from "@showcase/dojo";

async function main(): Promise<void> {
    const result = await setup(dojoConfig);

    // Initialize SDK for querying entities (no recs)
    const sdk = await init<DojoStarterSchema>({
        client: {
            toriiUrl: dojoConfig.toriiUrl,
            worldAddress: dojoConfig.manifest.world.address || "",
        },
        domain: {
            name: "dojo_starter",
            version: "1.0.0",
            chainId: "SN_MAIN",
            revision: "1",
        },
    });

    if (result.burnerManager.list().length === 0) {
        await result.burnerManager.create();
    }

    const account = result.burnerManager.getActiveAccount();
    if (!account) {
        throw new Error("Unable to resolve an active account");
    }

    console.log("Using account", account.address);

    await result.systemCalls.spawn(account);
    console.log("Spawned entity for", account.address);

    await result.systemCalls.move(account, DirectionValue.Right());
    await result.systemCalls.move(account, DirectionValue.Up());

    // Query entities via SDK instead of recs getComponentValue
    const entities = await sdk.getEntities({
        query: new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    ["dojo_starter-Position", "dojo_starter-Moves"],
                    [account.address],
                    "VariableLen"
                ).build()
            )
            .includeHashedKeys(),
    });

    const entity = entities.items[0];
    const position = entity?.models?.dojo_starter?.Position as
        | Position
        | undefined;
    const moves = entity?.models?.dojo_starter?.Moves as Moves | undefined;

    console.log("Position", position?.vec);
    console.log("Moves remaining", moves?.remaining);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
