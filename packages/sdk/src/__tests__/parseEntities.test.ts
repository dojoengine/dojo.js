import * as torii from "@dojoengine/torii-client";
import { describe, expect, it } from "vitest";

import { parseEntities } from "../parseEntities";

describe("parseEntities", () => {
    it("should parse entities correctly", () => {
        const mockEntities: torii.Entities = {
            "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
                {
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
            "0x144c128b8ead7d0da39c6a150abbfdd38f572ba9418d3e36929eb6107b4ce4d":
                {
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
        };

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
});
