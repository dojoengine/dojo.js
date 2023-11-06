import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    Entity,
    Metadata,
    Schema,
    Type,
    setComponent,
} from "@latticexyz/recs";
import { useEffect, useMemo } from "react";
import { Client } from "@dojoengine/torii-client";
// import { parseComponent } from "./utils";

export function useSync<S extends Schema>(
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

    useEffect(() => {
        let isMounted = true;

        const fetchAndSetModelValue = async () => {
            const values = await client.getModelValue(
                componentName as string,
                keys_to_strings
            );

            console.log("values", values);
            try {
                const componentValues = Object.keys(component.schema).reduce(
                    (acc: any, key) => {
                        acc[key] =
                            component.schema[key] === Type.BigInt
                                ? BigInt(values[key])
                                : Number(values[key]);
                        return acc;
                    },
                    {}
                );

                if (isMounted) {
                    console.log(componentValues);
                    setComponent(
                        component,
                        entityIndex as Entity,
                        componentValues as any
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
            model: componentName as string,
            keys: keys_to_strings,
        };

        client.addEntitiesToSync([entity]);

        return () => {
            client.removeEntitiesToSync([entity]).catch((error) => {
                console.error("Failed to remove entities on cleanup", error);
            });
        };
    }, [client]);
}
