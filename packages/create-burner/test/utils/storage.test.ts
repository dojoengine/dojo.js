import { describe, it, expect, vi } from "vitest";
import Storage from "../../src/utils/storage";
import Cookies from "js-cookie";
import { BurnerStorage } from "../../src/types";
import {
    KATANA_PREFUNDED_ADDRESS,
    KATANA_PREFUNDED_PRIVATE_KEY,
    KATANA_CLASS_HASH,
    KATANA_ETH_CONTRACT_ADDRESS,
} from "@dojoengine/core";

vi.mock("js-cookie");

describe("storage", () => {
    it("should return null", async () => {
        Cookies.get = vi.fn().mockReturnValue({});
        expect(Storage.keys()).toStrictEqual([]);
    }),
        it("should return a json", async () => {
            const storageObj: BurnerStorage = {
                KATANA_ETH_CONTRACT_ADDRESS: {
                    privateKey: KATANA_PREFUNDED_PRIVATE_KEY,
                    publicKey: KATANA_PREFUNDED_ADDRESS,
                    deployTx: KATANA_CLASS_HASH,
                    active: true,
                },
            };
            Cookies.get = vi.fn().mockReturnValue(JSON.stringify(storageObj));
            expect(Storage.get("test")).toStrictEqual(storageObj);
        }),
        it("should set successfully", async () => {
            Storage.set("test", 10);
        }),
        it("should remove key", async () => {
            Storage.remove("test");
        }),
        it("should clear all", async () => {
            Storage.clear();
        });
});
