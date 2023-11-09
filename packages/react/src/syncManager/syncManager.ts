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

// type KeyType = any; // Replace 'any' with your actual key type
type ModelEntry<S extends Schema> = {
    model: Component<S, Metadata, undefined>;
    keys: any[];
};

export class SyncManager<S extends Schema> {
    private client: Client;
    private modelEntries: ModelEntry<S>[];
    private isMounted: boolean;

    constructor(client: Client, modelEntries: ModelEntry<S>[]) {
        this.client = client;
        this.modelEntries = modelEntries;
        this.isMounted = true;

        console.log("init");
        this.init();
    }

    private async fetchAndSetModelValue(
        modelEntry: ModelEntry<S>
    ): Promise<void> {
        const { model, keys } = modelEntry;
        const componentName = model.metadata?.name as string;
        const keysToStrings = keys.map((key) => key.toString());
        const entityIndex: Entity =
            keys.length === 1 ? keys[0].toString() : getEntityIdFromKeys(keys);

        try {
            if (this.isMounted) {
                const modelValue = await this.client.getModelValue(
                    componentName,
                    keysToStrings
                );
                // TODO:

                console.log("modelValue", modelValue);

                const convertedValue = convertValues(model.schema, modelValue);
                setComponent(model, entityIndex, convertedValue as any);
            }
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    }

    private init(): void {
        this.modelEntries.forEach((modelEntry) => {
            this.fetchAndSetModelValue(modelEntry);
            this.client.addEntitiesToSync([
                {
                    model: modelEntry.model.metadata?.name as string,
                    keys: modelEntry.keys.map((k) => k.toString()),
                },
            ]);
        });
    }

    public cleanup(): void {
        this.isMounted = false;
        this.modelEntries.forEach((modelEntry) => {
            this.client
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
}
