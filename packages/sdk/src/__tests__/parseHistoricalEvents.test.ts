import * as torii from "@dojoengine/torii-wasm";
import { describe, expect, it } from "vitest";

import {
    parseHistoricalEvents,
    orderKeys,
} from "../internal/parseHistoricalEvents";

describe("parseHistoricalEvents", () => {
    it("should preserve order", () => {
        const res1 = parseHistoricalEvents(
            toriiResultUnsorted as torii.Entities,
            { logging: false }
        );
        const res2 = parseHistoricalEvents(
            toriiResultSorted as torii.Entities,
            { logging: false }
        );

        expect(res1).toEqual(res2);
    });
    it("should order keys", () => {
        const key1Unsorted = Object.keys(
            toriiResultUnsorted[
                "0x681d68850e9c98f4383832aa206f00de22040754d6094f7b9a5a6802c25d2a3"
            ]
        );
        const key2Sorted = Object.keys(
            toriiResultSorted[
                "0x681d68850e9c98f4383832aa206f00de22040754d6094f7b9a5a6802c25d2a3"
            ]
        );
        expect(key1Unsorted).not.toEqual(key2Sorted);

        expect(orderKeys(key1Unsorted)).toEqual(orderKeys(key2Sorted));
        expect(orderKeys(key1Unsorted)).toEqual(orderKeys(key1Unsorted));
        expect(orderKeys(key2Sorted)).toEqual(orderKeys(key2Sorted));
    });
});

const toriiResultUnsorted = {
    "0x681d68850e9c98f4383832aa206f00de22040754d6094f7b9a5a6802c25d2a3": {
        "dojo_starter-Moved-5": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-14": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-3": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-11": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-8": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-13": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-6": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-2": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-12": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-9": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-15": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-16": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-7": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-10": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-4": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-1": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
    },
};
const toriiResultSorted = {
    "0x681d68850e9c98f4383832aa206f00de22040754d6094f7b9a5a6802c25d2a3": {
        "dojo_starter-Moved": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-1": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-2": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-3": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Up",
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
        "dojo_starter-Moved-4": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-5": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-6": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-7": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-8": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-9": {
            player: {
                type: "primitive",
                type_name: "ContractAddress",
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Down",
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
        "dojo_starter-Moved-10": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-11": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-12": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-13": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-14": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-15": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
        "dojo_starter-Moved-16": {
            direction: {
                type: "enum",
                type_name: "Direction",
                value: {
                    option: "Right",
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
                value: "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                key: true,
            },
        },
    },
};
