import { SDK } from "@dojoengine/sdk";
import { useAccount } from "@starknet-react/core";
import { SchemaType } from "./typescript/models.gen";
import { AccountInterface, addAddressPadding } from "starknet";
import { useEffect, useState } from "react";

export function HistoricalEvents({ sdk }: { sdk: SDK<SchemaType> }) {
    const { account } = useAccount();
    const [events, setEvents] = useState([]);
    const [unsubscribe, setSubscription] = useState(null);

    useEffect(() => {
        async function getHistoricalEvents(account: AccountInterface) {
            try {
                const e = await sdk.getEventMessages({
                    // query: {
                    //   event_messages_historical: {
                    //     Moved: {
                    //       $: { where: { player: { $eq: addAddressPadding(account.address) } } }
                    //     }
                    //   }
                    // },
                    query: { entityIds: [addAddressPadding(account.address)] },
                    callback: () => {},
                    historical: true,
                });
                setEvents(e);
            } catch (error) {
                setEvents([]);
                console.error(error);
            }
        }

        if (account) {
            getHistoricalEvents(account);
        }
    }, [account, setEvents]);

    useEffect(() => {
        async function subscribeHistoricalEvent(account: AccountInterface) {
            try {
                const s = await sdk.subscribeEventQuery({
                    // query: {
                    //   event_messages_historical: {
                    //     Moved: {
                    //       $: { where: { player: { $eq: addAddressPadding(account.address) } } }
                    //     }
                    //   }
                    // },
                    query: { entityIds: [addAddressPadding(account.address)] },
                    callback: (resp, error) => {
                        console.log(resp, error);
                    },
                    historical: true,
                });
                setSubscription(s);
            } catch (error) {
                setEvents([]);
                if (unsubscribe) {
                    unsubscribe();
                }
                console.error(error);
            }
        }

        if (account) {
            subscribeHistoricalEvent(account);
        }
    }, [account, setEvents]);

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
            {events.map((e, key) => {
                return <Event event={e[0]} key={key} />;
            })}
        </div>
    );
}
function Event({ event }) {
    if (!event) return null;
    const player = event.models?.dojo_starter?.Moved?.player;
    const direction = event.models?.dojo_starter?.Moved?.direction;

    return (
        <div className="text-white flex gap-3">
            <div>{event.entityId}</div>
            <div>
                <div>Player: {player}</div>
                <div>Direction: {direction}</div>
            </div>
        </div>
    );
}
