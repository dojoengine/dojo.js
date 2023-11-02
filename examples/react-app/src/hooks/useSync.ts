import { useDojo } from "../DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@latticexyz/recs";
import { useMemo } from "react";
import { Type as RecsType } from "@latticexyz/recs";

export function useSync<S extends Schema>(
    component: Component<S, Metadata, undefined>,
    keys: any[]
) {
    const {
        setup: {
            network: { torii_client },
        },
    } = useDojo();

    const entityIndex = useMemo(() => {
        return getEntityIdFromKeys(keys);
    }, [keys]);

    const keys_to_strings = keys.map((key) => key.toString());

    const model = component.metadata?.name as string;

    const componentValue = async () => {
        // Fetch values from torii_client
        const values = await torii_client.getModelValue(model, keys_to_strings);

        console.log(values);

        // Create component object from values with schema
        const componentValues = Object.keys(component.schema).reduce(
            (acc, key) => {
                if (key in values) {
                    // Convert value to Number if necessary, adjust based on type
                    const value = values[key];
                    acc[key] =
                        component.schema[key] === RecsType.BigInt
                            ? BigInt(value)
                            : Number(value);
                }
                return acc;
            },
            {}
        );

        console.log(componentValues);

        setComponent(component, entityIndex as Entity, componentValues as any);
    };

    async function syncEntity() {
        if (!torii_client) return;

        await torii_client.addEntitiesToSync([
            { model, keys: keys_to_strings },
        ]);

        await torii_client.onSyncEntityChange(
            { model, keys: keys_to_strings },
            componentValue
        );
    }

    useMemo(() => {
        syncEntity();
    }, [component]);
}
