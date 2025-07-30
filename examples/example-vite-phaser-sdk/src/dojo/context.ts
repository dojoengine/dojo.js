import type { DojoProvider } from "@dojoengine/core";
import type { SchemaType } from "@dojoengine/sdk";
import type { init } from "@dojoengine/sdk/experimental";
import type { DojoStore, GameState } from "@dojoengine/sdk/state";
import type { BigNumberish } from "starknet";
import { setupWorld } from "../typescript/contracts.gen";

export class DojoContext<Schema extends SchemaType> {
    client: ReturnType<typeof setupWorld>;
    store: GameState<Schema>;

    constructor(
        public sdk: Awaited<ReturnType<typeof init>>,
        public provider: DojoProvider,
        store: DojoStore<Schema>
    ) {
        this.client = setupWorld(provider);
        this.store = store.getState();
    }

    useModel<
        N extends keyof SchemaType,
        M extends keyof SchemaType[N] & string,
    >(
        entityId: BigNumberish,
        model: `${N}-${M}`
    ): SchemaType[N][M] | undefined {
        const [namespace, modelName] = model.split("-") as [N, M];

        // Select only the specific model data for the given entityId
        const entities = this.store.getEntity(entityId.toString());
        return entities?.models?.[namespace]?.[modelName] as
            | SchemaType[N][M]
            | undefined;
    }
}
