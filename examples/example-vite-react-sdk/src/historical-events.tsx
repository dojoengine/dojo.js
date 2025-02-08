import { KeysClause, ParsedEntity, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useAccount } from "@starknet-react/core";
import { SchemaType } from "./typescript/models.gen";
import { AccountInterface, addAddressPadding } from "starknet";
import { useEffect, useState } from "react";
import { Subscription } from "@dojoengine/torii-client";
import { useDojoSDK } from "@dojoengine/sdk/react";

export function HistoricalEvents() {
    const { account } = useAccount();
    const { sdk } = useDojoSDK();
    const [events, setEvents] = useState<ParsedEntity<SchemaType>[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        async function subscribeHistoricalEvent(account: AccountInterface) {
            try {
                const [e, s] = await sdk.subscribeEventQuery({
                    query: new ToriiQueryBuilder().withClause(
                        KeysClause(
                            [],
                            [addAddressPadding(account.address)],
                            "VariableLen"
                        ).build()
                    ),
                    callback: ({ data, error }) => {
                        if (data && data.length > 0) {
                            console.log(data);
                        }
                        if (error) {
                            console.error(error);
                        }
                    },
                    historical: true,
                });
                setEvents(e as unknown as ParsedEntity<SchemaType>[]);
                setSubscription(s);
            } catch (error) {
                setEvents([]);
                if (subscription) {
                    subscription.free();
                }
                console.error(error);
            }
        }

        if (account) {
            subscribeHistoricalEvent(account);
        }
    }, [account, setEvents, sdk]);

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
