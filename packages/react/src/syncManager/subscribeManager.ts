import { Client } from "@dojoengine/torii-client";
import {
    Component,
    Schema,
    Metadata,
    Entity,
    setComponent,
    ComponentValue,
} from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { convertValues } from "../utils";

type ModelEntry<S extends Schema> = {
    model: Component<S, Metadata, undefined>;
    keys: any[];
};

export class SubscribeManager<S extends Schema> {
    private client: Client;
    private modelEntries: ModelEntry<S>[];

    constructor(client: Client, modelEntries: ModelEntry<S>[]) {
        this.client = client;
        this.modelEntries = modelEntries;
        this.modelEntries.forEach((entry) => this.subscribeToModel(entry));
    }

    private async setModelValue(modelEntry: ModelEntry<S>): Promise<void> {
        const { model, keys } = modelEntry;
        const componentName = model.metadata?.name;
        const keysToStrings = keys.map((key) => key.toString());
        const entityIndex: Entity | string =
            keys.length === 1 ? keys[0].toString() : getEntityIdFromKeys(keys);

        try {
            const modelValue = await this.client.getModelValue(
                componentName! as string,
                keysToStrings
            );
            setComponent(
                model,
                entityIndex as Entity,
                convertValues(model.schema, modelValue) as ComponentValue<S>
            );
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    }

    private subscribeToModel(modelEntry: ModelEntry<S>): void {
        this.client.onSyncEntityChange(
            {
                model: modelEntry.model.metadata?.name! as string,
                keys: modelEntry.keys.map((k) => k.toString()),
            },
            () => this.setModelValue(modelEntry)
        );
    }
}
