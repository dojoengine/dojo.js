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
    components: Component<S, Metadata, undefined>[]
) => {
    await getEntities(client, components);
    syncEntities(client, components);
};

export const getEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[]
) => {
    let cursor = 0;
    let continueFetching = true;

    while (continueFetching) {
        const entities = await client.getEntities({
            limit: 100,
            offset: cursor,
        });

        setEntities(entities, components);

        if (Object.keys(entities).length < 100) {
            continueFetching = false;
        } else {
            cursor += 100;
        }
    }
};

export const syncEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[]
) => {
    client.onEntityUpdated([], (entities: any) =>
        setEntities(entities, components)
    );
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
