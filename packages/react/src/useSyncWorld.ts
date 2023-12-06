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

export function useSyncWorld<S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[]
) {
    useEffect(() => {
        getEntities(client, components);
    }, [client]);
}

export const getEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[]
) => {
    let cursor = 0;
    let continueFetching = true;

    while (continueFetching) {
        let entities = await client.getEntities(100, cursor);

        for (let key in entities) {
            if (entities.hasOwnProperty(key)) {
                for (let componentName in entities[key]) {
                    if (entities[key].hasOwnProperty(componentName)) {
                        let recsComponent = components[componentName as any];

                        if (recsComponent) {
                            setComponent(
                                recsComponent,
                                key as Entity,
                                convertValues(
                                    recsComponent.schema,
                                    entities[key][componentName]
                                ) as ComponentValue
                            );
                        }
                    }
                }
            }
        }

        if (Object.keys(entities).length < 100) {
            continueFetching = false;
        } else {
            cursor += 100;
        }
    }
};
