import { bench, describe, afterAll } from "vitest";
import {
    createBenchmarkGrpcClient,
    createBenchmarkToriiClient,
    generateTestQuery,
} from "./setup";
import { ToriiGrpcClientEffect } from "../torii-client-effect";
import type { ClientConfig } from "@dojoengine/torii-wasm";

function createBenchmarkEffectClient(): ToriiGrpcClientEffect {
    const config: ClientConfig = {
        toriiUrl: "http://localhost:8080",
        worldAddress:
            "0x0248f59aeb5c6a086409dc1ec588f0f5346b29960e7e64d10c133bcc85ba7244",
    };
    return new ToriiGrpcClientEffect(config);
}

describe("Effect Schema vs Manual Transformation Benchmark", async () => {
    const grpcClient = createBenchmarkGrpcClient();
    const effectClient = createBenchmarkEffectClient();
    const toriiClient = await createBenchmarkToriiClient();

    describe("Single Entity Retrieval", () => {
        const query = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            1
        );

        bench("Manual Transformation (gRPC-Web)", async () => {
            try {
                await grpcClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema Transformation", async () => {
            try {
                await effectClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("torii-wasm (baseline)", async () => {
            try {
                await toriiClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Batch Entity Retrieval (100 entities)", () => {
        const query = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            100
        );

        bench("Manual Transformation (gRPC-Web)", async () => {
            try {
                await grpcClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema Transformation", async () => {
            try {
                await effectClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("torii-wasm (baseline)", async () => {
            try {
                await toriiClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Large Batch (1000 entities)", () => {
        const query = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            1000
        );

        bench("Manual Transformation (gRPC-Web)", async () => {
            try {
                await grpcClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema Transformation", async () => {
            try {
                await effectClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("torii-wasm (baseline)", async () => {
            try {
                await toriiClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Transaction Queries", () => {
        const query = {
            filter: {
                transaction_hashes: [],
                caller_addresses: [],
                contract_addresses: [],
                entrypoints: [],
                model_selectors: [],
                from_block: undefined,
                to_block: undefined,
            },
            pagination: {
                limit: 100,
                cursor: undefined,
                direction: "Forward" as const,
                order_by: [],
            },
        };

        bench("Manual Transformation (gRPC-Web)", async () => {
            try {
                await grpcClient.getTransactions(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema Transformation", async () => {
            try {
                await effectClient.getTransactions(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Token Operations", () => {
        const query = {
            contract_addresses: [],
            token_ids: [],
            pagination: {
                limit: 100,
                cursor: undefined,
                direction: "Forward" as const,
                order_by: [],
            },
        };

        bench("Manual Transformation - Tokens", async () => {
            try {
                await grpcClient.getTokens(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema - Tokens", async () => {
            try {
                await effectClient.getTokens(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Token Balance Operations", () => {
        const query = {
            account_addresses: [],
            contract_addresses: [],
            token_ids: [],
            pagination: {
                limit: 100,
                cursor: undefined,
                direction: "Forward" as const,
                order_by: [],
            },
        };

        bench("Manual Transformation - Token Balances", async () => {
            try {
                await grpcClient.getTokenBalances(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema - Token Balances", async () => {
            try {
                await effectClient.getTokenBalances(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    describe("Complex Nested Models", () => {
        const query = generateTestQuery(
            ["0x0127", "0x0128", "0x0129"],
            [
                "dojo_starter-Moves",
                "dojo_starter-Position",
                "dojo_starter-Player",
                "dojo_starter-Game",
            ],
            [],
            50
        );

        bench("Manual Transformation - Complex", async () => {
            try {
                await grpcClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("Effect Schema - Complex", async () => {
            try {
                await effectClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("torii-wasm - Complex (baseline)", async () => {
            try {
                await toriiClient.getEntities(query);
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    afterAll(() => {
        grpcClient.destroy();
        effectClient.destroy();
    });
});
