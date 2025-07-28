import { createDojoGrpcClient } from "../client";
import type { DojoGrpcClient } from "../client";
import type { Entity, Model, Query } from "../generated/types";
import { PatternMatching } from "../generated/types";
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { ToriiClient } from "@dojoengine/torii-wasm/node";

import ws from "websocket";
import { ToriiGrpcClient } from "../torii-client";

// Those lines are require so that websocket works.
// @ts-ignore
global.Websocket = ws.w3cwebsocket;
// @ts-ignore
global.WorkerGlobalScope = global;

// Benchmark configuration
export const TORII_URL = process.env.TORII_URL || "http://localhost:8080";
export const TORII_GRPC_URL =
    process.env.TORII_GRPC_URL || "http://localhost:8080";
export const WORLD_ADDRESS = process.env.WORLD_ADDRESS || "0x0";

// Test data sizes for benchmarks
export const TEST_SIZES = {
    SMALL: 10,
    MEDIUM: 100,
    LARGE: 1000,
};

// Create a gRPC client for benchmarks
export function createBenchmarkGrpcClient(): ToriiGrpcClient {
    return new ToriiGrpcClient({
        toriiUrl: "http://localhost:8080",
        worldAddress:
            "0x0248f59aeb5c6a086409dc1ec588f0f5346b29960e7e64d10c133bcc85ba7244",
    });
}
export async function createBenchmarkToriiClient(): Promise<ToriiClient> {
    return await new ToriiClient({
        toriiUrl: TORII_GRPC_URL,
        worldAddress: WORLD_ADDRESS,
    });
}

// Generate test entity data
export function generateTestEntities(count: number): Entity[] {
    const entities: Entity[] = [];

    for (let i = 0; i < count; i++) {
        const entity: Entity = {
            hashedKeys: new Uint8Array(32).fill(i % 256),
            models: [
                {
                    name: `TestModel_${i}`,
                    children: [
                        {
                            name: "id",
                            ty: {
                                tyType: {
                                    oneofKind: "primitive" as const,
                                    primitive: {
                                        primitiveType: {
                                            oneofKind: "u32" as const,
                                            u32: i,
                                        },
                                    },
                                },
                            },
                            key: true,
                        },
                        {
                            name: "value",
                            ty: {
                                tyType: {
                                    oneofKind: "primitive" as const,
                                    primitive: {
                                        primitiveType: {
                                            oneofKind: "u64" as const,
                                            u64: BigInt(i * 100),
                                        },
                                    },
                                },
                            },
                            key: false,
                        },
                    ],
                },
            ],
        };
        entities.push(entity);
    }

    return entities;
}

// Generate a test query
export function generateTestQuery(
    keys: string[],
    keys_models: `${string}-${string}`[],
    models: string[],
    limit: number
): Query {
    return new ToriiQueryBuilder()
        .withClause(
            // Querying Moves and Position models that has at least [account.address] as key
            KeysClause(keys_models, keys, "FixedLen").build()
        )
        .includeHashedKeys()
        .withEntityModels(models)
        .withLimit(limit)
        .build();
}

// Utility to measure operation time
export async function measureTime<T>(
    operation: () => Promise<T>
): Promise<{ result: T; time: number }> {
    const start = performance.now();
    const result = await operation();
    const time = performance.now() - start;
    return { result, time };
}

// Utility to run operation multiple times and get average
export async function measureAverage(
    operation: () => Promise<void>,
    iterations: number = 10
): Promise<{ average: number; min: number; max: number }> {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
        const { time } = await measureTime(operation);
        times.push(time);
    }

    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { average, min, max };
}

// Convert bytes to hex string for comparison with torii-wasm
export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
