import { shortString, validateAndParseAddress } from "starknet";
import { beforeEach, describe, expect, it, vi } from "vitest";

// import { getBurnerManager } from "../mocks/mocks"; // Adjust the path as necessary
import { BurnerCreateOptions } from "../../src/types";
import Storage from "../../src/utils/storage";

// // Explicitly mock the 'starknet' module
// vi.mock("starknet", async () => {
//     const actual: any = await vi.importActual("starknet");

//     // Extend the actual Account class and override methods as needed
//     class MockAccount extends actual.Account {
//         getTransactionReceipt = vi.fn().mockResolvedValue({ status: "mocked" });
//     }

//     // Extend the actual Provider class and override methods as needed
//     class MockRpcProvider extends actual.RpcProvider {
//         getChainId = vi
//             .fn()
//             .mockResolvedValue(shortString.encodeShortString("katana_test"));
//     }

//     // Return the modified module with the MockAccount
//     return {
//         ...actual,
//         Account: MockAccount,
//         RpcProvider: MockRpcProvider,
//     };
// });

// // Mock the Storage module
// vi.mock("../../src/utils/storage", () => ({
//     default: {
//         get: vi.fn(),
//         set: vi.fn(),
//         clear: vi.fn(),
//         remove: vi.fn(),
//     },
// }));

// class MockStorage {
//     state = undefined;
//     constructor(initialState) {
//         this.state = initialState;
//         Storage.get.mockImplementation((key: string) => {
//             if (key === "burners_katana_test") {
//                 return this.state;
//             }
//             return null;
//         });
//         Storage.set.mockImplementation((key: string, newStore: any) => {
//             if (key === "burners_katana_test") {
//                 this.state = newStore;
//             }
//         });
//         Storage.remove.mockImplementation((key: string) => {
//             if (key === "burners_katana_test") {
//                 this.state = undefined;
//             }
//         });
//     }
// }

// describe("BurnerManager - init method", () => {
//     beforeEach(() => {
//         // Reset mocks to default behavior before each test
//         vi.resetAllMocks();

//         // Default mock for Storage.get to return null, simulating no stored accounts
//         Storage.get.mockImplementation(() => null);
//     });

//     it("handles no burner accounts", async () => {
//         const burnerManager = getBurnerManager();
//         await burnerManager.init();

//         // Verify Storage.get was called to attempt loading accounts
//         expect(Storage.get).toHaveBeenCalledWith("burners_katana_test");
//         expect(burnerManager.getActiveAccount()).toBeNull();
//     });

//     it("loads and activates an existing burner account", async () => {
//         // Setup Storage.get to return a mock burner account
//         const storage = new MockStorage({
//             account1: {
//                 privateKey: "0x00aa",
//                 publicKey: "0x00bb",
//                 deployTx: "0x00cc",
//                 active: true,
//             },
//         });

//         const burnerManager = getBurnerManager();

//         // Mock getTransactionReceipt to return null, simulating an undeployed account
//         burnerManager.masterAccount.getTransactionReceipt.mockResolvedValue(
//             "receipt not null"
//         );

//         await burnerManager.init();

//         expect(Storage.get).toHaveBeenCalledWith("burners_katana_test");

//         // Verify that an account is set as active - this assumes you have a way to check the active account
//         // The specifics of this assertion might change based on how you track the active account
//         expect(burnerManager.getActiveAccount()).not.toBeNull();
//         expect(burnerManager.getActiveAccount()?.address).toBe("account1");
//     });

//     it("list, get, select, deselect, remove, clear", async () => {
//         const storage = new MockStorage({
//             account1: {
//                 privateKey: "0x00aa",
//                 publicKey: "0x00bb",
//                 deployTx: "0x00cc",
//                 active: false,
//             },
//             account2: {
//                 privateKey: "0x88aa",
//                 publicKey: "0x88bb",
//                 deployTx: "0x88cc",
//                 active: true,
//             },
//         });

//         const burnerManager = getBurnerManager();

