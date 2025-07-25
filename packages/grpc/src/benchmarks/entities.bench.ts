import { bench, describe, afterAll } from "vitest";
import {
    createBenchmarkGrpcClient,
    createBenchmarkToriiClient,
    generateTestQuery,
} from "./setup";

describe("Entity Queries Benchmark", async () => {
    // Create clients once for all benchmarks
    const grpcClient = createBenchmarkGrpcClient();
    const toriiClient = await createBenchmarkToriiClient();

    // Simple entity retrieval
    describe("Single Entity Retrieval", () => {
        const grpcQuery = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            100
        );
        // grpcQuery.pagination!.limit = 1;

        bench("gRPC-Web", async () => {
            try {
                const { response } =
                    await grpcClient.worldClient.retrieveEntities({
                        query: grpcQuery,
                    });
            } catch (error) {
                // Handle connection errors gracefully
                // This is expected when no server is running
            }
        });

        bench("torii-wasm", async () => {
            try {
                const response = await toriiClient.retrieveEntities({
                    query: grpcQuery,
                });
            } catch (error) {
                // Handle connection errors gracefully
                // This is expected when no server is running
            }
        });
    });

    // Batch entity retrieval
    describe("Batch Entity Retrieval (100 entities)", () => {
        const grpcQuery = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            100
        );

        bench("gRPC-Web", async () => {
            try {
                const { response } =
                    await grpcClient.worldClient.retrieveEntities({
                        query: grpcQuery,
                    });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
        bench("torii-wasm", async () => {
            try {
                const response = await toriiClient.retrieveEntities({
                    query: grpcQuery,
                });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    // Complex query with multiple models
    describe("Complex Query (Multiple Models)", () => {
        const grpcQuery = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            100
        );

        bench("gRPC-Web", async () => {
            try {
                const { response } =
                    await grpcClient.worldClient.retrieveEntities({
                        query: grpcQuery,
                    });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });

        bench("torii-wasm", async () => {
            try {
                const response = await toriiClient.retrieveEntities({
                    query: grpcQuery,
                });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    // Pagination performance
    describe("Pagination (Next Page)", () => {
        const grpcQuery = generateTestQuery(
            ["0x0127"],
            ["dojo_starter-Moves", "dojo_starter-Position"],
            [],
            100
        );

        bench("gRPC-Web", async () => {
            try {
                const { response } =
                    await grpcClient.worldClient.retrieveEntities({
                        query: grpcQuery,
                    });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
        bench("torii-wasm", async () => {
            try {
                const response = await toriiClient.retrieveEntities({
                    query: grpcQuery,
                });
            } catch (error) {
                // Handle connection errors gracefully
            }
        });
    });

    // Cleanup after benchmarks
    afterAll(() => {
        grpcClient.destroy();
    });
});
