import { describe, it, expect, vi } from "vitest";
import Storage from "../../src/utils/storage";
import Cookies from "js-cookie";

vi.mock("js-cookie");

describe("storage", () => {
    it("should return null", async () => {
        Cookies.get = vi.fn().mockReturnValue({});
        expect(Storage.keys()).toStrictEqual([]);
    }),
        it("should return a json", async () => {
            const jsonObj = '{ "myString": "string", "myNumber": 4 }';
            Cookies.get = vi.fn().mockReturnValue(jsonObj);
            expect(Storage.get("test")).toStrictEqual(JSON.parse(jsonObj));
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
