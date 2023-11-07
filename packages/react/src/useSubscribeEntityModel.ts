import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import { useEffect, useMemo } from "react";
import { Client } from "@dojoengine/torii-client";
import { parseComponent } from "./utils";

export function useSubscribeEntityModel<S extends Schema>(
    client: Client,
    component: Component<S, Metadata, undefined>,
    keys: any[]
) {
    const entityIndex = useMemo(() => {
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
                parseComponent(
                    await client.getModelValue(
                        componentName as string,
                        keys_to_strings
                    )
                ) as any
            );
        } catch (error) {
            console.error("Failed to fetch or set model value:", error);
        }
    };

    useEffect(() => {
        console.log("sync", componentName, keys_to_strings);
        client.onSyncEntityChange(
            { model: componentName as string, keys: keys_to_strings },
            setModelValue
        );
    }, [client]);
}
