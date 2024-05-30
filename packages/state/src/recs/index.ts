import {
    Component,
    ComponentValue,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import { Client } from "@dojoengine/torii-client";
import { convertValues } from "../utils";

export const getSyncEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entities: any[],
    limit: number = 100
) => {
    await getEntities(client, components, limit);
    syncEntities(client, components, entities);
};

export const getEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    limit: number = 100
) => {
    let cursor = 0;
    let continueFetching = true;

    while (continueFetching) {
        const entities = await client.getAllEntities(limit, cursor);

        setEntities(entities, components);

        if (Object.keys(entities).length < limit) {
            continueFetching = false;
        } else {
            cursor += limit;
        }
    }
};

export const syncEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entities: any[]
) => {
    client.onEntityUpdated(entities, (entities: any) => {
        setEntities(entities, components);
    });
};

export const setEntities = async <S extends Schema>(
    entities: any[],
    components: Component<S, Metadata, undefined>[]
) => {
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
};
