import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    ComponentValue,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import { useEffect } from "react";
import { Client } from "@dojoengine/torii-client";
import { convertValues } from "./utils";

export function useSync<S extends Schema>(
    client: Client,
    component: Component<S, Metadata, undefined>,
    keys: any[]
) {
    useEffect(() => {
        let isMounted = true;

        const fetchAndSetModelValue = async () => {
            try {
                if (isMounted) {
                    setComponent(
                        component,
                        getEntityIdFromKeys(keys) as Entity,
                        convertValues(
                            component.schema,
                            await client.getModelValue(
                                component.metadata?.name as string,
                                keys.map((key) => key.toString())
                            )
                        ) as ComponentValue
                    );
                }
            } catch (error) {
                console.error("Failed to fetch or set model value:", error);
            }
        };

        fetchAndSetModelValue();

        return () => {
            isMounted = false;
        };
    }, [client]);

    useEffect(() => {
        const entity = {
            model: component.metadata?.name as string,
            keys: keys.map((key) => key.toString()),
        };

        client.addEntitiesToSync([entity]);

        return () => {
            client.removeEntitiesToSync([entity]).catch((error) => {
                console.error("Failed to remove entities on cleanup", error);
            });
        };
    }, [client]);
}
