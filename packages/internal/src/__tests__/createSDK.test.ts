import type * as torii from "@dojoengine/torii-wasm";
import type { Result } from "neverthrow";
import { ok } from "neverthrow";
import type { Account, TypedData } from "starknet";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    createSDK,
    type SchemaType,
    type SDKConfig,
    type ToriiQueryBuilder,
} from "..";

// Mock schema for testing
const mockSchema = {
    world: {
        Player: {
            id: "felt252",
            name: "string",
            score: "u32",
        },
        Item: {
            id: "felt252",
            name: "string",
            durability: "u8",
        },
    },
} satisfies SchemaType;

// Mock Torii client
const createMockClient = (): torii.ToriiClient =>
    ({
        getEntities: vi.fn().mockResolvedValue({
            items: [],
            next_cursor: null,
        }),
        getEventMessages: vi.fn().mockResolvedValue({
            items: [],
            next_cursor: null,
        }),
        onEntityUpdated: vi.fn().mockReturnValue({ cancel: vi.fn() }),
        onEventMessageUpdated: vi.fn().mockReturnValue({ cancel: vi.fn() }),
        publishMessage: vi.fn().mockResolvedValue("0x123"),
        publishMessageBatch: vi
            .fn()
            .mockResolvedValue(["0x123", "0x456", "0x789"]),
        updateEntitySubscription: vi.fn().mockResolvedValue(undefined),
        updateEventMessageSubscription: vi.fn().mockResolvedValue(undefined),
        getControllers: vi.fn().mockResolvedValue(["0x123", "0x456"]),
        // Add other required methods as needed
    }) as unknown as torii.ToriiClient;

