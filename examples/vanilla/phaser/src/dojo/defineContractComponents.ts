/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export type ContractComponents = Awaited<
    ReturnType<typeof defineContractComponents>
>;

export function defineContractComponents(world: World) {
    return {
        DirectionsAvailable: (() => {
            return defineComponent(
                world,
                { player: RecsType.BigInt, directions: RecsType.StringArray },
                {
                    metadata: {
                        name: "dojo_starter-DirectionsAvailable",
                        types: ["contractaddress"],
                        customTypes: [],
                    },
                }
            );
        })(),
        Moved: (() => {
            return defineComponent(
                world,
                { player: RecsType.BigInt, direction: RecsType.Number },
                {
                    metadata: {
                        name: "dojo_starter-Moved",
                        types: ["contractaddress", "enum"],
                        customTypes: ["Direction"],
                    },
                }
            );
        })(),
        Moves: (() => {
            return defineComponent(
                world,
                {
                    player: RecsType.BigInt,
                    remaining: RecsType.Number,
                    last_direction: RecsType.Number,
                    can_move: RecsType.Boolean,
                },
                {
                    metadata: {
                        name: "dojo_starter-Moves",
                        types: ["contractaddress", "u8", "enum", "bool"],
                        customTypes: ["Direction"],
                    },
                }
            );
        })(),
        Position: (() => {
            return defineComponent(
                world,
                {
                    player: RecsType.BigInt,
                    vec: { x: RecsType.Number, y: RecsType.Number },
                },
                {
                    metadata: {
                        name: "dojo_starter-Position",
                        types: ["contractaddress", "u32", "u32"],
                        customTypes: ["Vec2"],
                    },
                }
            );
        })(),
    };
}
