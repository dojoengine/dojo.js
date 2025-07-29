import type { StarknetDomain } from "starknet";
import { describe, expect, it } from "vitest";
import { generateTypedData } from "../internal/generateTypedData";

// Mock schema type for testing
type TestSchema = {
    test: {
        model: {
            stringField: string;
            numberField: number;
            bigintField: bigint;
        };
    };
};

describe("generateTypedData", () => {
    // Mock SDK config
    const mockConfig = {
        client: {
            toriiUrl: "http://localhost:8080",
            worldAddress: "0x123",
        },
        domain: {
            name: "Test Domain",
            version: "1.0.0",
            chainId: "0x1",
            revision: "1",
        } as StarknetDomain,
    };

    it("should generate typed data with automatic type inference", async () => {
        const typedData = generateTypedData<
            TestSchema,
            TestSchema["test"]["model"]
        >(
            "test-model",
            {
                stringField: "test string",
                numberField: 42,
                bigintField: BigInt(1000),
            },
            mockConfig.domain
        );

        expect(typedData).toEqual({
            types: {
                StarknetDomain: [
                    { name: "name", type: "shortstring" },
                    { name: "version", type: "shortstring" },
                    { name: "chainId", type: "shortstring" },
                    { name: "revision", type: "shortstring" },
                ],
                "test-model": [
                    { name: "stringField", type: "string" },
                    { name: "numberField", type: "felt" },
                    { name: "bigintField", type: "felt" },
                ],
            },
            primaryType: "test-model",
            domain: mockConfig.domain,
            message: {
                stringField: "test string",
                numberField: 42,
                bigintField: BigInt(1000),
            },
        });
    });

    it("should use custom model mapping when provided", async () => {
        const customMapping = [
            { name: "stringField", type: "ContractAddress" },
            { name: "numberField", type: "felt" },
            { name: "bigintField", type: "felt" },
        ];

        const typedData = generateTypedData<
            TestSchema,
            TestSchema["test"]["model"]
        >(
            "test-model",
            {
                stringField: "test string",
                numberField: 42,
                bigintField: BigInt(1000),
            },
            mockConfig.domain,
            customMapping
        );

        expect(typedData).toEqual({
            types: {
                StarknetDomain: [
                    { name: "name", type: "shortstring" },
                    { name: "version", type: "shortstring" },
                    { name: "chainId", type: "shortstring" },
                    { name: "revision", type: "shortstring" },
                ],
                "test-model": customMapping,
            },
            primaryType: "test-model",
            domain: mockConfig.domain,
            message: {
                stringField: "test string",
                numberField: 42,
                bigintField: BigInt(1000),
            },
        });
    });

    it("should use custom domain when provided", async () => {
        const customDomain: StarknetDomain = {
            name: "Custom Domain",
            version: "2.0.0",
            chainId: "0x5",
            revision: "2",
        };

        const typedData = generateTypedData<
            TestSchema,
            TestSchema["test"]["model"]
        >(
            "test-model",
            {
                stringField: "test string",
                numberField: 42,
                bigintField: BigInt(1000),
            },
            customDomain
        );

        expect(typedData.domain).toEqual(customDomain);
    });
});