describe("createSDK", () => {
    let mockClient: torii.ToriiClient;
    let mockConfig: SDKConfig;
    let mockSignMessage: (
        data: TypedData,
        account?: Account
    ) => Promise<Result<string, string>>;
    let mockSignMessageBatch: (
        data: TypedData[],
        account?: Account
    ) => Promise<Result<string[], string>>;

    beforeEach(() => {
        mockClient = createMockClient();
        mockConfig = {
            client: {
                worldAddress: "0x123",
                toriiUrl: "http://localhost:8080",
            },
            domain: {
                name: "TestApp",
                version: "1.0.0",
                chainId: "SN_MAIN",
            },
        };
        mockSignMessage = vi
            .fn<[TypedData, Account?], Promise<Result<string, string>>>()
            .mockResolvedValue(ok("0x123"));
        mockSignMessageBatch = vi
            .fn<[TypedData[], Account?], Promise<Result<string[], string>>>()
            .mockResolvedValue(ok(["0x123", "0x456", "0x789"]));
    });

    it("should create SDK with all required methods", () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        // Check that all required methods exist
        expect(sdk.client).toBe(mockClient);
        expect(sdk.subscribeEntityQuery).toBeDefined();
        expect(sdk.subscribeEventQuery).toBeDefined();
        expect(sdk.subscribeTokenBalance).toBeDefined();
        expect(sdk.getEntities).toBeDefined();
        expect(sdk.getEventMessages).toBeDefined();
        expect(sdk.generateTypedData).toBeDefined();
        expect(sdk.sendMessage).toBeDefined();
        expect(sdk.sendMessageBatch).toBeDefined();
        expect(sdk.getTokens).toBeDefined();
        expect(sdk.getTokenBalances).toBeDefined();
        expect(sdk.onTokenBalanceUpdated).toBeDefined();
        expect(sdk.updateTokenBalanceSubscription).toBeDefined();
        expect(sdk.updateEntitySubscription).toBeDefined();
        expect(sdk.updateEventMessageSubscription).toBeDefined();
        expect(sdk.getControllers).toBeDefined();
        expect(sdk.sendSignedMessageBatch).toBeDefined();
    });

    it("should use provided signMessage function", async () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const typedData = {
            types: {},
            primaryType: "Test",
            domain: {},
            message: {},
        };

        const result = await sdk.sendMessage(typedData);

        expect(mockSignMessage).toHaveBeenCalledWith(typedData);
        expect(result.isOk()).toBe(true);
    });

    it("should use provided signMessageBatch function", async () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const typedData1 = {
            types: {},
            primaryType: "Test1",
            domain: {},
            message: { id: "1" },
        };

        const typedData2 = {
            types: {},
            primaryType: "Test2",
            domain: {},
            message: { id: "2" },
        };

        const typedData3 = {
            types: {},
            primaryType: "Test3",
            domain: {},
            message: { id: "3" },
        };

        const result = await sdk.sendMessageBatch([
            typedData1,
            typedData2,
            typedData3,
        ]);

        expect(mockSignMessageBatch).toHaveBeenCalledWith([
            typedData1,
            typedData2,
            typedData3,
        ]);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(["0x123", "0x456", "0x789"]);
        }
    });

    it("should send signed message batch directly", async () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const signedMessages: torii.Message[] = [
            {
                message: JSON.stringify({
                    types: {},
                    primaryType: "Test1",
                    domain: {},
                    message: { id: "1" },
                }),
                signature: ["0xabc123", "0xdef456"],
            },
            {
                message: JSON.stringify({
                    types: {},
                    primaryType: "Test2",
                    domain: {},
                    message: { id: "2" },
                }),
                signature: ["0x789abc", "0xdef012"],
            },
        ];

        const result = await sdk.sendSignedMessageBatch(signedMessages);

        expect(mockClient.publishMessageBatch).toHaveBeenCalledWith(
            signedMessages
        );
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(["0x123", "0x456", "0x789"]);
        }
    });

    it("should generate typed data correctly", () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const message = {
            id: "0x1",
            name: "Test Player",
            score: "100", // Changed to string to match schema
        };

        const typedData = sdk.generateTypedData("world-Player", message);

        expect(typedData).toBeDefined();
        expect(typedData.domain).toEqual(mockConfig.domain);
    });

    it("should handle entity queries", async () => {
        const mockQuery = {
            build: vi.fn().mockReturnValue({
                clause: {},
                limit: 10,
            }),
            getPagination: vi.fn().mockReturnValue({
                limit: 10,
                offset: 0,
            }),
        } as unknown as ToriiQueryBuilder<typeof mockSchema>;

        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const result = await sdk.getEntities({
            query: mockQuery,
        });

        expect(mockClient.getEntities).toHaveBeenCalled();
        // Use public method to check items
        expect(result.getItems()).toEqual([]);
    });

    it("should handle subscriptions with callbacks", async () => {
        const mockQuery = {
            build: vi.fn().mockReturnValue({
                clause: {},
                limit: 10,
            }),
            getPagination: vi.fn().mockReturnValue({
                limit: 10,
                offset: 0,
            }),
        } as unknown as ToriiQueryBuilder<typeof mockSchema>;

        const mockCallback = vi.fn();

        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const [initial, subscription] = await sdk.subscribeEntityQuery({
            query: mockQuery,
            callback: mockCallback,
        });

        expect(mockClient.getEntities).toHaveBeenCalled();
        expect(mockClient.onEntityUpdated).toHaveBeenCalled();
        // Use public method to check items
        expect(initial.getItems()).toEqual([]);
        expect(subscription).toBeDefined();
    });

    it("should handle subscription updates", async () => {
        const sdk = createSDK<typeof mockSchema>({
            client: mockClient,
            config: mockConfig,
            sendMessage: mockSignMessage,
            sendMessageBatch: mockSignMessageBatch,
        });

        const mockSubscription = {
            cancel: vi.fn(),
        } as unknown as torii.Subscription;
        const mockClause = {} as unknown as torii.Clause;

        await sdk.updateEntitySubscription(mockSubscription, mockClause);

        expect(mockClient.updateEntitySubscription).toHaveBeenCalledWith(
            mockSubscription,
            mockClause
        );
    });
});
