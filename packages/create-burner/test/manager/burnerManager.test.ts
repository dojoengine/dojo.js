import { shortString } from "starknet";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Storage from "../../src/utils/storage";
import { getBurnerManager } from "../mocks/mocks"; // Adjust the path as necessary

// Explicitly mock the 'starknet' module
vi.mock("starknet", async () => {
    const actual: any = await vi.importActual("starknet");

    // Extend the actual Account class and override methods as needed
    class MockAccount extends actual.Account {
        getTransactionReceipt = vi.fn().mockResolvedValue({ status: "mocked" });
    }

    // Extend the actual Provider class and override methods as needed
    class MockRpcProvider extends actual.RpcProvider {
        getChainId = vi
            .fn()
            .mockResolvedValue(shortString.encodeShortString("katana_test"));
    }

    // Return the modified module with the MockAccount
    return {
        ...actual,
        Account: MockAccount,
        RpcProvider: MockRpcProvider,
    };
});

// Mock the Storage module
vi.mock("../../src/utils/storage", () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        clear: vi.fn(),
    },
}));

describe("BurnerManager - init method", () => {
    beforeEach(() => {
        // Reset mocks to default behavior before each test
        vi.resetAllMocks();

        // Default mock for Storage.get to return null, simulating no stored accounts
        Storage.get.mockImplementation(() => null);
    });

    it("handles no burner accounts", async () => {
        const burnerManager = getBurnerManager();
        await burnerManager.init();

        // Verify Storage.get was called to attempt loading accounts
        expect(Storage.get).toHaveBeenCalledWith("burners_katana_test");
        expect(burnerManager.getActiveAccount()).toBeNull();
    });

    it("loads and activates an existing burner account", async () => {
        // Setup Storage.get to return a mock burner account
        Storage.get.mockImplementation((key: string) => {
            if (key === "burners_katana_test") {
                return {
                    account1: {
                        privateKey: "0x00aa",
                        publicKey: "0x00bb",
                        deployTx: "0x00cc",
                        active: true,
                    },
                };
            }
            return null;
        });

        const burnerManager = getBurnerManager();

        // Mock getTransactionReceipt to return null, simulating an undeployed account
        burnerManager.masterAccount.getTransactionReceipt.mockResolvedValue(
            "receipt not null"
        );

        await burnerManager.init();

        expect(Storage.get).toHaveBeenCalledWith("burners_katana_test");

        // Verify that an account is set as active - this assumes you have a way to check the active account
        // The specifics of this assertion might change based on how you track the active account
        expect(burnerManager.getActiveAccount()).not.toBeNull();
        expect(burnerManager.getActiveAccount()?.address).toBe("account1");
    });

    it("handles storage with one undeployed burner account", async () => {
        // Mock Storage.get to return one burner account that is not deployed
        Storage.get.mockImplementation((key) => {
            if (key === "burners") {
                return {
                    account1: {
                        privateKey: "0x00aa",
                        publicKey: "0x00bb",
                        deployTx: "0x00cc",
                        active: true,
                    },
                };
            }
            return null;
        });

        const burnerManager = getBurnerManager();
        // Mock getTransactionReceipt to return null, simulating an undeployed account
        burnerManager.masterAccount.getTransactionReceipt.mockResolvedValue(
            null
        );
        await burnerManager.init();

        expect(burnerManager.account).toBeNull();
    });
});

describe("BurnerManager", () => {
    let burnerManager;

    beforeEach(() => {
        // Reset mocks to default behavior before each test
        vi.resetAllMocks();

        burnerManager = getBurnerManager();
    });

    it("should update isDeploying", async () => {
        burnerManager.updateIsDeploying(false);
        expect(burnerManager.isDeploying).toBeFalsy();
    });

    it("should list burner accounts", async () => {
        expect(burnerManager.list()).toStrictEqual([]);
    });

    it("should select burner accounts", async () => {
        expect(() => burnerManager.select("test")).toThrowError(
            "burner not found"
        );
    });

    it("should get burner accounts", async () => {
        expect(() => burnerManager.get("test")).toThrowError(
            "burner not found"
        );
    });

    it("should create burner accounts", async () => {
        expect(burnerManager.create()).rejects.toThrowError();
    });

    it("should copy burner to clipboard", async () => {
        expect(burnerManager.copyBurnersToClipboard()).rejects.toThrowError();
    });

    it("should set burner from clipboard", async () => {
        expect(burnerManager.setBurnersFromClipboard()).rejects.toThrowError();
    });
});
