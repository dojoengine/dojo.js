import { Client } from "@dojoengine/torii-client";
import {
    Component,
    Schema,
    Metadata,
    Entity,
    setComponent,
} from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { convertValues } from "../utils";

type ModelEntry<S extends Schema> = {
    model: Component<S, Metadata, undefined>;
    keys: any[];
};

export function createSyncManager<S extends Schema>(
    client: Client,
    modelEntries: ModelEntry<S>[]
) {
    async function fetchAndSetModelValue(
        modelEntry: ModelEntry<S>
    ): Promise<void> {
        const { model, keys } = modelEntry;
        const componentName = model.metadata?.name as string;
        const keysToStrings = keys.map((key) => key.toString());
        const entityIndex: Entity =
            keys.length === 1 ? keys[0].toString() : getEntityIdFromKeys(keys);

        try {
            const modelValue = await client.getModelValue(
                componentName,
                keysToStrings
            );

            const convertedValue = convertValues(model.schema, modelValue);

            setComponent(model, entityIndex, convertedValue as any);
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    }

    function sync() {
        modelEntries.forEach((modelEntry) => {
            fetchAndSetModelValue(modelEntry);
            client.addEntitiesToSync([
                {
                    model: modelEntry.model.metadata?.name as string,
                    keys: modelEntry.keys.map((k) => k.toString()),
                },
            ]);
            client.onSyncEntityChange(
                {
                    model: modelEntry.model.metadata?.name! as string,
                    keys: modelEntry.keys.map((k) => k.toString()),
                },
                () => {
                    client
                        .getModelValue(
                            modelEntry.model.metadata?.name! as string,
                            modelEntry.keys.map((k) => k.toString())
                        )
                        .then((modelValue) => {
                            const convertedValue = convertValues(
                                modelEntry.model.schema,
                                modelValue
                            );

                            const entityIndex: Entity =
                                modelEntry.keys.length === 1
                                    ? modelEntry.keys[0].toString()
                                    : getEntityIdFromKeys(modelEntry.keys);

                            setComponent(
                                modelEntry.model,
                                entityIndex,
                                convertedValue as any
                            );
                        });
                }
            );
        });
    }

    function cleanup() {
        modelEntries.forEach((modelEntry) => {
            client
                .removeEntitiesToSync([
                    {
                        model: modelEntry.model.metadata?.name as string,
                        keys: modelEntry.keys.map((k) => k.toString()),
                    },
                ])
                .catch((error) => {
                    console.error(
                        "Failed to remove entities on cleanup",
                        error
                    );
                });
        });
    }

    return { cleanup, sync };
}
