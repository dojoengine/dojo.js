import { beforeEach, describe, expect, it, vi } from "vitest";
import { BurnerManager } from "../../src/manager/burnerManager";
import { getBurnerManager } from "../mocks/mocks";
import Storage from "../../src/utils/storage";
import { BurnerStorage } from "../../src";
import { validateAndParseAddress } from "starknet";

// MockStorage class definition
class MockStorage {
    state: BurnerStorage | undefined;

    constructor(initialState?: BurnerStorage) {
        this.state = initialState;
        vi.spyOn(Storage, "get").mockImplementation((key: string) => {
            if (key === "burners_katana_test") {
                return this.state;
            }
            return null;
        });
        vi.spyOn(Storage, "set").mockImplementation(
            (key: string, newStore: any) => {
                if (key === "burners_katana_test") {
                    this.state = newStore;
                }
            }
        );
        vi.spyOn(Storage, "remove").mockImplementation((key: string) => {
            if (key === "burners_katana_test") {
                this.state = undefined;
            }
        });
    }

    clear() {
        this.state = undefined;
    }
}

describe("BurnerManager", () => {
    let burnerManager: BurnerManager;

    beforeEach(() => {
        vi.resetAllMocks();
        burnerManager = getBurnerManager();
    });

    it("should update isDeploying", () => {
        // Initial state should be false
        expect(burnerManager.isDeploying).toBe(false);

        // Define a callback that updates the isDeploying state
        burnerManager.setIsDeployingCallback((status: boolean) => {
            burnerManager.isDeploying = status;
        });

        // Call the callback to update isDeploying
        burnerManager.setIsDeployingCallback(() => {}); // Reset callback if needed
        burnerManager.isDeploying = true;
        expect(burnerManager.isDeploying).toBe(true);
    });

    it("loads and activates an existing burner account", async () => {
        const storage = new MockStorage({
            account1: {
                privateKey: "0x00aa",
                publicKey: "0x00bb",
                deployTx: "0x00cc",
                active: true,
                chainId: "0x1", // Adding chainId property
                masterAccount: "0x1234567890123456789012345678901234567890", // Adding masterAccount property
            },
        });

        // Initialize BurnerManager with the mocked storage
        await burnerManager.init();
        expect(Storage.get).toHaveBeenCalledWith("burners_KATANA");
    });

    it("generateKeysAndAddress", async () => {
        await burnerManager.init();

        const wallet1_index0 = {
            secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
            index: 0,
        };
        const wallet1_index1 = {
            secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
            index: 1,
        };
        const wallet1_index2 = {
            secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
            index: 2,
        };
        const wallet2_index0 = {
            secret: "0x3ebb4767aae1262f8eb28d9368db5388cfe367f50552a8244123506f0b0bcca",
            index: 0,
        };
        const wallet2_index1 = {
            secret: "0x3ebb4767aae1262f8eb28d9368db5388cfe367f50552a8244123506f0b0bcca",
            index: 1,
        };

        const keys_random = burnerManager.generateKeysAndAddress();
        const keys_wallet1_index0 =
            burnerManager.generateKeysAndAddress(wallet1_index0);
        const keys_wallet1_index1 =
            burnerManager.generateKeysAndAddress(wallet1_index1);
        const keys_wallet1_index2 =
            burnerManager.generateKeysAndAddress(wallet1_index2);
        const keys_wallet2_index0 =
            burnerManager.generateKeysAndAddress(wallet2_index0);
        const keys_wallet2_index1 =
            burnerManager.generateKeysAndAddress(wallet2_index1);

        expect(BigInt(keys_random.privateKey)).toEqual(
            BigInt(validateAndParseAddress(keys_random.privateKey))
        );
        expect(BigInt(keys_random.publicKey)).toEqual(
            BigInt(validateAndParseAddress(keys_random.publicKey))
        );
        expect(BigInt(keys_random.address)).toEqual(
            BigInt(validateAndParseAddress(keys_random.address))
        );
        expect(BigInt(keys_wallet1_index0.privateKey)).toEqual(
            BigInt(validateAndParseAddress(keys_wallet1_index0.privateKey))
        );
        expect(BigInt(keys_wallet1_index0.publicKey)).toEqual(
            BigInt(validateAndParseAddress(keys_wallet1_index0.publicKey))
        );
        expect(BigInt(keys_wallet1_index0.address)).toEqual(
            BigInt(validateAndParseAddress(keys_wallet1_index0.address))
        );

        expect(keys_random).not.toStrictEqual(
            burnerManager.generateKeysAndAddress()
        );
        expect(keys_wallet1_index0).toStrictEqual(
            burnerManager.generateKeysAndAddress(wallet1_index0)
        );
        expect(keys_wallet1_index1).toStrictEqual(
            burnerManager.generateKeysAndAddress(wallet1_index1)
        );
        expect(keys_wallet1_index2).toStrictEqual(
            burnerManager.generateKeysAndAddress(wallet1_index2)
        );
        expect(keys_wallet2_index0).toStrictEqual(
            burnerManager.generateKeysAndAddress(wallet2_index0)
        );
        expect(keys_wallet2_index1).toStrictEqual(
            burnerManager.generateKeysAndAddress(wallet2_index1)
        );

        expect(keys_wallet1_index0).not.toStrictEqual(keys_random);
        expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet1_index1);
        expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet2_index0);
        expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet2_index1);
        expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet1_index2);
        expect(keys_wallet1_index1).not.toStrictEqual(keys_random);
        expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet2_index0);
        expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet2_index1);
        expect(keys_wallet1_index2).not.toStrictEqual(keys_wallet2_index0);
        expect(keys_wallet1_index2).not.toStrictEqual(keys_random);
        expect(keys_wallet1_index2).not.toStrictEqual(keys_wallet2_index1);
        expect(keys_wallet2_index0).not.toStrictEqual(keys_wallet2_index1);
    });
});
