import { describe, expect, it, vi, beforeEach } from "vitest";
import Cookies from "js-cookie";
import { BurnerStorage } from "../../src/types";
import Storage from "../../src/utils/storage";

vi.mock("js-cookie");

describe("Storage", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should return empty keys when no data is present", () => {
        Cookies.get = vi.fn().mockReturnValue({});
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
        Cookies.get = vi.fn().mockReturnValue(JSON.stringify(storageObj));
        expect(Storage.get("test")).toStrictEqual(storageObj);
    });

    it("should set storage successfully", () => {
        Storage.set("test", 10);
        expect(Cookies.set).toHaveBeenCalledWith("test", "10", {
            secure: true,
            sameSite: "strict",
        });
    });

    it("should remove a key successfully", () => {
        Storage.remove("test");
        expect(Cookies.remove).toHaveBeenCalledWith("test");
    });

    it("should clear all storage successfully", () => {
        // Mock Cookies.get to return only the burners_katana_test key
        Cookies.get = vi
            .fn()
            .mockReturnValue({ burners_katana_test: "someValue" });

        Storage.clear();

        expect(Cookies.remove).toHaveBeenCalledWith("burners_katana_test");
        expect(Cookies.remove).toHaveBeenCalledTimes(1);
    });
});
