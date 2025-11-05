import { getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import { DirectionValue, dojoConfig, setup } from "@showcase/dojo";

async function main() {
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

    const position = getComponentValue(
        result.clientComponents.Position,
        entityId
    );
    const moves = getComponentValue(result.clientComponents.Moves, entityId);

    console.log("Position", position?.vec);
    console.log("Moves remaining", moves?.remaining);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
