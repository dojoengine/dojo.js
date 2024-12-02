import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "./App";
import { useDojo } from "./useDojo";
import { v4 as uuidv4 } from "uuid";

export const useSystemCalls = () => {
    const state = useDojoStore((state) => state);

    const {
        setup: { client },
        account: { account },
    } = useDojo();

    const generateEntityId = () => {
        return getEntityIdFromKeys([BigInt(account?.address)]);
    };

    const spawn = async () => {
        const entityId = generateEntityId();
        const transactionId = uuidv4();
        const remainingMoves = 100;

        state.applyOptimisticUpdate(transactionId, (draft) => {
            if (draft.entities[entityId]?.models?.dojo_starter?.Moves) {
                draft.entities[entityId].models.dojo_starter.Moves.remaining =
                    remainingMoves;
            }
        });

        try {
            console.log("Executing spawn action...");
            await client.actions.spawn({ account });

            console.log("Waiting for entity change...");
            await state.waitForEntityChange(
                entityId,
                (entity) => {
                    // Log the current state of the entity for debugging purposes
                    console.log("Entity state:", entity);

                    // Defensive checks to ensure the entity and its structure are valid
                    if (!entity) {
                        console.warn("Entity not found");
                        return false;
                    }
                    if (!entity.models?.dojo_starter?.Moves) {
                        console.warn(
                            "Entity does not have the expected model structure"
                        );
                        return false;
                    }

                    // Check if the remaining moves have been updated as expected
                    return (
                        entity.models.dojo_starter.Moves.remaining ===
                        remainingMoves
                    );
                },
                10000 // Increased timeout to 10000ms
            );
        } catch (error) {
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing spawn:", error);
            throw error;
        } finally {
            state.confirmTransaction(transactionId);
        }
    };

    return {
        spawn,
    };
};
