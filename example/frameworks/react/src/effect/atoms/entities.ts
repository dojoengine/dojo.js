import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Console, Schedule, Duration } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import type { Clause, Entities } from "@dojoengine/torii-client";
import {
    ToriiGrpcClient,
    ToriiGrpcClientError,
    makeToriiLayer,
} from "../services/torii";
import { SchemaType, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
    addAddressPadding,
} from "starknet";
import type * as torii from "@dojoengine/torii-wasm/types";
import manifest from "../../../../../../worlds/dojo-starter/manifest_dev.json" with {
    type: "json",
};

type EntityUpdate = {
    hashed_keys: string;
    models: Record<string, torii.Ty>;
};

type ParsedEntity = {
    entityId: string;
    models: Record<string, Record<string, unknown>>;
};

function parsePrimitive(value: torii.Ty): unknown {
    switch (value.type_name) {
        case "u64":
        case "i64":
            return Number(value.value as string);
        case "u128":
        case "i128":
        case "u256":
            return BigInt(value.value as string);
        case "u8":
        case "u16":
        case "u32":
        case "i8":
        case "i16":
        case "i32":
        case "bool":
        case "ContractAddress":
        case "ClassHash":
        case "felt252":
        case "EthAddress":
        default:
            return value.value;
    }
}

function parseStruct(
    struct: Record<string, torii.Ty> | Map<string, torii.Ty>
): unknown {
    const entries =
        struct instanceof Map
            ? Array.from(struct.entries())
            : Object.entries(struct);
    return Object.fromEntries(
        entries.map(([key, value]) => [key, parseValue(value)])
    );
}

function parseCustomEnum(value: torii.Ty): CairoCustomEnum | string {
    if ((value.value as torii.EnumValue).value.type === "tuple") {
        return (value.value as torii.EnumValue).option;
    }
    return new CairoCustomEnum({
        [(value.value as torii.EnumValue).option]: parseValue(
            (value.value as torii.EnumValue).value
        ),
    });
}

function parseValue(value: torii.Ty): unknown {
    switch (value.type) {
        case "primitive":
            return parsePrimitive(value);
        case "struct":
            return parseStruct(
                value.value as Record<string, torii.Ty> | Map<string, torii.Ty>
            );
        case "enum":
            if ("Some" === (value.value as torii.EnumValue).option) {
                return new CairoOption(
                    CairoOptionVariant.Some,
                    parseValue((value.value as torii.EnumValue).value)
                );
            }
            if ("None" === (value.value as torii.EnumValue).option) {
                return new CairoOption(CairoOptionVariant.None);
            }
            return parseCustomEnum(value);
        case "tuple":
        case "array":
            return (value.value as torii.Ty[]).map(parseValue);
        default:
            return value.value;
    }
}

const toriiRuntime = Atom.runtime(
    makeToriiLayer(
        { manifest },
        { autoReconnect: false, maxReconnectAttempts: 5 }
    )
);

export function createEntityUpdatesAtom(
    clause: Clause | null | undefined,
    worldAddresses: string[] | null | undefined = null
) {
    return toriiRuntime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { client } = yield* ToriiGrpcClient;

                    const stream = Stream.asyncPush<
                        {
                            entity: unknown;
                            subscriptionId: bigint;
                        },
                        ToriiGrpcClientError
                    >((emit) =>
                        Effect.acquireRelease(
                            Effect.tryPromise({
                                try: () =>
                                    client.onEntityUpdated(
                                        clause,
                                        worldAddresses,
                                        (
                                            entity: unknown,
                                            subscriptionId: bigint
                                        ) => {
                                            emit.single({
                                                entity,
                                                subscriptionId,
                                            });
                                        },
                                        (error) => {
                                            emit.fail(
                                                new ToriiGrpcClientError({
                                                    cause: error,
                                                    message:
                                                        "Entity subscription error",
                                                })
                                            );
                                        }
                                    ),
                                catch: (error) =>
                                    new ToriiGrpcClientError({
                                        cause: error,
                                        message:
                                            "Failed to subscribe to entities",
                                    }),
                            }),
                            (subscription) =>
                                Effect.sync(() => subscription.cancel())
                        )
                    );

                    return stream.pipe(
                        Stream.scan(
                            new Map<string, EntityUpdate>(),
                            (entities, data) => {
                                const e = data.entity as EntityUpdate;
                                const newMap = new Map(entities);
                                newMap.set(e.hashed_keys, e);
                                return newMap;
                            }
                        ),
                        Stream.retry(Schedule.exponential("1 second", 2))
                    );
                })
            ),
            { initialValue: new Map<string, EntityUpdate>() }
        )
        .pipe(Atom.keepAlive);
}

const parseEntity = (entity: EntityUpdate) =>
    Effect.sync(() => {
        const entityId = addAddressPadding(entity.hashed_keys);
        const parsedEntity: ParsedEntity = {
            entityId,
            models: {},
        };

        for (const modelName in entity.models) {
            const [schemaKey, modelKey] = modelName.split("-");
            if (!schemaKey || !modelKey) continue;

            if (!parsedEntity.models[schemaKey]) {
                parsedEntity.models[schemaKey] = {};
            }

            (parsedEntity.models[schemaKey] as Record<string, unknown>)[
                modelKey
            ] = parseStruct(
                entity.models[modelName] as unknown as Record<string, torii.Ty>
            );
        }

        return parsedEntity;
    });

const parseEntities = (entities: Entities) =>
    Effect.forEach(entities.items as unknown as EntityUpdate[], parseEntity, {
        concurrency: "unbounded",
    }).pipe(
        Effect.map((items) => ({ items, next_cursor: entities.next_cursor }))
    );

export function createEntityQueryAtom(query: ToriiQueryBuilder<SchemaType>) {
    return toriiRuntime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: BaseToriiGrpcClient) =>
                    client.getEntities(query.build())
                );
            }).pipe(Effect.flatMap(parseEntities))
        )
        .pipe(Atom.keepAlive);
}
