import { describe, it, expect } from "vitest";
import { SchemaType } from "../types";
import * as torii from "@dojoengine/torii-client";
import { parseEntities } from "../parseEntities";
import { QueryType } from "../types";

// Mock SchemaType for testing
interface TestSchema extends SchemaType {
    dojo_stater: {
        position: {
            player: string;
            vec: Record<string, unknown>;
        };
        moves: {
            last_direction: string;
            remaining: number;
            can_move: boolean;
            player: string;
        };
    };
}

const query: QueryType<TestSchema> = {
    position: {},
    moves: {},
};

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
                            value: {},
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
                            value: {},
                            key: false,
                        },
                    },
                },
        };

        const result = parseEntities<TestSchema>(mockEntities, query);

        expect(result).toEqual({
            dojo_starter: {
                position: [
                    {
                        player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                        vec: {},
                    },
                    {
                        player: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                        vec: {},
                    },
                ],
                moves: [
                    {
                        last_direction: "Left",
                        remaining: 98,
                        can_move: true,
                        player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
                    },
                    {
                        last_direction: "Left",
                        remaining: 99,
                        can_move: true,
                        player: "0x70c774f8d061323ada4e4924c12c894f39b5874b71147af254b3efae07e68c0",
                    },
                ],
            },
        });
    });

    // it("should handle empty entities", () => {
    //     const mockEntities: torii.Entities = {};
    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Position": {},
    //         "dojo_starter-Moves": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Position": [],
    //         "dojo_starter-Moves": [],
    //     });
    // });

    // it("should handle partial queries", () => {
    //     const mockEntities: torii.Entities = {
    //         "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
    //             {
    //                 "dojo_starter-Position": {
    //                     player: {
    //                         type: "primitive",
    //                         type_name: "ContractAddress",
    //                         value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                         key: true,
    //                     },
    //                     vec: {
    //                         type: "struct",
    //                         type_name: "Vec2",
    //                         value: {},
    //                         key: false,
    //                     },
    //                 },
    //             },
    //     };

    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Position": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Position": [
    //             {
    //                 player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                 vec: {},
    //             },
    //         ],
    //     });
    // });

    // it("should handle entities with missing fields", () => {
    //     const mockEntities: torii.Entities = {
    //         "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
    //             {
    //                 "dojo_starter-Position": {
    //                     player: {
    //                         type: "primitive",
    //                         type_name: "ContractAddress",
    //                         value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                         key: true,
    //                     },
    //                     // vec is missing
    //                 },
    //             },
    //     };

    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Position": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Position": [
    //             {
    //                 player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //             },
    //         ],
    //     });
    // });

    // it("should handle nested entities", () => {
    //     const mockEntities: torii.Entities = {
    //         "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
    //             {
    //                 "dojo_starter-Position": {
    //                     player: {
    //                         type: "primitive",
    //                         type_name: "ContractAddress",
    //                         value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                         key: true,
    //                     },
    //                     vec: {
    //                         type: "struct",
    //                         type_name: "Vec2",
    //                         value: {
    //                             x: {
    //                                 type: "primitive",
    //                                 type_name: "i32",
    //                                 value: 10,
    //                                 key: false,
    //                             },
    //                             y: {
    //                                 type: "primitive",
    //                                 type_name: "i32",
    //                                 value: 20,
    //                                 key: false,
    //                             },
    //                         },
    //                         key: false,
    //                     },
    //                 },
    //             },
    //     };

    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Position": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Position": [
    //             {
    //                 player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                 vec: {
    //                     x: 10,
    //                     y: 20,
    //                 },
    //             },
    //         ],
    //     });
    // });

    // it("should handle entities with array fields", () => {
    //     const mockEntities: torii.Entities = {
    //         "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
    //             {
    //                 "dojo_starter-Moves": {
    //                     player: {
    //                         type: "primitive",
    //                         type_name: "ContractAddress",
    //                         value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                         key: true,
    //                     },
    //                     remaining: {
    //                         type: "primitive",
    //                         type_name: "u8",
    //                         value: 98,
    //                         key: false,
    //                     },
    //                     can_move: {
    //                         type: "primitive",
    //                         type_name: "bool",
    //                         value: true,
    //                         key: false,
    //                     },
    //                     last_direction: {
    //                         type: "enum",
    //                         type_name: "Direction",
    //                         value: {
    //                             option: "Left",
    //                             value: {
    //                                 type: "tuple",
    //                                 type_name: "()",
    //                                 value: [],
    //                                 key: false,
    //                             },
    //                         },
    //                         key: false,
    //                     },
    //                 },
    //             },
    //     };

    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Moves": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Moves": [
    //             {
    //                 player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                 remaining: 98,
    //                 can_move: true,
    //                 last_direction: "Left",
    //             },
    //         ],
    //     });
    // });

    // it("should handle entities with enum fields", () => {
    //     const mockEntities: torii.Entities = {
    //         "0x14c362c17947ef1d40152d6e3bedd859c98bebfad41f75ef3f26798556a4c85":
    //             {
    //                 "dojo_starter-Moves": {
    //                     player: {
    //                         type: "primitive",
    //                         type_name: "ContractAddress",
    //                         value: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                         key: true,
    //                     },
    //                     remaining: {
    //                         type: "primitive",
    //                         type_name: "u8",
    //                         value: 98,
    //                         key: false,
    //                     },
    //                     can_move: {
    //                         type: "primitive",
    //                         type_name: "bool",
    //                         value: true,
    //                         key: false,
    //                     },
    //                     last_direction: {
    //                         type: "enum",
    //                         type_name: "Direction",
    //                         value: {
    //                             option: "Left",
    //                             value: {
    //                                 type: "tuple",
    //                                 type_name: "()",
    //                                 value: [],
    //                                 key: false,
    //                             },
    //                         },
    //                         key: false,
    //                     },
    //                 },
    //             },
    //     };

    //     const query: QueryType<TestSchema> = {
    //         "dojo_starter-Moves": {},
    //     };

    //     const result = parseEntities<TestSchema>(mockEntities, query);

    //     expect(result).toEqual({
    //         "dojo_starter-Moves": [
    //             {
    //                 player: "0x7f7e355d3ae20c34de26c21b46612622f4e4012e7debc10f0300cf193a46366",
    //                 remaining: 98,
    //                 can_move: true,
    //                 last_direction: "Left",
    //             },
    //         ],
    //     });
    // });
});
