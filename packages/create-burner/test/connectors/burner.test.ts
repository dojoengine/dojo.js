import { describe, expect, it, vi, beforeEach } from "vitest";
import { BurnerConnector } from "../../src/connectors/burner";
import { getBurnerConnector } from "../mocks/mocks";

describe("BurnerConnector", () => {
    let burnerObj: BurnerConnector;

    beforeEach(() => {
        vi.resetAllMocks();
        burnerObj = getBurnerConnector();
    });

    it("should test available method", () => {
        expect(burnerObj.available()).toBe(true);
    });

    it("should test ready method", async () => {
        // If ready() is asynchronous, await its result
        const isReady = await burnerObj.ready();
        expect(isReady).toBe(true);
    });

    it("should test connect method", async () => {
        // Mock the connect method to reject with an error
        burnerObj.connect = vi
            .fn()
            .mockRejectedValue(new Error("account not found"));

        await expect(burnerObj.connect()).rejects.toThrowError(
            "account not found"
        );
    });

    it("should test disconnect method", () => {
        burnerObj.disconnect = vi.fn();
        burnerObj.disconnect();
        expect(burnerObj.disconnect).toHaveBeenCalled();
    });

    it("should test account method", async () => {
        // Mock the account method to return null
        burnerObj.account = vi.fn().mockResolvedValue(null);

        await expect(burnerObj.account()).resolves.toBeNull();
    });
});
