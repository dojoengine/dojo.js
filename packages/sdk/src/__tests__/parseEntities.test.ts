import type * as torii from "@dojoengine/torii-wasm";
import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";
import { describe, expect, it } from "vitest";
import { parseEntities } from "../internal/parseEntities";
import type { SchemaType } from "./models.gen.ts";

describe("parseEntities", () => {
    it("should parse entities correctly", () => {
        const mockEntities: torii.Entity[] = [
            {
                hashed_keys:
                    "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85",
                models: {
                    "dojo_starter-Position": {
                        player: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                            key: true,
                        },
                        vec: {
                            type: "struct",
                            type_name: "Vec2",
                            value: {
                                x: {
                                    type: "primitive",
                                    type_name: "u32",
                                    value: 6,
                                    key: false,
                                },
                                y: {
                                    type: "primitive",
                                    type_name: "u32",
                                    value: 10,
                                    key: false,
                                },
                            },
                            key: false,
                        },
                    },
                    "dojo_starter-Moves": {
                        last_direction: {
                            type: "enum",
                            type_name: "Direction",
                            value: {
                                option: "Left",
                                value: {
                                    type: "tuple",
                                    type_name: "()",
                                    value: [],
                                    key: false,
                                },
                            },
                            key: false,
                        },
                        remaining: {
                            type: "primitive",
                            type_name: "u8",
                            value: 98,
                            key: false,
                        },
                        can_move: {
                            type: "primitive",
                            type_name: "bool",
                            value: true,
                            key: false,
                        },
                        player: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                            key: true,
                        },
                    },
                },
            },
            {
                hashed_keys:
                    "0x144c128b8ead7d0da39c6a150abbfdd38f572ba9418d3e36929eb6107b4ce4d",
                models: {
                    "dojo_starter-Moves": {
                        remaining: {
                            type: "primitive",
                            type_name: "u8",
                            value: 99,
                            key: false,
                        },
                        last_direction: {
                            type: "enum",
                            type_name: "Direction",
                            value: {
                                option: "Left",
                                value: {
                                    type: "tuple",
                                    type_name: "()",
                                    value: [],
                                    key: false,
                                },
                            },
                            key: false,
                        },
                        player: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                            key: true,
                        },
                        can_move: {
                            type: "primitive",
                            type_name: "bool",
                            value: true,
                            key: false,
                        },
                    },
                    "dojo_starter-Position": {
                        player: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                            key: true,
                        },
                        vec: {
                            type: "struct",
                            type_name: "Vec2",
                            value: {
                                x: {
                                    type: "primitive",
                                    type_name: "u32",
                                    value: 6,
                                    key: false,
                                },
                                y: {
                                    type: "primitive",
                                    type_name: "u32",
                                    value: 10,
                                    key: false,
                                },
                            },
                            key: false,
                        },
                    },
                },
            },
        ];

        const result = parseEntities(mockEntities);

        expect(result).toEqual([
            {
                entityId:
                    "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85",
                models: {
                    dojo_starter: {
                        Position: {
                            player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                            vec: {
                                x: 6,
                                y: 10,
                            },
                        },
                        Moves: {
                            last_direction: "Left",
                            remaining: 98,
                            can_move: true,
                            player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                        },
                    },
                },
            },
            {
                entityId:
                    "0x144c128b8ead7d0da39c6a150abbfdd38f572ba9418d3e36929eb6107b4ce4d",
                models: {
                    dojo_starter: {
                        Moves: {
                            last_direction: "Left",
                            remaining: 99,
                            can_move: true,
                            player: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                        },
                        Position: {
                            player: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                            vec: {
                                x: 6,
                                y: 10,
                            },
                        },
                    },
                },
            },
        ]);
    });

    it("should parse Options", () => {
        const toriiResult: torii.Entity[] = [
            {
                hashed_keys:
                    "0x43ebbfee0476dcc36cae36dfa9b47935cc20c36cb4dc7d014076e5f875cf164",
                models: {
                    "onchain_dash-CallerCounter": {
                        counter: {
                            type: "primitive",
                            type_name: "felt252",
                            value: "0x0000000000000000000000000000000000000000000000000000000000000004",
                            key: false,
                        },
                        caller: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
                            key: true,
                        },
                        timestamp: {
                            type: "enum",
                            type_name: "Option<u64>",
                            value: {
                                option: "Some",
                                value: {
                                    type: "primitive",
                                    type_name: "u64",
                                    value: "0x000000000000000000000000000000000000000000000000000000006762f013",
                                    key: false,
                                },
                            },
                            key: false,
                        },
                    },
                },
            },
        ];
        const res = parseEntities(toriiResult);
        const expected = new CairoOption(CairoOptionVariant.Some, 1734537235);
        expect(res[0]?.models?.onchain_dash?.CallerCounter?.timestamp).toEqual(
            expected
        );
    });
    it("should parse complex enums", () => {
        const toriiResult: torii.Entity[] = [
            {
                hashed_keys:
                    "0x5248d30cafd7af5e7f9255ed9bef2bd7aa0f191669a4c1e3a03b8c64ea5a9d8",
                models: {
                    "onchain_dash-Theme": {
                        theme_key: {
                            type: "primitive",
                            type_name: "u32",
                            value: 9999999,
                            key: true,
                        },
                        caller: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
                            key: false,
                        },
                        value: {
                            type: "enum",
                            type_name: "DashboardTheme",
                            value: {
                                option: "Predefined",
                                value: {
                                    type: "enum",
                                    type_name: "AvailableTheme",
                                    value: {
                                        option: "Dojo",
                                        value: {
                                            type: "tuple",
                                            type_name: "()",
                                            value: [],
                                            key: false,
                                        },
                                    },
                                    key: false,
                                },
                            },
                            key: false,
                        },
                        timestamp: {
                            type: "primitive",
                            type_name: "u64",
                            value: "0x000000000000000000000000000000000000000000000000000000006763f824",
                            key: false,
                        },
                    },
                },
            },
        ];
        const res = parseEntities<SchemaType>(toriiResult);
        const expected = new CairoCustomEnum({ Predefined: "Dojo" });
        expect(res[0]?.models?.onchain_dash?.Theme?.value).toEqual(expected);
    });

    it("should parse enum with nested struct", () => {
        const toriiResult: torii.Entity[] = [
            {
                hashed_keys:
                    "0x5248d30cafd7af5e7f9255ed9bef2bd7aa0f191669a4c1e3a03b8c64ea5a9d8",
                models: {
                    "onchain_dash-Theme": {
                        theme_key: {
                            type: "primitive",
                            type_name: "u32",
                            value: 9999999,
                            key: true,
                        },
                        timestamp: {
                            type: "primitive",
                            type_name: "u64",
                            value: "0x000000000000000000000000000000000000000000000000000000006763f9e7",
                            key: false,
                        },
                        value: {
                            type: "enum",
                            type_name: "DashboardTheme",
                            value: {
                                option: "Custom",
                                value: {
                                    type: "struct",
                                    type_name: "CustomTheme",
                                    value: {
                                        classname: {
                                            type: "primitive",
                                            type_name: "felt252",
                                            value: "0x0000000000000000000000000000000000000000637573746f6d5f636c617373",
                                            key: false,
                                        },
                                    },
                                    key: false,
                                },
                            },
                            key: false,
                        },
                        caller: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
                            key: false,
                        },
                    },
                },
            },
        ];
        const res = parseEntities(toriiResult);
        const expected = new CairoCustomEnum({
            Custom: {
                classname:
                    "0x0000000000000000000000000000000000000000637573746f6d5f636c617373",
            },
        });
        expect(res[0]?.models?.onchain_dash?.Theme?.value).toEqual(expected);
    });
});
