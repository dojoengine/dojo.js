import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    Component,
    Entity,
    Metadata,
    Schema,
    Type,
    setComponent,
} from "@dojoengine/recs";
import { useEffect, useMemo } from "react";
import { Client } from "@dojoengine/torii-client";
// import { parseComponent } from "./utils";

export function useSync<S extends Schema>(
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

    useEffect(() => {
        let isMounted = true;

        const fetchAndSetModelValue = async () => {
            const values = await client.getModelValue(
                componentName as string,
                keys_to_strings
            );

            try {
                if (isMounted) {
                    console.log(
                        "convertValues",
                        convertValues(component.schema, values)
                    );

                    setComponent(
                        component,
                        entityIndex as Entity,
                        convertValues(component.schema, values) as any
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

export function convertValues(schema: any, values: any) {
    return Object.keys(schema).reduce((acc, key) => {
        const schemaType = schema[key];
        const value = values[key];

        // If the schema type is an object, and the corresponding value is also an object,
        // recursively call convertValues
        if (
            typeof schemaType === "object" &&
            value &&
            typeof value === "object"
        ) {
            // @ts-ignore
            acc[key] = convertValues(schemaType, value);
        } else {
            // Otherwise, convert the value based on the schema type
            // @ts-ignore
            acc[key] =
                schemaType === Type.BigInt ? BigInt(value) : Number(value);
        }
        return acc;
    }, {});
}
