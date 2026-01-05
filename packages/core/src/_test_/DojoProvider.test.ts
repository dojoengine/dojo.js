import { describe, expect, it, mock, beforeEach } from "bun:test";
import * as starknet from "starknet";

mock.module("starknet", () => ({
    ...starknet,
    RpcProvider: mock(() => ({
        callContract: mock(() => Promise.resolve(["0x1"])),
    })),
    Contract: mock(() => ({
        call: mock(() => Promise.resolve({ result: "0x1" })),
    })),
}));

import { DojoProvider } from "../provider/DojoProvider";

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
            // commit_moves exists in both game and bot_player contracts
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
            // set_paused only exists in admin contract
            expect(provider).toHaveProperty("set_paused");
            expect(typeof (provider as any).set_paused).toBe("function");

            // Should not have prefixed version
            expect(provider).not.toHaveProperty("pistols_admin_set_paused");
        });

        it("should not shadow duplicate function names", () => {
            // Both prefixed versions should exist independently
            const gameMethod = (provider as any).pistols_game_commit_moves;
            const botMethod = (provider as any).pistols_bot_player_commit_moves;

            expect(gameMethod).toBeDefined();
            expect(botMethod).toBeDefined();
            expect(gameMethod).not.toBe(botMethod);
        });

        it("should not create unprefixed method when duplicates exist", () => {
            // commit_moves is duplicated, so no unprefixed version should exist
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
            const mockAccount = { execute: mock(() => {}) };
            const method = (provider as any).pistols_game_commit_moves;

            await expect(method(mockAccount)).rejects.toThrow(
                'Missing arguments for action "pistols_game_commit_moves"'
            );
        });

        it("should not require account for view methods", async () => {
            const method = (provider as any).get_status;

            // Should not throw about account requirement
            await expect(method()).resolves.toBeDefined();
        });
    });
});
