import { KeysClause, ParsedEntity, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useAccount } from "@starknet-react/core";
import { SchemaType } from "./typescript/models.gen";
import { addAddressPadding } from "starknet";
import { useHistoricalEventsQuery } from "@dojoengine/sdk/react";

export function HistoricalEvents() {
    const { account } = useAccount();
    const events = useHistoricalEventsQuery(
        new ToriiQueryBuilder().withClause(
            KeysClause(
                [],
                [addAddressPadding(account?.address ?? "0")],
                "VariableLen"
            ).build()
        )
    );
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
            {/* @ts-ignore */}
            {events.map((e: ParsedEntity<SchemaType>, key) => {
                return <Event event={e} key={key} />;
            })}
        </div>
    );
}
function Event({ event }: { event: ParsedEntity<SchemaType> }) {
    if (!event) return null;
    const player = event.models?.dojo_starter?.Moved?.player;
    const direction = event.models?.dojo_starter?.Moved?.direction;

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
