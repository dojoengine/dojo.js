import { describe, test, expect } from "bun:test";

declare const Bun: { nanoseconds: () => number };

import { ToriiGrpcClient } from "../torii-client";
import { makeToriiClient } from "../torii-client-functional";
import type { Query } from "@dojoengine/torii-wasm";

const TORII_URL = process.env.TORII_URL || "http://localhost:8080";
const WORLD_ADDRESS =
    process.env.WORLD_ADDRESS ||
    "0x0000000000000000000000000000000000000000000000000000000000000001";

const TEST_QUERY: Query = {
    clause: undefined,
    no_hashed_keys: true,
    models: [],
    historical: false,
    world_addresses: [],
    pagination: {
        limit: 100,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
    },
};

const benchmark = async (name: string, fn: () => Promise<void>) => {
    const start = Bun.nanoseconds();
    await fn();
    const duration = (Bun.nanoseconds() - start) / 1_000_000;
    console.log(`⏱  ${name}: ${duration.toFixed(2)}ms`);
    return duration;
};

describe("Result Matching", () => {
    test("getEntities returns matching results", async () => {
        const standardClient = new ToriiGrpcClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
            useEffectSchema: false,
        });
        const effectClient = makeToriiClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
        });

        const standardResult = await standardClient.getEntities(TEST_QUERY);
        const effectResult = await effectClient.getEntities(TEST_QUERY);

        expect(standardResult.items.length).toBe(effectResult.items.length);
        expect(JSON.stringify(standardResult)).toBe(
            JSON.stringify(effectResult)
        );

        standardClient.destroy();
        effectClient.destroy();
    });

    test("getAllEntities returns matching results", async () => {
        const standardClient = new ToriiGrpcClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
            useEffectSchema: false,
        });
        const effectClient = makeToriiClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
        });

        const standardResult = await standardClient.getAllEntities(50);
        const effectResult = await effectClient.getAllEntities(50);

        expect(standardResult.items.length).toBe(effectResult.items.length);
        expect(JSON.stringify(standardResult)).toBe(
            JSON.stringify(effectResult)
        );

        standardClient.destroy();
        effectClient.destroy();
    });

    test("getTokens returns matching results", async () => {
        const standardClient = new ToriiGrpcClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
            useEffectSchema: false,
        });
        const effectClient = makeToriiClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
        });

        const tokenQuery = {
            pagination: {
                limit: 50,
                cursor: undefined,
                direction: "Forward" as const,
                order_by: [],
            },
            contract_addresses: [],
            token_ids: [],
            attribute_filters: [],
        };

        const standardResult = await standardClient.getTokens(tokenQuery);
        const effectResult = await effectClient.getTokens(tokenQuery);

        expect(standardResult.items.length).toBe(effectResult.items.length);
        expect(JSON.stringify(standardResult)).toBe(
            JSON.stringify(effectResult)
        );

        standardClient.destroy();
        effectClient.destroy();
    });

    test("getWorldMetadata returns matching results", async () => {
        const standardClient = new ToriiGrpcClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
            useEffectSchema: false,
        });
        const effectClient = makeToriiClient({
            toriiUrl: TORII_URL,
            worldAddress: WORLD_ADDRESS,
        });

        const standardResult = await standardClient.getWorldMetadata();
        const effectResult = await effectClient.getWorldMetadata();

        expect(JSON.stringify(standardResult)).toBe(
            JSON.stringify(effectResult)
        );

        standardClient.destroy();
        effectClient.destroy();
    });
});

