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

type KeyType = any; // Replace 'any' with your specific type for keys

type ModelEntry<S extends Schema> = {
    component: Component<S, Metadata, undefined>;
    keys: KeyType[];
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
        const { component, keys } = modelEntry;
        const componentName = component.metadata?.name;
        const keysToStrings = keys.map((key) => key.toString());
        const entityIndex: Entity | string =
            keys.length === 1 ? keys[0].toString() : getEntityIdFromKeys(keys);

        try {
            const modelValue = await this.client.getModelValue(
                componentName! as string,
                keysToStrings
            );
            setComponent(
                component,
                entityIndex as Entity,
                convertValues(component.schema, modelValue) as ComponentValue<S>
            );
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    }

    private subscribeToModel(modelEntry: ModelEntry<S>): void {
        this.client.onSyncEntityChange(
            {
                model: modelEntry.component.metadata?.name! as string,
                keys: modelEntry.keys.map((k) => k.toString()),
            },
            () => this.setModelValue(modelEntry)
        );
    }
}
