import { describe, expect, it, beforeEach, vi } from "vitest";
import { DojoProvider } from "../provider/DojoProvider";

const createRootAbisManifest = () => ({
    world: {
        address: "0x123",
        entrypoints: ["uuid", "set_metadata"],
    },
    contracts: [
        {
            address: "0x456",
            tag: "lore-actions_token",
            systems: ["claim_free_actions", "mint_to"],
        },
        {
            address: "0x789",
            tag: "lore-designer",
            systems: ["create_player", "create_entity"],
        },
    ],
    abis: [
        {
            type: "interface",
            name: "lore::systems::actions_token::IActionsTokenPublic",
            items: [
                {
                    type: "function",
                    name: "claim_free_actions",
                    state_mutability: "external",
                    inputs: [],
                    outputs: [],
                },
                {
                    type: "function",
                    name: "mint_to",
                    state_mutability: "external",
                    inputs: [
                        { name: "recipient", type: "ContractAddress" },
                        { name: "amount", type: "u128" },
                    ],
                    outputs: [],
                },
            ],
        },
        {
            type: "interface",
            name: "lore::systems::designer::IDesignerProtected",
            items: [
                {
                    type: "function",
                    name: "create_player",
                    state_mutability: "external",
                    inputs: [{ name: "game_id", type: "u128" }],
                    outputs: [],
                },
                {
                    type: "function",
                    name: "create_entity",
                    state_mutability: "external",
                    inputs: [
                        { name: "trail_id", type: "u128" },
                        { name: "name", type: "ByteArray" },
                    ],
                    outputs: [],
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::world::IWorld",
            items: [],
        },
    ],
});

const createMockManifest = () => ({
    world: {
        address: "0x123",
        abi: [
            {
                type: "interface",
                name: "dojo::world::IWorld",
                items: [],
            },
        ],
    },
    contracts: [
        {
            address: "0x456",
            tag: "pistols-game",
            systems: ["commit_moves", "reveal_moves"],
            abi: [
                {
                    type: "interface",
                    name: "pistols::systems::game::IGame",
                    items: [
                        {
                            type: "function",
                            name: "commit_moves",
                            state_mutability: "external",
                            inputs: [
                                { name: "duelist_id", type: "felt252" },
                                { name: "duel_id", type: "felt252" },
                                { name: "hashed", type: "felt252" },
                            ],
                            outputs: [],
                        },
                        {
                            type: "function",
                            name: "reveal_moves",
                            state_mutability: "external",
                            inputs: [{ name: "duel_id", type: "felt252" }],
                            outputs: [],
                        },
                    ],
                },
            ],
        },
        {
            address: "0x789",
            tag: "pistols-bot_player",
            systems: ["commit_moves", "reply_duel"],
            abi: [
                {
                    type: "interface",
                    name: "pistols::systems::bot_player::IBotPlayerProtected",
                    items: [
                        {
                            type: "function",
                            name: "commit_moves",
                            state_mutability: "external",
                            inputs: [{ name: "duel_id", type: "felt252" }],
                            outputs: [],
                        },
                        {
                            type: "function",
                            name: "reply_duel",
                            state_mutability: "external",
                            inputs: [{ name: "duel_id", type: "felt252" }],
                            outputs: [],
                        },
                    ],
                },
            ],
        },
        {
            address: "0xabc",
            tag: "pistols-admin",
            systems: ["set_paused"],
            abi: [
                {
                    type: "interface",
                    name: "pistols::systems::admin::IAdmin",
                    items: [
                        {
                            type: "function",
                            name: "set_paused",
                            state_mutability: "external",
                            inputs: [{ name: "paused", type: "bool" }],
                            outputs: [],
                        },
                    ],
                },
            ],
        },
        {
            address: "0xdef",
            tag: "pistols-viewer",
            systems: ["get_status"],
            abi: [
                {
                    type: "interface",
                    name: "pistols::systems::viewer::IViewer",
                    items: [
                        {
                            type: "function",
                            name: "get_status",
                            state_mutability: "view",
                            inputs: [],
                            outputs: [{ type: "felt252" }],
                        },
                    ],
                },
            ],
        },
    ],
});

describe("DojoProvider", () => {
    let provider: DojoProvider;

    beforeEach(() => {
        provider = new DojoProvider(createMockManifest());
    });

    describe("initializeActionMethods", () => {
        it("should create prefixed method names for duplicate functions", () => {
            expect(provider).toHaveProperty("pistols_game_commit_moves");
            expect(provider).toHaveProperty("pistols_bot_player_commit_moves");

            expect(typeof (provider as any).pistols_game_commit_moves).toBe(
                "function"
            );
            expect(
                typeof (provider as any).pistols_bot_player_commit_moves
            ).toBe("function");
        });

        it("should keep simple names for unique functions", () => {
            expect(provider).toHaveProperty("set_paused");
            expect(typeof (provider as any).set_paused).toBe("function");

            expect(provider).not.toHaveProperty("pistols_admin_set_paused");
        });

        it("should not shadow duplicate function names", () => {
            const gameMethod = (provider as any).pistols_game_commit_moves;
            const botMethod = (provider as any).pistols_bot_player_commit_moves;

            expect(gameMethod).toBeDefined();
            expect(botMethod).toBeDefined();
            expect(gameMethod).not.toBe(botMethod);
        });

        it("should not create unprefixed method when duplicates exist", () => {
            expect(provider).not.toHaveProperty("commit_moves");
        });

        it("should create methods for unique functions in each contract", () => {
            expect(provider).toHaveProperty("reveal_moves");
            expect(provider).toHaveProperty("reply_duel");
            expect(provider).toHaveProperty("get_status");
        });
    });

    describe("action method signatures", () => {
        it("should throw error when account is missing for external methods", async () => {
            const method = (provider as any).pistols_game_commit_moves;

            await expect(method()).rejects.toThrow(
                'Account is required for action "pistols_game_commit_moves"'
            );
        });

        it("should throw error when args are missing for methods with inputs", async () => {
            const mockAccount = { execute: vi.fn() };
            const method = (provider as any).pistols_game_commit_moves;

            await expect(method(mockAccount)).rejects.toThrow(
                'Missing arguments for action "pistols_game_commit_moves"'
            );
        });

        it("should not require account for view methods", async () => {
            const method = (provider as any).get_status;

            // Mock the internal call method to avoid network request
            (provider as any).call = vi
                .fn()
                .mockResolvedValue({ result: "0x1" });

            await expect(method()).resolves.toBeDefined();
        });
    });
});

describe("DojoProvider with root-level ABIs manifest", () => {
    let provider: DojoProvider;

    beforeEach(() => {
        provider = new DojoProvider(createRootAbisManifest());
    });

    describe("initializeActionMethods", () => {
        it("should create action methods from root-level abis", () => {
            expect(provider).toHaveProperty("claim_free_actions");
            expect(provider).toHaveProperty("mint_to");
            expect(provider).toHaveProperty("create_player");
            expect(provider).toHaveProperty("create_entity");

            expect(typeof (provider as any).claim_free_actions).toBe(
                "function"
            );
            expect(typeof (provider as any).mint_to).toBe("function");
            expect(typeof (provider as any).create_player).toBe("function");
            expect(typeof (provider as any).create_entity).toBe("function");
        });
    });

    describe("action method signatures", () => {
        it("should throw error when account is missing for external methods", async () => {
            const method = (provider as any).claim_free_actions;

            await expect(method()).rejects.toThrow(
                'Account is required for action "claim_free_actions"'
            );
        });

        it("should throw error when args are missing for methods with inputs", async () => {
            const mockAccount = { execute: vi.fn() };
            const method = (provider as any).create_player;

            await expect(method(mockAccount)).rejects.toThrow(
                'Missing arguments for action "create_player"'
            );
        });
    });
});