describe("Functional Effect Benchmarks", () => {
    describe("Query Operations - Single Query", () => {
        test("standard client - getEntities", async () => {
            await benchmark("standard client - getEntities", async () => {
                const client = new ToriiGrpcClient({
                    toriiUrl: TORII_URL,
                    worldAddress: WORLD_ADDRESS,
                    useEffectSchema: false,
                });

                const result = await client.getEntities(TEST_QUERY);
                expect(result).toBeDefined();
                client.destroy();
            });
        });

        test("effect-functional (pipe) - getEntities", async () => {
            await benchmark(
                "effect-functional (pipe) - getEntities",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    const result = await client.getEntities(TEST_QUERY);
                    expect(result).toBeDefined();
                    client.destroy();
                }
            );
        });
    });

    describe("Query Operations - Sequential", () => {
        test(
            "standard client - 100 sequential queries",
            async () => {
                await benchmark(
                    "standard client - 100 sequential queries",
                    async () => {
                        const client = new ToriiGrpcClient({
                            toriiUrl: TORII_URL,
                            worldAddress: WORLD_ADDRESS,
                            useEffectSchema: false,
                        });

                        for (let i = 0; i < 100; i++) {
                            await client.getEntities(TEST_QUERY);
                        }

                        client.destroy();
                    }
                );
            },
            { timeout: 60000 }
        );

        test(
            "effect-functional (pipe) - 100 sequential queries",
            async () => {
                await benchmark(
                    "effect-functional (pipe) - 100 sequential queries",
                    async () => {
                        const client = makeToriiClient({
                            toriiUrl: TORII_URL,
                            worldAddress: WORLD_ADDRESS,
                        });

                        for (let i = 0; i < 100; i++) {
                            await client.getEntities(TEST_QUERY);
                        }

                        client.destroy();
                    }
                );
            },
            { timeout: 60000 }
        );
    });

    describe("Query Operations - Parallel", () => {
        test("standard client - 10 parallel queries", async () => {
            await benchmark(
                "standard client - 10 parallel queries",
                async () => {
                    const client = new ToriiGrpcClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                        useEffectSchema: false,
                    });

                    const results = await Promise.all(
                        Array.from({ length: 10 }, () =>
                            client.getEntities(TEST_QUERY)
                        )
                    );

                    expect(results).toHaveLength(10);
                    client.destroy();
                }
            );
        });

        test("effect-functional (pipe) - 10 parallel queries", async () => {
            await benchmark(
                "effect-functional (pipe) - 10 parallel queries",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    const results = await Promise.all(
                        Array.from({ length: 10 }, () =>
                            client.getEntities(TEST_QUERY)
                        )
                    );

                    expect(results).toHaveLength(10);
                    client.destroy();
                }
            );
        });
    });

    describe("Mixed Operations", () => {
        test("standard client - mixed operations", async () => {
            await benchmark("standard client - mixed operations", async () => {
                const client = new ToriiGrpcClient({
                    toriiUrl: TORII_URL,
                    worldAddress: WORLD_ADDRESS,
                    useEffectSchema: false,
                });

                const results = await Promise.all([
                    client.getEntities(TEST_QUERY),
                    client.getAllEntities(50),
                    client.getTokens({
                        pagination: {
                            limit: 50,
                            cursor: undefined,
                            direction: "Forward",
                            order_by: [],
                        },
                        contract_addresses: [],
                        token_ids: [],
                        attribute_filters: [],
                    }),
                    client.getWorldMetadata(),
                ]);

                expect(results).toHaveLength(4);
                client.destroy();
            });
        });

        test("effect-functional (pipe) - mixed operations", async () => {
            await benchmark(
                "effect-functional (pipe) - mixed operations",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    const results = await Promise.all([
                        client.getEntities(TEST_QUERY),
                        client.getAllEntities(50),
                        client.getTokens({
                            pagination: {
                                limit: 50,
                                cursor: undefined,
                                direction: "Forward",
                                order_by: [],
                            },
                            contract_addresses: [],
                            token_ids: [],
                            attribute_filters: [],
                        }),
                        client.getWorldMetadata(),
                    ]);

                    expect(results).toHaveLength(4);
                    client.destroy();
                }
            );
        });
    });

    describe("Subscriptions - Creation", () => {
        test("standard client - create subscription", async () => {
            await benchmark(
                "standard client - create subscription",
                async () => {
                    const client = new ToriiGrpcClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                        useEffectSchema: false,
                    });

                    const sub = await client.onEntityUpdated(
                        undefined,
                        null,
                        () => {}
                    );
                    expect(sub).toBeDefined();
                    sub.cancel();
                    client.destroy();
                }
            );
        });

        test("effect-functional (pipe) - create subscription", async () => {
            await benchmark(
                "effect-functional (pipe) - create subscription",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    const sub = await client.onEntityUpdated(
                        undefined,
                        null,
                        () => {}
                    );
                    expect(sub).toBeDefined();
                    sub.cancel();
                    client.destroy();
                }
            );
        });
    });

    describe("Subscriptions - Batch", () => {
        test("standard client - 100 subscriptions", async () => {
            await benchmark("standard client - 100 subscriptions", async () => {
                const client = new ToriiGrpcClient({
                    toriiUrl: TORII_URL,
                    worldAddress: WORLD_ADDRESS,
                    useEffectSchema: false,
                });

                const subscriptions = [];
                for (let i = 0; i < 100; i++) {
                    const sub = await client.onEntityUpdated(
                        undefined,
                        null,
                        () => {}
                    );
                    subscriptions.push(sub);
                }

                expect(subscriptions).toHaveLength(100);
                subscriptions.forEach((sub) => sub.cancel());
                client.destroy();
            });
        });

        test("effect-functional (pipe) - 100 subscriptions", async () => {
            await benchmark(
                "effect-functional (pipe) - 100 subscriptions",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    const subscriptions = [];
                    for (let i = 0; i < 100; i++) {
                        const sub = await client.onEntityUpdated(
                            undefined,
                            null,
                            () => {}
                        );
                        subscriptions.push(sub);
                    }

                    expect(subscriptions).toHaveLength(100);
                    subscriptions.forEach((sub) => sub.cancel());
                    client.destroy();
                }
            );
        });
    });

    describe("Error Handling", () => {
        test("standard client - handle failed request", async () => {
            await benchmark(
                "standard client - handle failed request",
                async () => {
                    const client = new ToriiGrpcClient({
                        toriiUrl: "http://invalid-url:9999",
                        worldAddress: WORLD_ADDRESS,
                        useEffectSchema: false,
                        autoReconnect: false,
                    });

                    let errorCaught = false;
                    try {
                        await client.getEntities(TEST_QUERY);
                    } catch (error) {
                        errorCaught = true;
                    }

                    expect(errorCaught).toBe(true);
                    client.destroy();
                }
            );
        });

        test("effect-functional (pipe) - handle failed request", async () => {
            await benchmark(
                "effect-functional (pipe) - handle failed request",
                async () => {
                    const client = makeToriiClient({
                        toriiUrl: "http://invalid-url:9999",
                        worldAddress: WORLD_ADDRESS,
                        autoReconnect: false,
                    });

                    let errorCaught = false;
                    try {
                        await client.getEntities(TEST_QUERY);
                    } catch (error) {
                        errorCaught = true;
                    }

                    expect(errorCaught).toBe(true);
                    client.destroy();
                }
            );
        });
    });

    describe("Memory Overhead", () => {
        test("standard client - memory baseline", async () => {
            await benchmark("standard client - memory baseline", async () => {
                if (global.gc) {
                    global.gc();
                }

                const before = process.memoryUsage();

                const client = new ToriiGrpcClient({
                    toriiUrl: TORII_URL,
                    worldAddress: WORLD_ADDRESS,
                    useEffectSchema: false,
                });

                await client.getEntities(TEST_QUERY);

                const after = process.memoryUsage();

                console.log("Standard Client Memory:", {
                    heapUsed: `${((after.heapUsed - before.heapUsed) / 1024 / 1024).toFixed(2)} MB`,
                    external: `${((after.external - before.external) / 1024 / 1024).toFixed(2)} MB`,
                });

                client.destroy();
            });
        });

        test("effect-functional (pipe) - memory overhead", async () => {
            await benchmark(
                "effect-functional (pipe) - memory overhead",
                async () => {
                    if (global.gc) {
                        global.gc();
                    }

                    const before = process.memoryUsage();

                    const client = makeToriiClient({
                        toriiUrl: TORII_URL,
                        worldAddress: WORLD_ADDRESS,
                    });

                    await client.getEntities(TEST_QUERY);

                    const after = process.memoryUsage();

                    console.log("Effect-Functional (Pipe) Memory:", {
                        heapUsed: `${((after.heapUsed - before.heapUsed) / 1024 / 1024).toFixed(2)} MB`,
                        external: `${((after.external - before.external) / 1024 / 1024).toFixed(2)} MB`,
                    });

                    client.destroy();
                }
            );
        });
    });

    describe("Pipe Composition Overhead", () => {
        test(
            "standard client - 1000 queries (direct)",
            async () => {
                await benchmark(
                    "standard client - 1000 queries (direct)",
                    async () => {
                        const client = new ToriiGrpcClient({
                            toriiUrl: TORII_URL,
                            worldAddress: WORLD_ADDRESS,
                            useEffectSchema: false,
                        });

                        for (let i = 0; i < 1000; i++) {
                            await client.getEntities(TEST_QUERY);
                        }

                        client.destroy();
                    }
                );
            },
            { timeout: 180000 }
        );

        test(
            "effect-functional (pipe) - 1000 queries (pipe)",
            async () => {
                await benchmark(
                    "effect-functional (pipe) - 1000 queries (pipe)",
                    async () => {
                        const client = makeToriiClient({
                            toriiUrl: TORII_URL,
                            worldAddress: WORLD_ADDRESS,
                        });

                        for (let i = 0; i < 1000; i++) {
                            await client.getEntities(TEST_QUERY);
                        }

                        client.destroy();
                    }
                );
            },
            { timeout: 180000 }
        );
    });
});
