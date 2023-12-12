import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    ComponentValue,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import { useEffect, useMemo } from "react";
import { Client } from "@dojoengine/torii-client";
import { convertValues } from "./utils";

export function useSubscribeEntityModel<S extends Schema>(
    client: Client,
    component: Component<S, Metadata, undefined>,
    keys: any[]
) {
    const entityIndex = useMemo(() => {
        if (keys.length === 1) return keys[0].toString();
        return getEntityIdFromKeys(keys);
    }, [keys]);

    const componentName = useMemo(
        () => component.metadata?.name,
        [component.metadata?.name]
    );

    const keys_to_strings = useMemo(
        () => keys.map((key) => key.toString()),
        [keys]
    );

    const setModelValue = async () => {
        try {
            setComponent(
                component,
                entityIndex as Entity,
                convertValues(
                    component.schema,
                    await client.getModelValue(
                        componentName as string,
                        keys_to_strings
                    )
                ) as ComponentValue
            );
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    };

    useEffect(() => {
        client.onSyncModelChange(
            { model: componentName as string, keys: keys_to_strings },
            setModelValue
        );
    }, [client]);
}
