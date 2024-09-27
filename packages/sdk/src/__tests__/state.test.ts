import { createDojoStore } from "../state/zustand";
import { ParsedEntity } from "../types";
import { describe, expect, beforeEach, test, vi } from "vitest";
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

describe("createDojoStore", () => {
    let useStore: ReturnType<typeof createDojoStore<MockSchemaType>>;
    let initialPlayer: MockParsedEntity;
    let initialGame: MockParsedEntity;
    let initialItem: MockParsedEntity;
    let initialGalaxy: MockParsedEntity;

    beforeEach(() => {
        useStore = createDojoStore<MockSchemaType>();
        initialPlayer = {
            entityId: "player1",
            models: {
                world: {
                    player: {
                        fieldOrder: ["id", "name", "score"],
                        id: "player1",
                        name: "Alice",
                        score: 100,
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
                        fieldOrder: ["id", "status"],
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
                        fieldOrder: ["id", "type", "durability"],
                        id: "item1",
                        type: "sword",
                        durability: 50,
                    },
                },
                universe: {},
            },
        };
        initialGalaxy = {
            entityId: "galaxy1",
            models: {
                world: {},
                universe: {
                    galaxy: {
                        fieldOrder: ["id", "name"],
                        id: "galaxy1",
                        name: "Milky Way",
                    },
                },
            },
        };
    });

    test("should initialize with empty entities and pendingTransactions", () => {
        const state = useStore.getState();
        expect(state.entities).toEqual({});
        expect(state.pendingTransactions).toEqual({});
    });

    test("setEntities should add entities to the store", () => {
        useStore
            .getState()
            .setEntities([
                initialPlayer,
                initialGame,
                initialItem,
                initialGalaxy,
            ]);
        const state = useStore.getState();
        expect(state.entities["player1"]).toEqual(initialPlayer);
        expect(state.entities["game1"]).toEqual(initialGame);
        expect(state.entities["item1"]).toEqual(initialItem);
        expect(state.entities["galaxy1"]).toEqual(initialGalaxy);
    });

    test("updateEntity should update an existing entity", () => {
        useStore.getState().setEntities([initialPlayer]);
        useStore.getState().updateEntity({
            entityId: "player1",
            models: {
                world: {
                    player: {
                        name: "Bob",
                    },
                },
                universe: {},
            },
        });
        const state = useStore.getState();
        expect(state.entities["player1"].models.world?.player?.name).toEqual(
            "Bob"
        );
    });

    test("updateEntity should not add a new entity if entityId does not exist", () => {
        useStore.getState().updateEntity({
            entityId: "nonexistent",
            models: {
                world: {
                    player: {
                        name: "Charlie",
                    },
                },
                universe: {},
            },
        });
        const state = useStore.getState();
        expect(state.entities["nonexistent"]).toBeUndefined();
    });

    test("applyOptimisticUpdate should apply updates and add to pendingTransactions", () => {
        useStore.getState().setEntities([initialItem]);

        const updateFn = (draft: any) => {
            draft.entities["item1"].models.world!.item!.durability = 30;
        };

        useStore.getState().applyOptimisticUpdate("txn1", updateFn);

        const state = useStore.getState();
        expect(state.entities["item1"].models.world?.item?.durability).toEqual(
            30
        );
        expect(state.pendingTransactions["txn1"]).toBeDefined();
        expect(state.pendingTransactions["txn1"].transactionId).toBe("txn1");
    });

    test("revertOptimisticUpdate should revert changes using inverse patches", () => {
        useStore.getState().setEntities([initialItem]);

        const updateFn = (draft: any) => {
            draft.entities["item1"].models.world!.item!.durability = 30;
        };

        useStore.getState().applyOptimisticUpdate("txn1", updateFn);
        // Revert the optimistic update
        useStore.getState().revertOptimisticUpdate("txn1");

        const state = useStore.getState();
        expect(state.entities["item1"].models.world?.item?.durability).toEqual(
            50
        );
        expect(state.pendingTransactions["txn1"]).toBeUndefined();
    });

    test("confirmTransaction should remove the transaction from pendingTransactions", () => {
        useStore.getState().setEntities([initialItem]);

        const updateFn = (draft: any) => {
            draft.entities["item1"].models.world!.item!.durability = 30;
        };

        useStore.getState().applyOptimisticUpdate("txn1", updateFn);
        // Confirm the transaction
        useStore.getState().confirmTransaction("txn1");

        const state = useStore.getState();
        expect(state.entities["item1"].models.world?.item?.durability).toEqual(
            30
        );
        expect(state.pendingTransactions["txn1"]).toBeUndefined();
    });
    test("subscribeToEntity should call listener on entity updates", () => {
        const listener = vi.fn();
        const unsubscribe = useStore
            .getState()
            .subscribeToEntity("player1", listener);

        // Update entity
        useStore.getState().setEntities([initialPlayer]);

        expect(listener).toHaveBeenCalledWith(initialPlayer);

        // Update entity again
        const updatedPlayer = {
            ...initialPlayer,
            models: {
                world: {
                    player: {
                        ...initialPlayer.models.world!.player!,
                        name: "Charlie",
                    },
                },
                universe: {}, // Add the required universe property
            },
        };
        useStore.getState().updateEntity(updatedPlayer);
        expect(listener).toHaveBeenCalledWith(updatedPlayer);

        unsubscribe();
        // Further updates should not call listener
        useStore.getState().updateEntity({
            entityId: "player1",
            models: {
                world: {
                    player: {
                        name: "Dave",
                    },
                },
                universe: {},
            },
        });
        expect(listener).toHaveBeenCalledTimes(2);
    });
    test("waitForEntityChange should resolve when predicate is met", async () => {
        useStore.getState().setEntities([initialGame]);

        const promise = useStore
            .getState()
            .waitForEntityChange(
                "game1",
                (entity) => entity?.models.world?.game?.status === "completed",
                1000
            );

        // Simulate async update
        setTimeout(() => {
            useStore.getState().updateEntity({
                entityId: "game1",
                models: {
                    world: {
                        game: {
                            status: "completed",
                        },
                    },
                    universe: {},
                },
            });
        }, 100);

        const result = await promise;
        expect(result?.models.world?.game?.status).toBe("completed");
    });

    test("waitForEntityChange should reject on timeout", async () => {
        useStore.getState().setEntities([initialGame]);

        const promise = useStore
            .getState()
            .waitForEntityChange(
                "game1",
                (entity) => entity?.models.world?.game?.status === "never",
                500
            );

        // Do not update the entity to meet predicate

        await expect(promise).rejects.toThrow(
            "waitForEntityChange: Timeout of 500ms exceeded"
        );
    });

    test("getEntity should return the correct entity", () => {
        useStore.getState().setEntities([initialGalaxy]);
        const entity = useStore.getState().getEntity("galaxy1");
        expect(entity).toEqual(initialGalaxy);
    });

    test("getEntities should return all entities", () => {
        const player2: MockParsedEntity = {
            entityId: "player2",
            models: {
                world: {
                    player: {
                        fieldOrder: ["id", "name", "score"],
                        id: "player2",
                        name: "Bob",
                        score: 80,
                    },
                },
                universe: {},
            },
        };
        useStore
            .getState()
            .setEntities([
                initialPlayer,
                initialGame,
                initialItem,
                initialGalaxy,
                player2,
            ]);
        const entities = useStore.getState().getEntities();
        expect(entities).toHaveLength(5);
        expect(entities).toContainEqual(initialPlayer);
        expect(entities).toContainEqual(initialGame);
        expect(entities).toContainEqual(initialItem);
        expect(entities).toContainEqual(initialGalaxy);
        expect(entities).toContainEqual(player2);
    });

    test("getEntities should apply the filter correctly", () => {
        const item2: MockParsedEntity = {
            entityId: "item2",
            models: {
                world: {
                    item: {
                        fieldOrder: ["id", "type", "durability"],
                        id: "item2",
                        type: "shield",
                        durability: 80,
                    },
                },
                universe: {},
            },
        };
        useStore.getState().setEntities([initialItem, item2]);
        const filtered = useStore
            .getState()
            .getEntities(
                (entity) => (entity.models.world?.item?.durability ?? 0) > 50
            );
        expect(filtered).toHaveLength(1);
        expect(filtered[0]).toEqual(item2);
    });

    test("getEntitiesByModel should return entities matching the specified namespace and model", () => {
        const player2: MockParsedEntity = {
            entityId: "player2",
            models: {
                world: {
                    player: {
                        fieldOrder: ["id", "name", "score"],
                        id: "player2",
                        name: "Bob",
                        score: 80,
                    },
                },
                universe: {},
            },
        };
        const galaxy2: MockParsedEntity = {
            entityId: "galaxy2",
            models: {
                world: {},
                universe: {
                    galaxy: {
                        fieldOrder: ["id", "name"],
                        id: "galaxy2",
                        name: "Andromeda",
                    },
                },
            },
        };
        useStore
            .getState()
            .setEntities([initialPlayer, player2, initialGalaxy, galaxy2]);

        const resultWorldPlayer = useStore
            .getState()
            .getEntitiesByModel("world", "player");
        expect(resultWorldPlayer).toHaveLength(2);
        expect(resultWorldPlayer).toContainEqual(initialPlayer);
        expect(resultWorldPlayer).toContainEqual(player2);

        const resultUniverseGalaxy = useStore
            .getState()
            .getEntitiesByModel("universe", "galaxy");
        expect(resultUniverseGalaxy).toHaveLength(2);
        expect(resultUniverseGalaxy).toContainEqual(initialGalaxy);
        expect(resultUniverseGalaxy).toContainEqual(galaxy2);
    });
});
