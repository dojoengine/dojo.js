import { createDojoStore } from "../state";
import { ParsedEntity } from "../types";
import { describe, it, beforeEach } from "vitest";
import Benchmark from "benchmark";
import {
    MockSchemaType,
    PlayerModel,
    GameModel,
    ItemModel,
    GalaxyModel,
} from "../__example__/index";

interface MockParsedEntity extends ParsedEntity<MockSchemaType> {
    entityId: string;
    models: {
        world: {
            player?: Partial<PlayerModel>;
            game?: Partial<GameModel>;
            item?: Partial<ItemModel>;
        };
        universe: {
            galaxy?: Partial<GalaxyModel>;
        };
    };
}

describe("Zustand Store Performance Tests", () => {
    let useStore: ReturnType<typeof createDojoStore<MockSchemaType>>;
    let mockEntities: MockParsedEntity[] = [];

    beforeEach(() => {
        useStore = createDojoStore<MockSchemaType>();
        mockEntities = []; // Reset the mockEntities array before each test
        // Generate a large number of mock entities for testing
        const numberOfEntities = 1000;
        for (let i = 0; i < numberOfEntities; i++) {
            mockEntities.push({
                entityId: `entity${i}`,
                models: {
                    world: {
                        player: {
                            fieldOrder: ["id", "name", "score"],
                            id: `player${i}`,
                            name: `Player${i}`,
                            score: i,
                        },
                        game: {
                            fieldOrder: ["id", "status"],
                            id: `game${i}`,
                            status: i % 2 === 0 ? "active" : "inactive",
                        },
                        item: {
                            fieldOrder: ["id", "type", "durability"],
                            id: `item${i}`,
                            type: i % 3 === 0 ? "sword" : "shield",
                            durability: 100 - (i % 100),
                        },
                    },
                    universe: {
                        galaxy: {
                            fieldOrder: ["id", "name"],
                            id: `galaxy${i}`,
                            name: `Galaxy${i}`,
                        },
                    },
                },
            });
        }
    });

    it("should benchmark setEntities performance", async () => {
        const suite = new Benchmark.Suite();

        suite
            .add("setEntities", () => {
                useStore.getState().setEntities(mockEntities);
            })
            .on("cycle", (event: any) => {
                console.log(String(event.target));
            })
            .on("complete", function (this: any) {
                console.log("Fastest is " + this.filter("fastest").map("name"));
            })
            .run({ async: false });

        // Optional: Assert that setEntities completes within a reasonable time
        // Example: expect(setEntitiesTime).toBeLessThan(100); // in milliseconds
    });

    it("should benchmark updateEntity performance", async () => {
        // First, set entities
        useStore.getState().setEntities(mockEntities);

        const suite = new Benchmark.Suite();

        suite
            .add("updateEntity", () => {
                useStore.getState().updateEntity({
                    entityId: "entity500",
                    models: {
                        world: {
                            player: {
                                name: "UpdatedPlayer500",
                                score: 999,
                            },
                        },
                        universe: {},
                    },
                });
            })
            .on("cycle", (event: any) => {
                console.log(String(event.target));
            })
            .on("complete", function (this: any) {
                console.log("Fastest is " + this.filter("fastest").map("name"));
            })
            .run({ async: false });
    });

    it("should benchmark applyOptimisticUpdate performance", async () => {
        // First, set entities
        useStore.getState().setEntities(mockEntities);

        const suite = new Benchmark.Suite();

        suite
            .add("applyOptimisticUpdate", () => {
                useStore
                    .getState()
                    .applyOptimisticUpdate("txn_perf", (draft) => {
                        draft.entities[
                            "entity500"
                        ].models.world!.item!.durability = 75;
                    });
            })
            .on("cycle", (event: any) => {
                console.log(String(event.target));
            })
            .on("complete", function (this: any) {
                console.log("Fastest is " + this.filter("fastest").map("name"));
            })
            .run({ async: false });
    });

    it("should benchmark revertOptimisticUpdate performance", async () => {
        // First, set entities
        useStore.getState().setEntities(mockEntities);

        // Apply an optimistic update
        useStore.getState().applyOptimisticUpdate("txn_perf", (draft) => {
            draft.entities["entity500"].models.world!.item!.durability = 75;
        });

        const suite = new Benchmark.Suite();

        suite
            .add("revertOptimisticUpdate", () => {
                useStore.getState().revertOptimisticUpdate("txn_perf");
            })
            .on("cycle", (event: any) => {
                console.log(String(event.target));
            })
            .on("complete", function (this: any) {
                console.log("Fastest is " + this.filter("fastest").map("name"));
            })
            .run({ async: false });
    });
});
