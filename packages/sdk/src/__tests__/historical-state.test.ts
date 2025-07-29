import { beforeEach, describe, expect, test } from "vitest";
import type {
    GalaxyModel,
    GameModel,
    ItemModel,
    MockSchemaType,
    PlayerModel,
} from "../__example__/index";
import type { ParsedEntity } from "../internal/types";
import { createDojoStore } from "../web/state";

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

describe("Historical Entity Store", () => {
    let useStore: ReturnType<typeof createDojoStore<MockSchemaType>>;
    let initialPlayer: MockParsedEntity;
    let updatedPlayer: MockParsedEntity;
    let differentPlayer: MockParsedEntity;
    let initialGame: MockParsedEntity;
    let initialItem: MockParsedEntity;

    beforeEach(() => {
        useStore = createDojoStore<MockSchemaType>();

        // Reset historical entities
        useStore.getState().clearHistoricalEntities();

        initialPlayer = {
            entityId: "player1",
            models: {
                world: {
                    player: {
                        id: "player1",
                        name: "Alice",
                        score: 100,
                    },
                },
                universe: {},
            },
        };

        // Same as initialPlayer (for deduplication testing)
        updatedPlayer = {
            entityId: "player1",
            models: {
                world: {
                    player: {
                        id: "player1",
                        name: "Alice",
                        score: 100,
                    },
                },
                universe: {},
            },
        };

        // Different from initialPlayer
        differentPlayer = {
            entityId: "player1",
            models: {
                world: {
                    player: {
                        id: "player1",
                        name: "Alice",
                        score: 120, // Different score
                    },
                },
                universe: {},
            },
        };

        initialGame = {
            entityId: "game1",
            models: {
                world: {
                    game: {
                        id: "game1",
                        status: "active",
                    },
                },
                universe: {},
            },
        };

        initialItem = {
            entityId: "item1",
            models: {
                world: {
                    item: {
                        id: "item1",
                        type: "sword",
                        durability: 50,
                    },
                },
                universe: {},
            },
        };
    });

    describe("setHistoricalEntities", () => {
        test("should add first entity state to history", () => {
            useStore.getState().setHistoricalEntities([initialPlayer]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1);
            expect(history[0]).toEqual(initialPlayer);
        });

        test("should deduplicate identical consecutive states", () => {
            // Add same entity multiple times
            useStore.getState().setHistoricalEntities([
                initialPlayer,
                updatedPlayer, // Same as initialPlayer
                updatedPlayer, // Same as initialPlayer
            ]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1); // Should only have 1 entry due to deduplication
            expect(history[0]).toEqual(initialPlayer);
        });

        test("should add different states to history", () => {
            // Add entities with different states
            useStore.getState().setHistoricalEntities([initialPlayer]);
            useStore.getState().setHistoricalEntities([differentPlayer]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(2);
            expect(history[0]).toEqual(initialPlayer);
            expect(history[1]).toEqual(differentPlayer);
        });

        test("should handle multiple entities simultaneously", () => {
            useStore
                .getState()
                .setHistoricalEntities([
                    initialPlayer,
                    initialGame,
                    initialItem,
                ]);

            expect(
                useStore.getState().getHistoricalEntities("player1")
            ).toHaveLength(1);
            expect(
                useStore.getState().getHistoricalEntities("game1")
            ).toHaveLength(1);
            expect(
                useStore.getState().getHistoricalEntities("item1")
            ).toHaveLength(1);
        });
    });

    describe("updateHistoricalEntity", () => {
        test("should add first update to empty history", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1);
            expect(history[0]).toEqual(initialPlayer);
        });

        test("should deduplicate identical updates", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(updatedPlayer); // Same as initialPlayer
            useStore.getState().updateHistoricalEntity(updatedPlayer); // Same as initialPlayer

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1); // All updates are identical
        });

        test("should add changed updates to history", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(differentPlayer);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(2);
            expect(history[0]).toEqual(initialPlayer);
            expect(history[1]).toEqual(differentPlayer);
        });

        test("should maintain chronological order", () => {
            const states = [
                {
                    ...initialPlayer,
                    models: {
                        ...initialPlayer.models,
                        world: {
                            player: {
                                ...initialPlayer.models.world.player,
                                score: 100,
                            },
                        },
                    },
                },
                {
                    ...initialPlayer,
                    models: {
                        ...initialPlayer.models,
                        world: {
                            player: {
                                ...initialPlayer.models.world.player,
                                score: 110,
                            },
                        },
                    },
                },
                {
                    ...initialPlayer,
                    models: {
                        ...initialPlayer.models,
                        world: {
                            player: {
                                ...initialPlayer.models.world.player,
                                score: 120,
                            },
                        },
                    },
                },
                {
                    ...initialPlayer,
                    models: {
                        ...initialPlayer.models,
                        world: {
                            player: {
                                ...initialPlayer.models.world.player,
                                score: 130,
                            },
                        },
                    },
                },
            ];

            states.forEach((state) =>
                useStore.getState().updateHistoricalEntity(state)
            );

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(4);
            expect(history[0].models.world.player?.score).toBe(100);
            expect(history[1].models.world.player?.score).toBe(110);
            expect(history[2].models.world.player?.score).toBe(120);
            expect(history[3].models.world.player?.score).toBe(130);
        });
    });

    describe("mergeHistoricalEntities", () => {
        test("should merge and add first state", () => {
            useStore.getState().mergeHistoricalEntities([initialPlayer]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1);
            expect(history[0]).toEqual(initialPlayer);
        });

        test("should deduplicate identical merged states", () => {
            useStore.getState().mergeHistoricalEntities([initialPlayer]);
            useStore.getState().mergeHistoricalEntities([updatedPlayer]); // Same as initialPlayer

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1);
        });

        test("should add different merged states", () => {
            useStore.getState().mergeHistoricalEntities([initialPlayer]);
            useStore.getState().mergeHistoricalEntities([differentPlayer]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(2);
        });

        test("should handle partial model updates with deduplication", () => {
            useStore.getState().mergeHistoricalEntities([initialPlayer]);

            // Merge with an update that has different values in partial fields
            const partialUpdate = {
                entityId: "player1",
                models: {
                    world: {
                        player: {
                            score: 110, // Different score
                        },
                    },
                    universe: {},
                },
            };

            useStore.getState().mergeHistoricalEntities([partialUpdate]);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(2); // Should have 2 entries due to different values

            // Now test deduplication with same partial update
            useStore.getState().mergeHistoricalEntities([partialUpdate]);

            const historyAfterDuplicate = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(historyAfterDuplicate).toHaveLength(2); // Should still be 2 due to deduplication
        });
    });

    describe("getHistoricalEntities", () => {
        test("should return empty array for non-existent entity", () => {
            const history = useStore
                .getState()
                .getHistoricalEntities("nonexistent");
            expect(history).toEqual([]);
        });

        test("should return all historical states", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(differentPlayer);

            const playerWithNewName = {
                ...differentPlayer,
                models: {
                    ...differentPlayer.models,
                    world: {
                        player: {
                            ...differentPlayer.models.world.player,
                            name: "Bob",
                        },
                    },
                },
            };
            useStore.getState().updateHistoricalEntity(playerWithNewName);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(3);
        });

        test("should return states in chronological order", () => {
            const states = [100, 200, 300].map((score) => ({
                ...initialPlayer,
                models: {
                    ...initialPlayer.models,
                    world: {
                        player: {
                            ...initialPlayer.models.world.player,
                            score,
                        },
                    },
                },
            }));

            states.forEach((state) =>
                useStore.getState().updateHistoricalEntity(state)
            );

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history[0].models.world.player?.score).toBe(100);
            expect(history[1].models.world.player?.score).toBe(200);
            expect(history[2].models.world.player?.score).toBe(300);
        });
    });

    describe("getEntityAtIndex", () => {
        test("should return undefined for invalid indices", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);

            expect(
                useStore.getState().getEntityAtIndex("player1", -1)
            ).toBeUndefined();
            expect(
                useStore.getState().getEntityAtIndex("player1", 10)
            ).toBeUndefined();
            expect(
                useStore.getState().getEntityAtIndex("nonexistent", 0)
            ).toBeUndefined();
        });

        test("should return correct state at specific index", () => {
            const states = [100, 200, 300].map((score) => ({
                ...initialPlayer,
                models: {
                    ...initialPlayer.models,
                    world: {
                        player: {
                            ...initialPlayer.models.world.player,
                            score,
                        },
                    },
                },
            }));

            states.forEach((state) =>
                useStore.getState().updateHistoricalEntity(state)
            );

            expect(
                useStore.getState().getEntityAtIndex("player1", 0)?.models.world
                    .player?.score
            ).toBe(100);
            expect(
                useStore.getState().getEntityAtIndex("player1", 1)?.models.world
                    .player?.score
            ).toBe(200);
            expect(
                useStore.getState().getEntityAtIndex("player1", 2)?.models.world
                    .player?.score
            ).toBe(300);
        });

        test("should handle negative indices as undefined", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);

            expect(
                useStore.getState().getEntityAtIndex("player1", -1)
            ).toBeUndefined();
            expect(
                useStore.getState().getEntityAtIndex("player1", -10)
            ).toBeUndefined();
        });
    });

    describe("clearHistoricalEntities", () => {
        test("should clear history for specific entity", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(initialGame);

            expect(
                useStore.getState().getHistoricalEntities("player1")
            ).toHaveLength(1);
            expect(
                useStore.getState().getHistoricalEntities("game1")
            ).toHaveLength(1);

            useStore.getState().clearHistoricalEntities("player1");

            expect(
                useStore.getState().getHistoricalEntities("player1")
            ).toHaveLength(0);
            expect(
                useStore.getState().getHistoricalEntities("game1")
            ).toHaveLength(1); // Unchanged
        });

        test("should clear all historical data when no entityId", () => {
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(initialGame);
            useStore.getState().updateHistoricalEntity(initialItem);

            expect(
                useStore.getState().getHistoricalEntities("player1")
            ).toHaveLength(1);
            expect(
                useStore.getState().getHistoricalEntities("game1")
            ).toHaveLength(1);
            expect(
                useStore.getState().getHistoricalEntities("item1")
            ).toHaveLength(1);

            useStore.getState().clearHistoricalEntities();

            expect(
                useStore.getState().getHistoricalEntities("player1")
            ).toHaveLength(0);
            expect(
                useStore.getState().getHistoricalEntities("game1")
            ).toHaveLength(0);
            expect(
                useStore.getState().getHistoricalEntities("item1")
            ).toHaveLength(0);
        });

        test("should not affect current entities store", () => {
            // Set current entities
            useStore.getState().setEntities([initialPlayer, initialGame]);

            // Add historical entities
            useStore.getState().updateHistoricalEntity(initialPlayer);
            useStore.getState().updateHistoricalEntity(initialGame);

            // Clear historical
            useStore.getState().clearHistoricalEntities();

            // Current entities should remain
            expect(useStore.getState().getEntity("player1")).toEqual(
                initialPlayer
            );
            expect(useStore.getState().getEntity("game1")).toEqual(initialGame);
        });
    });

    describe("Complex deduplication scenarios", () => {
        test("should handle rapid consecutive updates", () => {
            // Simulate rapid updates with same data
            for (let i = 0; i < 10; i++) {
                useStore.getState().updateHistoricalEntity(initialPlayer);
            }

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1); // All updates are identical
        });

        test("should deduplicate across different update methods", () => {
            // Use different methods but same data
            useStore.getState().setHistoricalEntities([initialPlayer]);
            useStore.getState().updateHistoricalEntity(updatedPlayer); // Same as initialPlayer
            useStore.getState().mergeHistoricalEntities([updatedPlayer]); // Same as initialPlayer

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(1); // All methods added same data
        });

        test("should preserve first and last states when all intermediate are duplicates", () => {
            const firstState = { ...initialPlayer };
            const lastState = { ...differentPlayer };

            useStore.getState().updateHistoricalEntity(firstState);

            // Add many duplicate states
            for (let i = 0; i < 5; i++) {
                useStore.getState().updateHistoricalEntity(firstState);
            }

            useStore.getState().updateHistoricalEntity(lastState);

            const history = useStore
                .getState()
                .getHistoricalEntities("player1");
            expect(history).toHaveLength(2); // Only first and last (different) states
            expect(history[0]).toEqual(firstState);
            expect(history[1]).toEqual(lastState);
        });

        test("should handle deep nested model changes", () => {
            const complexEntity: MockParsedEntity = {
                entityId: "complex1",
                models: {
                    world: {
                        player: {
                            fieldOrder: ["id", "name", "score"],
                            id: "complex1",
                            name: "ComplexPlayer",
                            score: 100,
                        },
                        item: {
                            fieldOrder: ["id", "type", "durability"],
                            id: "sword1",
                            type: "legendary_sword",
                            durability: 100,
                        },
                    },
                    universe: {
                        galaxy: {
                            fieldOrder: ["id", "name"],
                            id: "galaxy1",
                            name: "Andromeda",
                        },
                    },
                },
            };

            useStore.getState().updateHistoricalEntity(complexEntity);

            // Same entity (should be deduplicated)
            const duplicateComplex = JSON.parse(JSON.stringify(complexEntity));
            useStore.getState().updateHistoricalEntity(duplicateComplex);

            // Change nested value
            const modifiedComplex = JSON.parse(JSON.stringify(complexEntity));
            modifiedComplex.models.world.item.durability = 90;
            useStore.getState().updateHistoricalEntity(modifiedComplex);

            const history = useStore
                .getState()
                .getHistoricalEntities("complex1");
            expect(history).toHaveLength(2); // Original and modified
            expect(history[0].models.world.item?.durability).toBe(100);
            expect(history[1].models.world.item?.durability).toBe(90);
        });

        test("should handle entities with only entityId", () => {
            const minimalEntity = {
                entityId: "minimal1",
                models: {
                    world: {},
                    universe: {},
                },
            };

            useStore.getState().updateHistoricalEntity(minimalEntity);
            useStore.getState().updateHistoricalEntity(minimalEntity); // Duplicate

            const history = useStore
                .getState()
                .getHistoricalEntities("minimal1");
            expect(history).toHaveLength(1);
        });

        test("should detect changes in model field order", () => {
            const entity1 = {
                entityId: "order1",
                models: {
                    world: {
                        player: {
                            fieldOrder: ["id", "name", "score"],
                            id: "order1",
                            name: "Alice",
                            score: 100,
                        },
                    },
                    universe: {},
                },
            };

            const entity2 = {
                ...entity1,
                models: {
                    ...entity1.models,
                    world: {
                        player: {
                            ...entity1.models.world.player,
                            fieldOrder: ["id", "score", "name"], // Different order
                        },
                    },
                },
            };

            useStore.getState().updateHistoricalEntity(entity1);
            useStore.getState().updateHistoricalEntity(entity2);

            const history = useStore.getState().getHistoricalEntities("order1");
            expect(history).toHaveLength(2); // Different due to fieldOrder change
        });
    });
});
