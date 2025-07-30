import {
    HistoricalToriiQueryBuilder,
    KeysClause,
    type ParsedEntity,
} from "@dojoengine/sdk";
import {
    useEntityId,
    useHistoricalEntityQuery,
    useHistoricalModel,
} from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { ModelsMapping, type SchemaType } from "./typescript/models.gen";

export function HistoricalEvents() {
    const { account } = useAccount();

    const entityId = useEntityId(account?.address ?? "0");
    useHistoricalEntityQuery(
        new HistoricalToriiQueryBuilder()
            .withClause(
                // Querying Moves and Position models that has at least [account.address] as key
                KeysClause(
                    [ModelsMapping.Moves],
                    [
                        account?.address
                            ? addAddressPadding(account.address)
                            : undefined,
                    ],
                    "FixedLen"
                ).build()
            )
            .includeHashedKeys()
    );

    const moves = useHistoricalModel(entityId as string, ModelsMapping.Moves);
    if (!account) {
        return (
            <div className="mt-6">
                <h2 className="text-white">Please connect your wallet</h2>
            </div>
        );
    }
    return (
        <div className="mt-6">
            <h2 className="text-white">Player Events :</h2>
            {/* @ts-expect-error type inference error */}
            {moves.map((e: ParsedEntity<SchemaType>, key) => {
                return <Event event={e} key={key} />;
            })}
        </div>
    );
}

function Event({ event }: { event: ParsedEntity<SchemaType> }) {
    if (!event) return null;
    const player = event.models?.dojo_starter?.Moves?.player;
    const lastDirection = event.models?.dojo_starter?.Moves?.last_direction;
    const direction = lastDirection?.isSome()
        ? lastDirection?.Some
        : "Initial direction";

    return (
        <div className="text-white flex gap-3">
            <div>{event.entityId.toString()}</div>
            <div>
                <div>Player: {player}</div>
                {/* @ts-expect-error type is ok here */}
                <div>Direction: {direction}</div>
            </div>
        </div>
    );
}
