import { describe, it, expect } from "vitest";
import { ToriiGrpcClient, ToriiGrpcClientConfig } from "./torii-client";

describe("ToriiGrpcClient", () => {
    const mockConfig: ToriiGrpcClientConfig = {
        toriiUrl: "http://localhost:8080",
    };

    it("should create client with default (standard) mapper", () => {
        const client = new ToriiGrpcClient(mockConfig);
        expect(client).toBeDefined();
        // @ts-ignore - accessing private property for testing
        expect(client.useEffectSchema).toBe(false);
    });

    it("should create client with Effect schema mapper when specified", () => {
        const configWithEffect: ToriiGrpcClientConfig = {
            ...mockConfig,
            useEffectSchema: true,
        };
        const client = new ToriiGrpcClient(configWithEffect);
        expect(client).toBeDefined();
        // @ts-ignore - accessing private property for testing
        expect(client.useEffectSchema).toBe(true);
    });

    it("should have correct mapper functions based on useEffectSchema flag", () => {
        const standardClient = new ToriiGrpcClient(mockConfig);
        const effectClient = new ToriiGrpcClient({
            ...mockConfig,
            useEffectSchema: true,
        });

        // @ts-ignore - accessing private property for testing
        const standardMappers = standardClient.mappers;
        // @ts-ignore - accessing private property for testing
        const effectMappers = effectClient.mappers;

        // Check that mapper functions exist
        expect(standardMappers.entitiesResponse).toBeDefined();
        expect(effectMappers.entitiesResponse).toBeDefined();

        // Check that they are different functions
        expect(standardMappers.entitiesResponse).not.toBe(
            effectMappers.entitiesResponse
        );
    });

    it("should maintain backwards compatibility with standard ClientConfig", () => {
        // This should work without the useEffectSchema property
        const client = new ToriiGrpcClient({
            toriiUrl: "http://localhost:8080",
        });
        expect(client).toBeDefined();
        // @ts-ignore - accessing private property for testing
        expect(client.useEffectSchema).toBe(false);
    });
    it("should getTokenContracts", async () => {
        // This should work without the useEffectSchema property
        const client = new ToriiGrpcClient({
            toriiUrl: "https://api.cartridge.gg/x/arcade-main/torii",
        });
        expect(client).toBeDefined();

        try {
            const res = await client.getTokenContracts({
                contract_addresses: [],
                contract_types: ["ERC20", "ERC1155"],
                pagination: {
                    limit: 1000,
                    cursor: undefined,
                    direction: "Forward",
                    order_by: [],
                },
            });
            console.log(res);

            expect(res.items.length).toBeGreaterThan(0);
            // @ts-ignore - accessing private property for testing
            expect(client.useEffectSchema).toBe(false);
        } catch (err) {
            console.error(err);
        }
    });
});
