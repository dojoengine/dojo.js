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
                    "0x014c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85",
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
                    "0x0144c128b8ead7d0da39c6a150abbfdd38f572ba9418d3e36929eb6107b4ce4d",
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
                                    value: "1734537235",
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
                            value: "1734605860",
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
                            value: "1734606311",
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

    it("should parse timestamps as numbers from decimal strings", () => {
        const toriiResult: torii.Entity[] = [
            {
                hashed_keys:
                    "0x43ebbfee0476dcc36cae36dfa9b47935cc20c36cb4dc7d014076e5f875cf164",
                models: {
                    "test_namespace-TimestampModel": {
                        id: {
                            type: "primitive",
                            type_name: "u32",
                            value: 1,
                            key: true,
                        },
                        created_at: {
                            type: "primitive",
                            type_name: "u64",
                            value: "1734537235",
                            key: false,
                        },
                        updated_at: {
                            type: "primitive",
                            type_name: "u64",
                            value: "1734537300",
                            key: false,
                        },
                        expires_at: {
                            type: "primitive",
                            type_name: "u64",
                            value: "9999999999",
                            key: false,
                        },
                    },
                },
            },
        ];

        const res = parseEntities(toriiResult);

        expect(res[0]?.models?.test_namespace?.TimestampModel?.created_at).toBe(
            1734537235
        );
        expect(res[0]?.models?.test_namespace?.TimestampModel?.updated_at).toBe(
            1734537300
        );
        expect(res[0]?.models?.test_namespace?.TimestampModel?.expires_at).toBe(
            9999999999
        );

        expect(
            typeof res[0]?.models?.test_namespace?.TimestampModel?.created_at
        ).toBe("number");
        expect(
            typeof res[0]?.models?.test_namespace?.TimestampModel?.updated_at
        ).toBe("number");
        expect(
            typeof res[0]?.models?.test_namespace?.TimestampModel?.expires_at
        ).toBe("number");
    });

    it("should properly pad entity IDs to consistent length", () => {
        const toriiResult: torii.Entity[] = [
            {
                // Unpadded entity ID (shorter)
                hashed_keys: "0x1",
                models: {
                    "test-Model": {
                        id: {
                            type: "primitive",
                            type_name: "u32",
                            value: 1,
                            key: true,
                        },
                    },
                },
            },
            {
                // Already padded entity ID
                hashed_keys:
                    "0x0000000000000000000000000000000000000000000000000000000000000002",
                models: {
                    "test-Model": {
                        id: {
                            type: "primitive",
                            type_name: "u32",
                            value: 2,
                            key: true,
                        },
                    },
                },
            },
            {
                // Partially padded entity ID
                hashed_keys: "0x00000003",
                models: {
                    "test-Model": {
                        id: {
                            type: "primitive",
                            type_name: "u32",
                            value: 3,
                            key: true,
                        },
                    },
                },
            },
        ];

        const res = parseEntities(toriiResult);

        // All entity IDs should be padded to 66 characters (0x + 64 hex chars)
        expect(res[0]?.entityId).toBe(
            "0x0000000000000000000000000000000000000000000000000000000000000001"
        );
        expect(res[1]?.entityId).toBe(
            "0x0000000000000000000000000000000000000000000000000000000000000002"
        );
        expect(res[2]?.entityId).toBe(
            "0x0000000000000000000000000000000000000000000000000000000000000003"
        );

        // Verify all have the same length
        expect(res[0]?.entityId?.length).toBe(66);
        expect(res[1]?.entityId?.length).toBe(66);
        expect(res[2]?.entityId?.length).toBe(66);
    });

    it("should parse all primitive types correctly according to Rust serialization", () => {
        const toriiResult: torii.Entity[] = [
            {
                hashed_keys: "0x1234567890abcdef",
                models: {
                    "test-PrimitiveTypes": {
                        // Small integers - come as JSON numbers
                        u8_value: {
                            type: "primitive",
                            type_name: "u8",
                            value: 255,
                            key: false,
                        },
                        u16_value: {
                            type: "primitive",
                            type_name: "u16",
                            value: 65535,
                            key: false,
                        },
                        u32_value: {
                            type: "primitive",
                            type_name: "u32",
                            value: 4294967295,
                            key: false,
                        },
                        i8_value: {
                            type: "primitive",
                            type_name: "i8",
                            value: -128,
                            key: false,
                        },
                        i16_value: {
                            type: "primitive",
                            type_name: "i16",
                            value: -32768,
                            key: false,
                        },
                        i32_value: {
                            type: "primitive",
                            type_name: "i32",
                            value: -2147483648,
                            key: false,
                        },
                        bool_value: {
                            type: "primitive",
                            type_name: "bool",
                            value: true,
                            key: false,
                        },
                        // Large integers - come as decimal strings
                        u64_value: {
                            type: "primitive",
                            type_name: "u64",
                            value: "18446744073709551615",
                            key: false,
                        },
                        i64_value: {
                            type: "primitive",
                            type_name: "i64",
                            value: "-9223372036854775808",
                            key: false,
                        },
                        u128_value: {
                            type: "primitive",
                            type_name: "u128",
                            value: "340282366920938463463374607431768211455",
                            key: false,
                        },
                        i128_value: {
                            type: "primitive",
                            type_name: "i128",
                            value: "-170141183460469231731687303715884105728",
                            key: false,
                        },
                        // u256 - comes as hex string
                        u256_value: {
                            type: "primitive",
                            type_name: "u256",
                            value: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                            key: false,
                        },
                        // Blockchain types - come as hex strings
                        contract_address: {
                            type: "primitive",
                            type_name: "ContractAddress",
                            value: "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
                            key: false,
                        },
                        class_hash: {
                            type: "primitive",
                            type_name: "ClassHash",
                            value: "0x0000000000000000000000000000000000000000000000000000000000001234",
                            key: false,
                        },
                        felt252_value: {
                            type: "primitive",
                            type_name: "felt252",
                            value: "0x0000000000000000000000000000000000000000000000000000000000000042",
                            key: false,
                        },
                        eth_address: {
                            type: "primitive",
                            type_name: "EthAddress",
                            value: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7",
                            key: false,
                        },
                    },
                },
            },
        ];

        const res = parseEntities(toriiResult);
        const model = res[0]?.models?.test?.PrimitiveTypes;

        // Small integers should remain as numbers
        expect(model?.u8_value).toBe(255);
        expect(model?.u16_value).toBe(65535);
        expect(model?.u32_value).toBe(4294967295);
        expect(model?.i8_value).toBe(-128);
        expect(model?.i16_value).toBe(-32768);
        expect(model?.i32_value).toBe(-2147483648);
        expect(model?.bool_value).toBe(true);

        // u64 and i64 should be parsed from decimal strings to numbers
        expect(model?.u64_value).toBe(18446744073709551615);
        expect(model?.i64_value).toBe(-9223372036854775808);
        expect(typeof model?.u64_value).toBe("number");
        expect(typeof model?.i64_value).toBe("number");

        // u128 and i128 should be parsed from decimal strings to BigInt
        expect(model?.u128_value).toBe(
            BigInt("340282366920938463463374607431768211455")
        );
        expect(model?.i128_value).toBe(
            BigInt("-170141183460469231731687303715884105728")
        );
        expect(typeof model?.u128_value).toBe("bigint");
        expect(typeof model?.i128_value).toBe("bigint");

        // u256 should be parsed from hex string to BigInt
        expect(model?.u256_value).toBe(
            BigInt(
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            )
        );
        expect(typeof model?.u256_value).toBe("bigint");

        // Blockchain types should remain as hex strings
        expect(model?.contract_address).toBe(
            "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec"
        );
        expect(model?.class_hash).toBe(
            "0x0000000000000000000000000000000000000000000000000000000000001234"
        );
        expect(model?.felt252_value).toBe(
            "0x0000000000000000000000000000000000000000000000000000000000000042"
        );
        expect(model?.eth_address).toBe(
            "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7"
        );
    });
});