//         // Mock getTransactionReceipt to return null, simulating an undeployed account
//         burnerManager.masterAccount.getTransactionReceipt.mockResolvedValue(
//             "receipt not null"
//         );

//         await burnerManager.init();

//         // initial state
//         expect(burnerManager.list().length).toStrictEqual(2);
//         expect(burnerManager.getActiveAccount()?.address).toStrictEqual(
//             "account2"
//         );

//         // get()
//         expect(burnerManager.get("account1")?.address).toStrictEqual(
//             "account1"
//         );
//         expect(burnerManager.get("account2")?.address).toStrictEqual(
//             "account2"
//         );

//         // deselect()
//         expect(burnerManager.deselect()).toEqual(undefined);
//         expect(burnerManager.getActiveAccount()).toStrictEqual(null);

//         // select()
//         expect(burnerManager.select("account1")).toEqual(undefined);
//         expect(burnerManager.getActiveAccount()?.address).toStrictEqual(
//             "account1"
//         );

//         // delete()
//         expect(burnerManager.select("account2")).toEqual(undefined);
//         expect(burnerManager.delete("account2")).toEqual(undefined);
//         expect(burnerManager.getActiveAccount()).toStrictEqual(null);
//         expect(burnerManager.list().length).toStrictEqual(1);

//         // clear()
//         expect(burnerManager.clear()).toEqual(undefined);
//         expect(burnerManager.list().length).toStrictEqual(0);
//         expect(burnerManager.getActiveAccount()).toStrictEqual(null);
//     });

//     it("handles storage with one undeployed burner account", async () => {
//         // Mock Storage.get to return one burner account that is not deployed
//         const storage = new MockStorage({
//             account1: {
//                 privateKey: "0x00aa",
//                 publicKey: "0x00bb",
//                 deployTx: "0x00cc",
//                 active: true,
//             },
//         });

//         const burnerManager = getBurnerManager();
//         // Mock getTransactionReceipt to return null, simulating an undeployed account
//         burnerManager.masterAccount.getTransactionReceipt.mockResolvedValue(
//             null
//         );
//         await burnerManager.init();

//         expect(burnerManager.account).toBeNull();
//     });
// });

// it("generateKeysAndAddress", async () => {
//     const burnerManager = getBurnerManager();

//     await burnerManager.init();

//     const wallet1_index0: BurnerCreateOptions = {
//         secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
//         index: 0,
//     };
//     const wallet1_index1: BurnerCreateOptions = {
//         secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
//         index: 1,
//     };
//     const wallet1_index2: BurnerCreateOptions = {
//         secret: "0x66efb28ac62686966ae85095ff3a772e014e7fbf56d4c5f6fac5606d4dde23a",
//         index: 2,
//     };
//     const wallet2_index0: BurnerCreateOptions = {
//         secret: "0x3ebb4767aae1262f8eb28d9368db5388cfe367f50552a8244123506f0b0bcca",
//         index: 0,
//     };
//     const wallet2_index1: BurnerCreateOptions = {
//         secret: "0x3ebb4767aae1262f8eb28d9368db5388cfe367f50552a8244123506f0b0bcca",
//         index: 1,
//     };

//     const keys_random = burnerManager.generateKeysAndAddress();
//     const keys_wallet1_index0 =
//         burnerManager.generateKeysAndAddress(wallet1_index0);
//     const keys_wallet1_index1 =
//         burnerManager.generateKeysAndAddress(wallet1_index1);
//     const keys_wallet1_index2 =
//         burnerManager.generateKeysAndAddress(wallet1_index2);
//     const keys_wallet2_index0 =
//         burnerManager.generateKeysAndAddress(wallet2_index0);
//     const keys_wallet2_index1 =
//         burnerManager.generateKeysAndAddress(wallet2_index1);

