import { describe, it, expect } from "bun:test";
import { createDojoStore } from "../zustand";
import { testData, createBatchTestData } from "./test-utils";

describe("State Implementation Consistency", () => {
    describe("Data Structure Consistency", () => {
        it("should maintain consistent entity structure", () => {
            const store = createDojoStore();
            const testEntity = Object.values(testData)[0];

            // Set entity in zustand
            store.getState().setEntities([testEntity]);
            const zustandEntity = store
                .getState()
                .getEntity(testEntity.entityId);

            // Verify structure matches input
            expect(zustandEntity).toHaveProperty("entityId");
            expect(zustandEntity).toHaveProperty("models");
            expect(zustandEntity.models).toHaveProperty("dojo_starter");
            expect(zustandEntity.models.dojo_starter).toHaveProperty(
                "Position"
            );
            expect(zustandEntity.models.dojo_starter).toHaveProperty("Moves");

            // Verify data integrity
            expect(zustandEntity.entityId).toBe(testEntity.entityId);
            expect(zustandEntity.models.dojo_starter.Position).toEqual(
                testEntity.models.dojo_starter.Position
            );
            expect(zustandEntity.models.dojo_starter.Moves).toEqual(
                testEntity.models.dojo_starter.Moves
            );
        });

        it("should handle batch operations consistently", () => {
            const store = createDojoStore();
            const batchData = createBatchTestData(10);
            const entities = Object.values(batchData);

            // Batch set
            store.getState().setEntities(entities);

            // Verify all entities are stored
            entities.forEach((entity) => {
                const stored = store.getState().getEntity(entity.entityId);
                expect(stored).toEqual(entity);
            });

            // Verify count
            const allEntities = store.getState().getEntities();
            expect(allEntities.length).toBe(entities.length);
        });

        it("should preserve entity IDs across operations", () => {
            const store = createDojoStore();
            const entities = Object.values(testData);

            store.getState().setEntities(entities);

            // Entity IDs should be preserved
            entities.forEach((entity) => {
                const stored = store.getState().getEntity(entity.entityId);
                expect(stored.entityId).toBe(entity.entityId);
            });
        });

        it("should maintain model namespace structure", () => {
            const store = createDojoStore();
            const entity = Object.values(testData)[0];

            store.getState().setEntities([entity]);
            const stored = store.getState().getEntity(entity.entityId);

            // Check namespace structure is preserved
            expect(stored.models).toHaveProperty("dojo_starter");
            expect(Object.keys(stored.models)).toEqual(["dojo_starter"]);

            // Check models within namespace
            const models = Object.keys(stored.models.dojo_starter);
            expect(models).toContain("Position");
            expect(models).toContain("Moves");
        });
    });

    describe("Query Result Consistency", () => {
        it("should return consistent filtered results", () => {
            const store = createDojoStore();
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            // Filter by position
            const filtered = store
                .getState()
                .getEntities(
                    (entity) => entity.models.dojo_starter.Position?.vec.x > 10
                );

            // Verify filter worked correctly
            expect(filtered.length).toBeGreaterThan(0);
            filtered.forEach((entity) => {
                expect(
                    entity.models.dojo_starter.Position.vec.x
                ).toBeGreaterThan(10);
            });

            // Filter by moves
            const highMoves = store
                .getState()
                .getEntities(
                    (entity) =>
                        entity.models.dojo_starter.Moves?.remaining >= 75
                );

            highMoves.forEach((entity) => {
                expect(
                    entity.models.dojo_starter.Moves.remaining
                ).toBeGreaterThanOrEqual(75);
            });
        });

        it("should handle model-based queries consistently", () => {
            const store = createDojoStore();
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            const withPosition = store
                .getState()
                .getEntitiesByModel("dojo_starter", "Position");
            const withMoves = store
                .getState()
                .getEntitiesByModel("dojo_starter", "Moves");

            expect(withPosition.length).toBeGreaterThan(0);
            expect(withMoves.length).toBeGreaterThan(0);

            // All entities should have both models in test data
            expect(withPosition.length).toBe(entities.length);
            expect(withMoves.length).toBe(entities.length);

            withPosition.forEach((entity) => {
                expect(entity.models.dojo_starter.Position).toBeDefined();
                expect(entity.models.dojo_starter.Position).toHaveProperty(
                    "vec"
                );
                expect(entity.models.dojo_starter.Position).toHaveProperty(
                    "player"
                );
            });

            withMoves.forEach((entity) => {
                expect(entity.models.dojo_starter.Moves).toBeDefined();
                expect(entity.models.dojo_starter.Moves).toHaveProperty(
                    "remaining"
                );
                expect(entity.models.dojo_starter.Moves).toHaveProperty(
                    "can_move"
                );
                expect(entity.models.dojo_starter.Moves).toHaveProperty(
                    "last_direction"
                );
            });
        });

        it("should handle complex queries consistently", () => {
            const store = createDojoStore();
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            // Complex filter: high remaining moves AND specific direction
            const complexFilter = store
                .getState()
                .getEntities(
                    (entity) =>
                        entity.models.dojo_starter.Moves?.remaining > 70 &&
                        entity.models.dojo_starter.Moves?.last_direction
                            ?.Some === "Left"
                );

            complexFilter.forEach((entity) => {
                expect(
                    entity.models.dojo_starter.Moves.remaining
                ).toBeGreaterThan(70);
                expect(
                    entity.models.dojo_starter.Moves.last_direction.Some
                ).toBe("Left");
            });
        });

        it("should return empty array for no matches", () => {
            const store = createDojoStore();
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            // Filter that matches nothing
            const noMatches = store
                .getState()
                .getEntities(
                    (entity) =>
                        entity.models.dojo_starter.Position?.vec.x > 1000
                );

            expect(noMatches).toEqual([]);
            expect(Array.isArray(noMatches)).toBe(true);
        });
    });

    describe("Update Operation Consistency", () => {
        it("should merge updates consistently", () => {
            const store = createDojoStore();
            const initial = Object.values(testData)[0];

            store.getState().setEntities([initial]);

            // Partial update - only Position
            const update = {
                entityId: initial.entityId,
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 999, y: 999 },
                            player: initial.models.dojo_starter.Position.player,
                        },
                    },
                },
            };

            store.getState().mergeEntities([update]);

            const result = store.getState().getEntity(initial.entityId);

            // Position should be updated
            expect(result.models.dojo_starter.Position.vec).toEqual({
                x: 999,
                y: 999,
            });

            // Moves should be preserved
            expect(result.models.dojo_starter.Moves).toEqual(
                initial.models.dojo_starter.Moves
            );
        });

        it("should handle nested updates consistently", () => {
            const store = createDojoStore();
            const initial = Object.values(testData)[0];

            store.getState().setEntities([initial]);

            // Update only specific nested field
            const partialUpdate = {
                entityId: initial.entityId,
                models: {
                    dojo_starter: {
                        Moves: {
                            ...initial.models.dojo_starter.Moves,
                            remaining: 1,
                        },
                    },
                },
            };

            store.getState().mergeEntities([partialUpdate]);

            const result = store.getState().getEntity(initial.entityId);

            // Only remaining should change
            expect(result.models.dojo_starter.Moves.remaining).toBe(1);
            expect(result.models.dojo_starter.Moves.can_move).toBe(
                initial.models.dojo_starter.Moves.can_move
            );
            expect(result.models.dojo_starter.Moves.last_direction).toEqual(
                initial.models.dojo_starter.Moves.last_direction
            );

            // Position should be unchanged
            expect(result.models.dojo_starter.Position).toEqual(
                initial.models.dojo_starter.Position
            );
        });

        it("should handle multiple sequential updates", () => {
            const store = createDojoStore();
            const initial = Object.values(testData)[0];

            store.getState().setEntities([initial]);

            // First update
            store.getState().updateEntity({
                entityId: initial.entityId,
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 100, y: 100 },
                            player: initial.models.dojo_starter.Position.player,
                        },
                        Moves: initial.models.dojo_starter.Moves,
                    },
                },
            });

            // Second update
            store.getState().updateEntity({
                entityId: initial.entityId,
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 200, y: 200 },
                            player: initial.models.dojo_starter.Position.player,
                        },
                        Moves: {
                            ...initial.models.dojo_starter.Moves,
                            remaining: 50,
                        },
                    },
                },
            });

            const result = store.getState().getEntity(initial.entityId);

            // Should have latest values
            expect(result.models.dojo_starter.Position.vec).toEqual({
                x: 200,
                y: 200,
            });
            expect(result.models.dojo_starter.Moves.remaining).toBe(50);
        });
    });

    describe("Random Data Consistency", () => {
        it("should handle randomly generated data consistently", () => {
            const store = createDojoStore();

            // Generate random data multiple times
            for (let i = 0; i < 10; i++) {
                const randomData = createBatchTestData(5);
                const entities = Object.values(randomData);

                store.getState().resetStore();
                store.getState().setEntities(entities);

                // Verify each entity maintains structure
                entities.forEach((entity) => {
                    const stored = store.getState().getEntity(entity.entityId);

                    expect(stored).toBeDefined();
                    expect(stored.entityId).toBe(entity.entityId);
                    expect(stored.models.dojo_starter.Position).toBeDefined();
                    expect(stored.models.dojo_starter.Moves).toBeDefined();

                    // Verify data types
                    expect(
                        typeof stored.models.dojo_starter.Position.vec.x
                    ).toBe("number");
                    expect(
                        typeof stored.models.dojo_starter.Position.vec.y
                    ).toBe("number");
                    expect(
                        typeof stored.models.dojo_starter.Moves.remaining
                    ).toBe("number");
                    expect(
                        typeof stored.models.dojo_starter.Moves.can_move
                    ).toBe("boolean");
                });
            }
        });

        it("should maintain data integrity with random operations", () => {
            const store = createDojoStore();
            const batchData = createBatchTestData(20);
            const entities = Object.values(batchData);

            // Set initial data
            store.getState().setEntities(entities);

            // Perform random updates
            const randomUpdates = entities.slice(0, 5).map((entity) => ({
                entityId: entity.entityId,
                models: {
                    dojo_starter: {
                        Position: {
                            vec: {
                                x: Math.floor(Math.random() * 100),
                                y: Math.floor(Math.random() * 100),
                            },
                            player: entity.models.dojo_starter.Position.player,
                        },
                    },
                },
            }));

            randomUpdates.forEach((update) => {
                store.getState().mergeEntities([update]);
            });

            // Verify all entities still exist
            expect(store.getState().getEntities().length).toBe(entities.length);

            // Verify updated entities have new values
            randomUpdates.forEach((update) => {
                const stored = store.getState().getEntity(update.entityId);
                expect(stored.models.dojo_starter.Position.vec).toEqual(
                    update.models.dojo_starter.Position.vec
                );

                // Moves should still exist
                expect(stored.models.dojo_starter.Moves).toBeDefined();
            });

            // Verify non-updated entities are unchanged
            const nonUpdatedIds = entities.slice(5).map((e) => e.entityId);

            nonUpdatedIds.forEach((id) => {
                const stored = store.getState().getEntity(id);
                const original = entities.find((e) => e.entityId === id);
                expect(stored).toEqual(original);
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle entities with same player but different positions", () => {
            const store = createDojoStore();
            const player =
                "0x0359b9068eadcaaa449c08b79a367c6fdfba9448c29e96934e3552dab0fdd950";

            const entity1 = {
                entityId: "0x001",
                models: {
                    dojo_starter: {
                        Position: { vec: { x: 10, y: 10 }, player },
                        Moves: {
                            remaining: 80,
                            player,
                            last_direction: { Some: "Up" },
                            can_move: true,
                        },
                    },
                },
            };

            const entity2 = {
                entityId: "0x002",
                models: {
                    dojo_starter: {
                        Position: { vec: { x: 20, y: 20 }, player },
                        Moves: {
                            remaining: 70,
                            player,
                            last_direction: { Some: "Down" },
                            can_move: true,
                        },
                    },
                },
            };

            store.getState().setEntities([entity1, entity2]);

            // Both entities should exist independently
            expect(store.getState().getEntity("0x001")).toEqual(entity1);
            expect(store.getState().getEntity("0x002")).toEqual(entity2);

            // Filter by player should return both
            const playerEntities = store
                .getState()
                .getEntities(
                    (e) => e.models.dojo_starter.Position.player === player
                );

            expect(playerEntities.length).toBe(2);
        });

        it("should handle very large coordinate values", () => {
            const store = createDojoStore();

            const entity = {
                entityId: "0x999",
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 999999, y: 999999 },
                            player: "0x123",
                        },
                        Moves: {
                            remaining: 999,
                            player: "0x123",
                            last_direction: { Some: "Up" },
                            can_move: true,
                        },
                    },
                },
            };

            store.getState().setEntities([entity]);
            const stored = store.getState().getEntity("0x999");

            expect(stored.models.dojo_starter.Position.vec.x).toBe(999999);
            expect(stored.models.dojo_starter.Position.vec.y).toBe(999999);
            expect(stored.models.dojo_starter.Moves.remaining).toBe(999);
        });

        it("should handle entities with missing optional fields", () => {
            const store = createDojoStore();

            const entityMinimal = {
                entityId: "0x777",
                models: {
                    dojo_starter: {
                        Position: { vec: { x: 5, y: 5 }, player: "0x456" },
                    },
                },
            };

            store.getState().setEntities([entityMinimal]);
            const stored = store.getState().getEntity("0x777");

            expect(stored).toEqual(entityMinimal);
            expect(stored.models.dojo_starter.Moves).toBeUndefined();
        });
    });
});
