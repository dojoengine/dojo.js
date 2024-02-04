import { describe, it, afterEach, expect, vi } from "vitest";
import { getBurnerManager } from "../mocks/mocks";

describe("BurnerManager", () => {
    const burnerManager = getBurnerManager();

    it("should init burner account", async () => {
        burnerManager.init();
    }),
        it("should update SsDeploying", async () => {
            burnerManager.updateIsDeploying(false);
            expect(burnerManager.isDeploying).toBeFalsy();
        }),
        it("should list burner accounts", async () => {
            expect(burnerManager.list()).toStrictEqual([]);
        }),
        it("should select burner accounts", async () => {
            expect(() => burnerManager.select("test")).toThrowError(
                "burner not found"
            );
        }),
        it("should get burner accounts", async () => {
            expect(() => burnerManager.get("test")).toThrowError(
                "burner not found"
            );
        }),
        it("should create burner accounts", async () => {
            expect(burnerManager.create()).rejects.toThrowError();
        }),
        it("should copy burner to clipboard", async () => {
            expect(
                burnerManager.copyBurnersToClipboard()
            ).rejects.toThrowError();
        }),
        it("should set burner from clipboard", async () => {
            expect(
                burnerManager.setBurnersFromClipboard()
            ).rejects.toThrowError();
        });
});
