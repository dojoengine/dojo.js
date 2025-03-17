import { useDojoSDK } from "../hooks";
import { useState, useEffect, useRef } from "react";
import type { Tokens, TokenBalances } from "@dojoengine/torii-client";
import type { GetTokenRequest, GetTokenBalanceRequest } from "../..";
import { deepEqual } from "./utils";

export function useTokens(request: GetTokenRequest) {
    const { sdk } = useDojoSDK();
    const [tokens, setTokens] = useState<Tokens>([]);
    const requestRef = useRef<GetTokenRequest | null>(null);

    useEffect(() => {
        const fetchTokens = async () => {
            const tokens = await sdk.getTokens(request);
            setTokens(tokens);
        };

        if (!deepEqual(request, requestRef.current)) {
            requestRef.current = request;
            fetchTokens();
        }
    }, [request]);

    return tokens;
}

export function useTokenBalances(request: GetTokenBalanceRequest) {
    const { sdk } = useDojoSDK();
    const [tokenBalances, setTokenBalances] = useState<TokenBalances>([]);
    const requestRef = useRef<GetTokenBalanceRequest | null>(null);

    useEffect(() => {
        const fetchTokenBalances = async () => {
            const tokenBalances = await sdk.getTokenBalances(request);
            setTokenBalances(tokenBalances);
        };

        if (!deepEqual(request, requestRef.current)) {
            requestRef.current = request;
            fetchTokenBalances();
        }
    }, [request]);

    return tokenBalances;
}

// /**
//  * Subscribe to event changes. This hook fetches initial events from torii and subscribes to new events.
//  *
//  * @param query ToriiQuery
//  */
// export function useTokenBalances(request: GetTokenBalanceRequest) {
//     const { sdk, useDojoStore } = useDojoSDK();
//     const state = useDojoStore((s) => s);

//     const useEventQueryHook = createSubscriptionHook({
//         subscribeMethod: (request) => sdk.onTokenBalanceUpdated(request),
//         updateSubscriptionMethod: (subscription, clause) =>
//             sdk.updateEventMessageSubscription(subscription, clause, false),
//         queryToHashedKeysMethod: (query) =>
//             sdk.toriiEventMessagesQueryIntoHashedKeys(query, false),
//         processInitialData: (data) => state.mergeEntities(data),
//         processUpdateData: (data) => {
//             const event = data.pop();
//             if (event && event.entityId !== "0x0") {
//                 state.updateEntity(event);
//             }
//         },
//         getErrorPrefix: () => "Dojo.js - useTokenBalances",
//         historical: false,
//     });

//     useEventQueryHook(query);
// }
