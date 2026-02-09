import { getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {
    DirectionValue,
    dojoConfig,
    setup,
    type Position,
    type Moves,
} from "@showcase/dojo";

async function main(): Promise<void> {
    const result = await setup(dojoConfig);

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

    const entityId = getEntityIdFromKeys([BigInt(account.address)]);

    // ABI-derived types: Position has { player, vec: { x, y } }
    const position = getComponentValue(
        result.clientComponents.Position,
        entityId
    ) as Position | undefined;
    const moves = getComponentValue(result.clientComponents.Moves, entityId) as
        | Moves
        | undefined;

    console.log("Position", position?.vec);
    console.log("Moves remaining", moves?.remaining);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
