import { describe, expect, it, mock, beforeEach } from "bun:test";
import { BurnerStorage } from "../../src/types";

const mockGet = mock();
const mockSet = mock();
const mockRemove = mock();

mock.module("js-cookie", () => ({
    default: {
        get: mockGet,
        set: mockSet,
        remove: mockRemove,
    },
}));

import Storage from "../../src/utils/storage";

describe("Storage", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockRemove.mockReset();
    });

    it("should return empty keys when no data is present", () => {
        mockGet.mockReturnValue({});
        expect(Storage.keys()).toStrictEqual([]);
    });

    it("should return a parsed JSON object", () => {
        const storageObj: BurnerStorage = {
            KATANA_ETH_CONTRACT_ADDRESS: {
                privateKey: "0x00aa",
                publicKey: "0x00bb",
                deployTx: "0x00cc",
                active: true,
                chainId: "KATANA",
                masterAccount: "0x1234567890123456789012345678901234567890",
            },
        };
        mockGet.mockReturnValue(JSON.stringify(storageObj));
        expect(Storage.get("test")).toStrictEqual(storageObj);
    });

    it("should set storage successfully", () => {
        Storage.set("test", 10);
        expect(mockSet).toHaveBeenCalledWith("test", "10", {
            secure: true,
            sameSite: "strict",
        });
    });

    it("should remove a key successfully", () => {
        Storage.remove("test");
        expect(mockRemove).toHaveBeenCalledWith("test");
    });

    it("should clear all storage successfully", () => {
        mockGet.mockReturnValue({ burners_katana_test: "someValue" });

        Storage.clear();

        expect(mockRemove).toHaveBeenCalledWith("burners_katana_test");
        expect(mockRemove).toHaveBeenCalledTimes(1);
    });
});
