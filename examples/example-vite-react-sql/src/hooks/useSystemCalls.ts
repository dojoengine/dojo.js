import { useCallback, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDojoStore } from "./useDojoStore";
import { DojoContext } from "@/dojo-sdk-provider";
import { useAccount } from "@starknet-react/core";
import { BigNumberish } from "starknet";
import { Direction } from "@/typescript/models.gen";

export function useSystemCalls(entityId: BigNumberish) {
    const { account } = useAccount();
    const { client } = useContext(DojoContext);
    const state = useDojoStore((s) => s);

    const spawn = useCallback(async () => {
        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // The value to update the Moves model with
        const remainingMoves = 100;

        // Apply an optimistic update to the state
        // this uses immer drafts to update the state
        state.applyOptimisticUpdate(transactionId, (draft) => {
            if (
                draft.entities[entityId.toString()]?.models?.dojo_starter?.Moves
            ) {
                // @ts-expect-error object is not undefined, I checked it above bro
                draft.entities[
                    entityId.toString()
                ].models.dojo_starter.Moves.remaining = remainingMoves;
            }
        });

        try {
            // Execute the spawn action from the client
            await client.actions.spawn(account!);

            // Wait for the entity to be updated with the new state
            await state.waitForEntityChange(entityId.toString(), (entity) => {
                return (
                    entity?.models?.dojo_starter?.Moves?.remaining ===
                    remainingMoves
                );
            });
        } catch (error) {
            // Revert the optimistic update if an error occurs
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing spawn:", error);
            throw error;
        } finally {
            // Confirm the transaction if successful
            state.confirmTransaction(transactionId);
        }
    }, [state, account, client]);

    const move = useCallback(
        async (direction: Direction) => {
            const transactionId = uuidv4();
            state.applyOptimisticUpdate(transactionId, (draft) => {
                if (
                    draft.entities[entityId.toString()]?.models?.dojo_starter
                        ?.Moves
                ) {
                    // @ts-expect-error object is not undefined, I checked it just above bro
                    draft.entities[
                        entityId.toString()
                    ].models.dojo_starter.Moves.last_direction = direction;
                }
            });

            try {
                await client.actions.move(account!, direction);
                await state.waitForEntityChange(
                    entityId.toString(),
                    (entity) => {
                        const result =
                            entity?.models?.dojo_starter?.Moves?.last_direction?.isSome() &&
                            // TODO: handle proper conversion to enum in sdk enum Parsing
                            // @ts-expect-error torii returns enum variant as string, so we have to make some weird type mapping here
                            entity?.models?.dojo_starter?.Moves?.last_direction
                                ?.Some === Direction.toString(direction);
                        // cast result to boolean
                        return !!result;
                    }
                );
            } catch (error) {
                // Revert the optimistic update if an error occurs
                state.revertOptimisticUpdate(transactionId);
                console.error("Error executing spawn:", error);
                throw error;
            } finally {
                // Confirm the transaction if successful
                state.confirmTransaction(transactionId);
            }
        },
        [state, account, client]
    );

    return {
        spawn,
        move,
    };
}
