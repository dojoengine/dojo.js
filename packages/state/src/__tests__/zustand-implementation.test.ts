import { describe, it, expect, beforeEach } from "bun:test";
import { createDojoStore } from "../zustand";
import { createBatchTestData, testData } from "./test-utils";

describe("Zustand State Implementation", () => {
    let store;

    beforeEach(() => {
        store = createDojoStore();
    });

    describe("Entity Operations", () => {
        it("should set single entity", () => {
            const entityData = Object.values(testData)[0];
            store.getState().setEntities([entityData]);

            const entity = store.getState().getEntity(entityData.entityId);
            expect(entity).toEqual(entityData);
        });

        it("should set multiple entities", () => {
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            entities.forEach((entity) => {
                expect(store.getState().getEntity(entity.entityId)).toEqual(
                    entity
                );
            });
        });

        it("should merge entity data", () => {
            const initialData = createBatchTestData(3);
            const entities = Object.values(initialData);
            store.getState().setEntities(entities);

            // Update with partial data
            const updatedEntity = {
                ...entities[0],
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 99, y: 99 },
                            player: entities[0].models.dojo_starter.Position
                                .player,
                        },
                    },
                },
            };

            store.getState().mergeEntities([updatedEntity]);
            const result = store.getState().getEntity(entities[0].entityId);

            expect(result.models.dojo_starter.Position.vec).toEqual({
                x: 99,
                y: 99,
            });
            expect(result.models.dojo_starter.Moves).toBeDefined();
        });

        it("should update single entity", () => {
            const entity = Object.values(testData)[0];
            store.getState().setEntities([entity]);

            const updatedEntity = {
                entityId: entity.entityId,
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 50, y: 50 },
                            player: entity.models.dojo_starter.Position.player,
                        },
                        Moves: {
                            ...entity.models.dojo_starter.Moves,
                            remaining: 10,
                        },
                    },
                },
            };

            store.getState().updateEntity(updatedEntity);
            const result = store.getState().getEntity(entity.entityId);

            expect(result.models.dojo_starter.Position.vec).toEqual({
                x: 50,
                y: 50,
            });
            expect(result.models.dojo_starter.Moves.remaining).toBe(10);
        });
    });

    describe("Query Operations", () => {
        it("should get entities by model", () => {
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            const results = store
                .getState()
                .getEntitiesByModel("dojo_starter", "Position");
            expect(results.length).toBeGreaterThan(0);
            results.forEach((entity) => {
                expect(entity.models.dojo_starter.Position).toBeDefined();
            });
        });

        it("should filter entities", () => {
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            const filtered = store
                .getState()
                .getEntities(
                    (entity) => entity.models.dojo_starter.Moves?.remaining > 75
                );

            filtered.forEach((entity) => {
                expect(
                    entity.models.dojo_starter.Moves.remaining
                ).toBeGreaterThan(75);
            });
        });

        it("should get all entities", () => {
            const entities = Object.values(testData);
            store.getState().setEntities(entities);

            const allEntities = store.getState().getEntities();
            expect(allEntities.length).toBe(entities.length);
        });

        it("should return undefined for non-existent entity", () => {
            const result = store.getState().getEntity("non-existent-id");
            expect(result).toBeUndefined();
        });
    });

    describe("Historical State", () => {
        it("should track entity history", () => {
            const entity = Object.values(testData)[0];

            // Set initial state
            store.getState().setHistoricalEntities([entity]);

            // Update entity
            const updated = {
                ...entity,
                models: {
                    ...entity.models,
                    dojo_starter: {
                        ...entity.models.dojo_starter,
                        Position: {
                            vec: { x: 100, y: 100 },
                            player: entity.models.dojo_starter.Position.player,
                        },
                    },
                },
            };
            store.getState().setHistoricalEntities([updated]);

            const history = store
                .getState()
                .getHistoricalEntities(entity.entityId);
            expect(history.length).toBe(2);
            expect(history[0]).toEqual(entity);
            expect(history[1]).toEqual(updated);
        });

        it("should not duplicate identical historical states", () => {
            const entity = Object.values(testData)[0];

            // Set same state twice
            store.getState().setHistoricalEntities([entity]);
            store.getState().setHistoricalEntities([entity]);

            const history = store
                .getState()
                .getHistoricalEntities(entity.entityId);
            expect(history.length).toBe(1);
        });

        it("should get entity at specific index", () => {
            const entity = Object.values(testData)[0];
            const updated = {
                ...entity,
                models: {
                    ...entity.models,
                    dojo_starter: {
                        ...entity.models.dojo_starter,
                        Position: {
                            vec: { x: 200, y: 200 },
                            player: entity.models.dojo_starter.Position.player,
                        },
                    },
                },
            };

            store.getState().setHistoricalEntities([entity]);
            store.getState().setHistoricalEntities([updated]);

            const firstState = store
                .getState()
                .getEntityAtIndex(entity.entityId, 0);
            const secondState = store
                .getState()
                .getEntityAtIndex(entity.entityId, 1);

            expect(firstState).toEqual(entity);
            expect(secondState).toEqual(updated);
        });

        it("should clear historical entities", () => {
            const entities = Object.values(testData).slice(0, 2);

            entities.forEach((entity) => {
                store.getState().setHistoricalEntities([entity]);
            });

            // Clear specific entity history
            store.getState().clearHistoricalEntities(entities[0].entityId);
            expect(
                store.getState().getHistoricalEntities(entities[0].entityId)
                    .length
            ).toBe(0);
            expect(
                store.getState().getHistoricalEntities(entities[1].entityId)
                    .length
            ).toBe(1);

            // Clear all history
            store.getState().clearHistoricalEntities();
            expect(
                store.getState().getHistoricalEntities(entities[1].entityId)
                    .length
            ).toBe(0);
        });
    });

    describe("Optimistic Updates", () => {
        it("should apply and revert optimistic updates", () => {
            const entity = Object.values(testData)[0];
            store.getState().setEntities([entity]);

            const transactionId = "tx-123";

            // Apply optimistic update
            store.getState().applyOptimisticUpdate(transactionId, (draft) => {
                draft.entities[
                    entity.entityId
                ].models.dojo_starter.Position.vec = { x: 999, y: 999 };
            });

            let result = store.getState().getEntity(entity.entityId);
            expect(result.models.dojo_starter.Position.vec).toEqual({
                x: 999,
                y: 999,
            });

            // Revert optimistic update
            store.getState().revertOptimisticUpdate(transactionId);

            result = store.getState().getEntity(entity.entityId);
            expect(result.models.dojo_starter.Position.vec).toEqual(
                entity.models.dojo_starter.Position.vec
            );
        });

        it("should confirm transaction and clear pending", () => {
            const entity = Object.values(testData)[0];
            store.getState().setEntities([entity]);

            const transactionId = "tx-456";

            store.getState().applyOptimisticUpdate(transactionId, (draft) => {
                draft.entities[
                    entity.entityId
                ].models.dojo_starter.Moves.remaining = 1;
            });

            expect(
                store.getState().pendingTransactions[transactionId]
            ).toBeDefined();

            store.getState().confirmTransaction(transactionId);

            expect(
                store.getState().pendingTransactions[transactionId]
            ).toBeUndefined();
            expect(
                store.getState().getEntity(entity.entityId).models.dojo_starter
                    .Moves.remaining
            ).toBe(1);
        });
    });

    describe("Store Reset", () => {
        it("should reset entire store", () => {
            const entities = Object.values(testData);
            store.getState().setEntities(entities);
            store.getState().setHistoricalEntities(entities);

            store.getState().resetStore();

            expect(store.getState().entities).toEqual({});
            expect(store.getState().historical_entities).toEqual({});
            expect(store.getState().pendingTransactions).toEqual({});
        });
    });

    describe("Subscriptions", () => {
        it("should subscribe to entity changes", () => {
            const entity = Object.values(testData)[0];
            let callbackCalled = false;

            const unsubscribe = store
                .getState()
                .subscribeToEntity(entity.entityId, (ent) => {
                    // Callback gets called when entity changes
                    expect(ent).toEqual(entity);
                    callbackCalled = true;
                    unsubscribe();
                });

            // Trigger change
            store.getState().setEntities([entity]);

            // Verify callback was called
            expect(callbackCalled).toBe(true);
        });

        it("should wait for entity change with predicate", async () => {
            const entity = Object.values(testData)[0];

            const promise = store
                .getState()
                .waitForEntityChange(
                    entity.entityId,
                    (ent) => ent?.models.dojo_starter.Position.vec.x === 500,
                    5000
                );

            // Set entity with different position
            store.getState().setEntities([entity]);

            // Update to match predicate
            const updated = {
                ...entity,
                models: {
                    ...entity.models,
                    dojo_starter: {
                        ...entity.models.dojo_starter,
                        Position: {
                            vec: { x: 500, y: 500 },
                            player: entity.models.dojo_starter.Position.player,
                        },
                    },
                },
            };
            store.getState().updateEntity(updated);

            const result = await promise;
            expect(result.models.dojo_starter.Position.vec.x).toBe(500);
        });
    });
});
