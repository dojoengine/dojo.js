import { describe, it, expect, beforeEach, vi } from "vitest";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "./burnerManager";

describe("BurnerManager", () => {
    let burnerManager;
    let mockMasterAccount;
    let mockProvider;

    beforeEach(() => {
        mockProvider = new RpcProvider();

        mockMasterAccount = new Account(mockProvider, "0x0", "0x0");

        burnerManager = new BurnerManager({
            masterAccount: mockMasterAccount,
            accountClassHash: "mockClassHash",
            rpcProvider: mockProvider,
        });

        vi.mock("../utils/storage", () => ({
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn(),
            clear: vi.fn(),
        }));
    });

    it("should initialize correctly", () => {
        expect(burnerManager).toBeDefined();
        expect(burnerManager.masterAccount).toBe(mockMasterAccount);
    });

    it("should set and trigger setIsDeploying callback", () => {
        const mockCallback = vi.fn();
        burnerManager.setIsDeployingCallback(mockCallback);
        burnerManager.updateIsDeploying(true);
        expect(mockCallback).toHaveBeenCalledWith(true);
    });
});
