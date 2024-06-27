import { describe, it, expect, vi, beforeEach } from "vitest";
import { DojoProvider } from "../../provider/DojoProvider";
import { RpcProvider, Contract, Account } from "starknet";
import { getContractByName, parseDojoCall } from "../../utils";

// Mock dependencies
vi.mock("starknet");
vi.mock("../../logger/logger");
vi.mock("../../utils");

describe("DojoProvider", () => {
    let provider: DojoProvider;
    const mockManifest = {
        world: {
            address: "0x123",
            abi: [],
        },
    };

    beforeEach(() => {
        provider = new DojoProvider(mockManifest);
    });

    it("should initialize correctly", () => {
        expect(provider).toBeInstanceOf(DojoProvider);
        expect(provider.provider).toBeInstanceOf(RpcProvider);
        expect(provider.contract).toBeInstanceOf(Contract);
    });

    it("should call entity method correctly", async () => {
        const mockResult = [BigInt(1), BigInt(2)];
        vi.spyOn(provider.contract, "call").mockResolvedValue(mockResult);

        const result = await provider.entity(
            "model",
            ["key1", "key2"],
            0,
            0,
            [1, 2]
        );
        expect(result).toEqual(mockResult);
    });

    it("should call entities method correctly", async () => {
        const mockResult = [
            [BigInt(1), BigInt(2)],
            [BigInt(3), BigInt(4)],
        ];
        vi.spyOn(provider.contract, "call").mockResolvedValue(mockResult);

        const result = await provider.entities(
            "model",
            "index",
            ["value1", "value2"],
            2,
            [1, 2]
        );
        expect(result).toEqual(mockResult);
    });

    it("should call model method correctly", async () => {
        const mockResult = BigInt(123);
        vi.spyOn(provider.contract, "call").mockResolvedValue(mockResult);

        const result = await provider.model("modelName");
        expect(result).toEqual(mockResult);
    });

    it("should call uuid method correctly", async () => {
        const mockResult = ["6"];
        vi.spyOn(provider.provider, "callContract").mockResolvedValue(
            mockResult
        );

        const result = await provider.uuid();
        expect(result).toEqual(6);
    });
    it("should handle errors in entity method", async () => {
        const mockError = new Error("Test error");
        vi.spyOn(provider.contract, "call").mockRejectedValue(mockError);
        vi.spyOn(provider.logger, "error");

        await expect(
            provider.entity("model", ["key1"], 0, 0, [1])
        ).rejects.toThrow("Test error");
        expect(provider.logger.error).toHaveBeenCalledWith(
            "Error occured: ",
            mockError
        );
    });

    it("should handle errors in entities method", async () => {
        const mockError = new Error("Test error");
        vi.spyOn(provider.contract, "call").mockRejectedValue(mockError);
        vi.spyOn(provider.logger, "error");

        await expect(
            provider.entities("model", "index", ["value1"], 1, [1])
        ).rejects.toThrow("Test error");
        expect(provider.logger.error).toHaveBeenCalledWith(
            "Error occured: ",
            mockError
        );
    });

    it("should handle errors in model method", async () => {
        const mockError = new Error("Test error");
        vi.spyOn(provider.contract, "call").mockRejectedValue(mockError);
        vi.spyOn(provider.logger, "error");

        await expect(provider.model("modelName")).rejects.toThrow("Test error");
        expect(provider.logger.error).toHaveBeenCalledWith(
            "Error occured: ",
            mockError
        );
    });

    it("should handle errors in uuid method", async () => {
        const mockError = new Error("Test error");
        vi.spyOn(provider.provider, "callContract").mockRejectedValue(
            mockError
        );
        vi.spyOn(provider.logger, "error");

        await expect(provider.uuid()).rejects.toThrow(
            "Failed to fetch uuid: Error: Test error"
        );
        expect(provider.logger.error).toHaveBeenCalledWith(
            "Failed to fetch uuid: Error: Test error"
        );
    });
});
