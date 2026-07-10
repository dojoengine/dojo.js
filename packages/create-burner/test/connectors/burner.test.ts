import { describe, expect, it, vi, beforeEach } from "vitest";
import {
    StandardConnect,
    StandardDisconnect,
    StarknetWalletApi,
} from "@starknet-io/get-starknet-core";
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

    it("gets the chain id through the account provider", async () => {
        const account = await burnerObj.account();
        const getChainId = vi
            .spyOn(account.provider, "getChainId")
            .mockResolvedValue("KATANA");

        await expect(burnerObj.chainId()).resolves.toBeTypeOf("bigint");
        expect(getChainId).toHaveBeenCalledOnce();
    });

    it("exposes a Starknet wallet-standard feature set", async () => {
        const account = await burnerObj.account();
        vi.spyOn(account.provider, "getChainId").mockResolvedValue("KATANA");

        const connected = await burnerObj.features[StandardConnect].connect({
            silent: false,
        });

        expect(burnerObj.features[StarknetWalletApi].id).toBe("Burner Account");
        expect(connected.accounts).toHaveLength(1);
        expect(connected.accounts[0]).toMatchObject({
            address: account.address,
            chains: ["starknet:0x4b4154414e41"],
        });

        await burnerObj.features[StandardDisconnect].disconnect();
        expect(burnerObj.accounts).toEqual([]);
    });
});
