import { useEffect, useState } from "react";
import "./App.css";
import { ParsedEntity, SDK } from "@dojoengine/sdk";
import { Schema } from "./bindings.ts";

function App({ db }: { db: SDK<Schema> }) {
    const [entities, setEntities] = useState<ParsedEntity<Schema>[]>([]);

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
                        console.log(response.data);
                        setEntities((prevEntities) => {
                            return prevEntities.map((entity) => {
                                const newEntity = response.data?.find(
                                    (e) => e.entityId === entity.entityId
                                );
                                return newEntity ? newEntity : entity;
                            });
                        });
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

    console.log("entities:");

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
                            console.log(resp.data);
                            setEntities((prevEntities) => {
                                const updatedEntities = [...prevEntities];
                                resp.data?.forEach((newEntity) => {
                                    const index = updatedEntities.findIndex(
                                        (entity) =>
                                            entity.entityId ===
                                            newEntity.entityId
                                    );
                                    if (index !== -1) {
                                        updatedEntities[index] = newEntity;
                                    } else {
                                        updatedEntities.push(newEntity);
                                    }
                                });
                                return updatedEntities;
                            });
                        }
                    }
                );
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, [db]);

    return (
        <div>
            <h1>Game State</h1>
            {entities.map((entity) => (
                <div key={entity.entityId}>
                    <h2>Entity {entity.entityId}</h2>
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