//     // generated keys are valid
//     expect(BigInt(keys_random.privateKey)).toEqual(
//         BigInt(validateAndParseAddress(keys_random.privateKey))
//     );
//     expect(BigInt(keys_random.publicKey)).toEqual(
//         BigInt(validateAndParseAddress(keys_random.publicKey))
//     );
//     expect(BigInt(keys_random.address)).toEqual(
//         BigInt(validateAndParseAddress(keys_random.address))
//     );
//     expect(BigInt(keys_wallet1_index0.privateKey)).toEqual(
//         BigInt(validateAndParseAddress(keys_wallet1_index0.privateKey))
//     );
//     expect(BigInt(keys_wallet1_index0.publicKey)).toEqual(
//         BigInt(validateAndParseAddress(keys_wallet1_index0.publicKey))
//     );
//     expect(BigInt(keys_wallet1_index0.address)).toEqual(
//         BigInt(validateAndParseAddress(keys_wallet1_index0.address))
//     );

//     // random are not deterministic
//     expect(keys_random).not.toStrictEqual(
//         burnerManager.generateKeysAndAddress()
//     );

//     // indexed are deterministic
//     expect(keys_wallet1_index0).toStrictEqual(
//         burnerManager.generateKeysAndAddress(wallet1_index0)
//     );
//     expect(keys_wallet1_index1).toStrictEqual(
//         burnerManager.generateKeysAndAddress(wallet1_index1)
//     );
//     expect(keys_wallet1_index2).toStrictEqual(
//         burnerManager.generateKeysAndAddress(wallet1_index2)
//     );
//     expect(keys_wallet2_index0).toStrictEqual(
//         burnerManager.generateKeysAndAddress(wallet2_index0)
//     );
//     expect(keys_wallet2_index1).toStrictEqual(
//         burnerManager.generateKeysAndAddress(wallet2_index1)
//     );

//     // indexes per wallet are unique
//     expect(keys_wallet1_index0).not.toStrictEqual(keys_random);
//     expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet1_index1);
//     expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet2_index0);
//     expect(keys_wallet1_index0).not.toStrictEqual(keys_wallet2_index1);
//     expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet1_index2);
//     expect(keys_wallet1_index1).not.toStrictEqual(keys_random);
//     expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet2_index0);
//     expect(keys_wallet1_index1).not.toStrictEqual(keys_wallet2_index1);
//     expect(keys_wallet1_index2).not.toStrictEqual(keys_wallet2_index0);
//     expect(keys_wallet1_index2).not.toStrictEqual(keys_random);
//     expect(keys_wallet1_index2).not.toStrictEqual(keys_wallet2_index1);
//     expect(keys_wallet2_index0).not.toStrictEqual(keys_wallet2_index1);
//     expect(keys_wallet2_index0).not.toStrictEqual(keys_random);
//     expect(keys_wallet2_index1).not.toStrictEqual(keys_random);
// });

// describe("BurnerManager", () => {
//     let burnerManager;

//     beforeEach(() => {
//         // Reset mocks to default behavior before each test
//         vi.resetAllMocks();

//         burnerManager = getBurnerManager();
//     });

//     it("should update isDeploying", async () => {
//         burnerManager.updateIsDeploying(false);
//         expect(burnerManager.isDeploying).toBeFalsy();
//     });

//     it("should list burner accounts", async () => {
//         expect(burnerManager.list()).toStrictEqual([]);
//     });

//     it("should select burner accounts", async () => {
//         expect(() => burnerManager.select("test")).toThrowError(
//             "burner not found"
//         );
//     });

//     it("should get burner accounts", async () => {
//         expect(() => burnerManager.get("test")).toThrowError(
//             "burner not found"
//         );
//     });

//     it("should create burner accounts", async () => {
//         expect(burnerManager.create()).rejects.toThrowError(
//             "BurnerManager is not initialized"
//         );
//     });

//     it("should copy burner to clipboard", async () => {
//         expect(burnerManager.copyBurnersToClipboard()).rejects.toThrowError();
//     });

//     it("should set burner from clipboard", async () => {
//         expect(burnerManager.setBurnersFromClipboard()).rejects.toThrowError();
//     });
// });
