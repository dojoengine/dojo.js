import { Client } from "@dojoengine/torii-client";
import { Component, Schema, Metadata, setComponent } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { convertValues } from "../utils";

type ModelEntry<S extends Schema> = {
    model: Component<S, Metadata, undefined>;
    keys: any[];
};

async function fetchAndSetModelValue<S extends Schema>(
    client: Client,
    modelEntry: ModelEntry<S>
): Promise<void> {
    const { model, keys } = modelEntry;

    try {
        setComponent(
            model,
            getEntityIdFromKeys(keys),
            convertValues(
                model.schema,
                await client.getModelValue(
                    model.metadata?.name as string,
                    keys.map((key) => key.toString())
                )
            ) as any
        );
    } catch (error) {
        console.error("Failed to fetch or set model value:", error);
    }
}

export function createSyncManager<S extends Schema>(
    client: Client,
    modelEntries: ModelEntry<S>[]
) {
    function sync() {
        modelEntries.forEach((modelEntry) => {
            fetchAndSetModelValue(client, modelEntry);
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
                            setComponent(
                                modelEntry.model,
                                getEntityIdFromKeys(modelEntry.keys),
                                convertValues(
                                    modelEntry.model.schema,
                                    modelValue
                                ) as any
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
