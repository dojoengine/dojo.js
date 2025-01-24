import { init } from "@dojoengine/sdk/experimental";
import { setupWorld } from "../typescript/contracts.gen";
import { DojoProvider } from "@dojoengine/core";
import { SchemaType } from "@dojoengine/sdk";
import { DojoStore, GameState } from "@dojoengine/sdk/state";
import { BigNumberish } from "starknet";

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
        return entities?.models?.[namespace]?.[modelName];
    }
}
