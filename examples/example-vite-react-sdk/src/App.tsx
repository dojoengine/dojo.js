import { useEffect } from "react";
import "./App.css";
import { SDK } from "@dojoengine/sdk";
import { Schema } from "./bindings.ts";
import { useGameState } from "./state.ts";

import { v4 as uuidv4 } from "uuid";

function App({ db }: { db: SDK<Schema> }) {
    const state = useGameState((state) => state);
    const entities = useGameState((state) => state.entities);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await db.subscribeEntityQuery(
                {
                    dojo_starter: {
                        Moves: {
                            $: {},
                        },
                    },
                },
                (response) => {
                    if (response.error) {
                        console.error(
                            "Error setting up entity sync:",
                            response.error
                        );
                    } else if (
                        response.data &&
                        response.data[0].entityId !== "0x0"
                    ) {
                        state.setEntities(response.data);
                    }
                },
                { logging: true }
            );

            unsubscribe = () => subscription.cancel();
        };

        subscribe();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [db]);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                await db.getEntities(
                    {
                        dojo_starter: {
                            Position: {
                                $: {},
                            },
                        },
                    },
                    (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            state.setEntities(resp.data);
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, [db]);

    const optimisticUpdate = async () => {
        const entityId =
            "0x571368d35c8fe136adf81eecf96a72859c43de7efd8fdd3d6f0d17e308df984";

        const transactionId = uuidv4();

        state.applyOptimisticUpdate(transactionId, (draft) => {
            draft.entities[entityId].models.dojo_starter.Moves!.remaining = 10;
        });

        try {
            // Wait for the entity to be updated before full resolving the transaction. Reverts if the condition is not met.
            const updatedEntity = await state.waitForEntityChange(
                entityId,
                (entity) => {
                    // Define your specific condition here
                    return entity?.models.dojo_starter.Moves?.can_move === true;
                }
            );

            console.log("Entity has been updated to active:", updatedEntity);

            console.log("Updating entities...");
        } catch (error) {
            console.error("Error updating entities:", error);
            state.revertOptimisticUpdate(transactionId);
        } finally {
            console.log("Updating entities...");
            state.confirmTransaction(transactionId);
        }
    };

    return (
        <div>
            <h1>Game State</h1>
            <button onClick={optimisticUpdate}>update</button>
            {Object.entries(entities).map(([entityId, entity]) => (
                <div key={entityId}>
                    <h2>Entity {entityId}</h2>
                    <h3>Position</h3>
                    <p>
                        Player:{" "}
                        {entity.models.dojo_starter.Position?.player ?? "N/A"}
                        <br />
                        X: {entity.models.dojo_starter.Position?.vec.x ?? "N/A"}
                        <br />
                        Y: {entity.models.dojo_starter.Position?.vec.y ?? "N/A"}
                    </p>
                    <h3>Moves</h3>
                    <p>
                        <br />
                        Can Move:{" "}
                        {entity.models.dojo_starter.Moves?.can_move?.toString() ??
                            "N/A"}
                        <br />
                        Last Direction:{" "}
                        {entity.models.dojo_starter.Moves?.last_direction ??
                            "N/A"}
                        <br />
                        Remaining:{" "}
                        {entity.models.dojo_starter.Moves?.remaining ?? "N/A"}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default App;
