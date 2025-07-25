import { bench, describe } from "vitest";
import {
    createBenchmarkGrpcClient,
    createBenchmarkToriiClient,
    generateTestQuery,
} from "./setup";
import { PaginationDirection, PatternMatching } from "../generated/types";

describe("Integration Benchmark - Real-world Scenarios", () => {
    describe("Complete Query Lifecycle", () => {
        const testQuery = {
            clause: {
                clause_type: {
                    oneofKind: "keys" as const,
                    keys: {
                        keys: [],
                        pattern_matching: PatternMatching.FixedLen,
                        models: ["dojo_starter-Position"],
                    },
                },
            },
            no_hashed_keys: false,
            models: [],
            pagination: {
                cursor: "",
                limit: 10,
                direction: PaginationDirection.FORWARD,
                order_by: [],
            },
            historical: false,
        };
        const testQueryTorii = generateTestQuery(
            [],
            ["dojo_starter-Position"],
            [],
            10
        );
        bench("gRPC-Web full lifecycle", async () => {
            // 1. Create client
            const client = createBenchmarkGrpcClient();

            try {
                // 3. Query entities
                const { response } = await client.worldClient.retrieveEntities({
                    query: testQuery,
                });

                // 4. Cleanup
                client.destroy();
            } catch (error) {
                console.error("gRPC lifecycle error:", error);
                client.destroy();
            }
        });

        bench("torii-wasm full lifecycle", async () => {
            // 1. Create client
            const client = await createBenchmarkToriiClient();

            try {
                const response = await client.getEntities(testQueryTorii);
                const items = response.items;

                // 4. Cleanup
                client.free();
            } catch (error) {
                console.error("torii-wasm lifecycle error:", error);
                client.free();
            }
        });
    });

    describe("Mixed Workload (Query + Subscribe)", () => {
        const testQuery = {
            clause: {
                clause_type: {
                    oneofKind: "keys" as const,
                    keys: {
                        keys: [],
                        pattern_matching: PatternMatching.FixedLen,
                        models: ["dojo_starter-Position"],
                    },
                },
            },
            no_hashed_keys: false,
            models: ["dojo_starter-Position"],
            pagination: {
                cursor: "",
                limit: 50,
                direction: PaginationDirection.FORWARD,
                order_by: [],
            },
            historical: false,
        };
        const testQueryTorii = generateTestQuery(
            [],
            ["dojo_starter-Position"],
            ["dojo_starter-Position"],
            50
        );
        bench("gRPC-Web mixed workload", async () => {
            const client = createBenchmarkGrpcClient();

            try {
                // 1. Initial query
                const { response } = await client.worldClient.retrieveEntities({
                    query: testQuery,
                });

                client.destroy();
            } catch (error) {
                console.error("gRPC mixed workload error:", error);
                client.destroy();
            }
        });

        bench("torii-wasm mixed workload", async () => {
            const client = await createBenchmarkToriiClient();

            try {
                const response = await client.getEntities(testQueryTorii);
                const items = response.items;

                client.free();
            } catch (error) {
                console.error("torii-wasm mixed workload error:", error);
                client.free();
            }
        });
    });

    describe("Error Recovery", () => {
        const testQuery = {
            clause: {
                clause_type: {
                    oneofKind: "keys" as const,
                    keys: {
                        keys: [], // Invalid key size
                        pattern_matching: PatternMatching.FixedLen,
                        models: ["dojo_starter-NonExistentModel"],
                    },
                },
            },
            no_hashed_keys: false,
            models: [],
            pagination: {
                cursor: "",
                limit: 1, // Invalid limit
                direction: PaginationDirection.FORWARD,
                order_by: [],
            },
            historical: false,
        };
        const testQueryTorii = generateTestQuery(
            [],
            ["dojo_starter-NonExistentModel"],
            [],
            1
        );
        bench("gRPC-Web error handling", async () => {
            const client = createBenchmarkGrpcClient();

            try {
                // Attempt invalid query
                const { response } = await client.worldClient.retrieveEntities({
                    query: testQuery,
                });
            } catch (error) {
                // Expected error, measure recovery time
                console.error("gRPC lifecycle error:", error);
                client.destroy();
            } finally {
                client.destroy();
            }
        });

        bench("torii-wasm error handling", async () => {
            const client = await createBenchmarkToriiClient();

            try {
                const response = await client.getEntities(testQueryTorii);
                const items = response.items;
            } catch (error) {
                console.error("torii-wasm mixed workload error:", error);
                client.free();
            } finally {
                client.free();
            }
        });
    });
});
