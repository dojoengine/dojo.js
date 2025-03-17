import { useDojoSDK } from "../hooks";
import { useState, useEffect, useRef, useCallback } from "react";
import type {
    Token,
    Tokens,
    TokenBalance,
    TokenBalances,
    Subscription,
} from "@dojoengine/torii-client";
import type {
    GetTokenRequest,
    GetTokenBalanceRequest,
    SubscriptionCallbackArgs,
} from "../..";
import { deepEqual } from "./utils";

export function useTokens(request: GetTokenRequest & GetTokenBalanceRequest) {
    const { sdk } = useDojoSDK();
    const [tokens, setTokens] = useState<Tokens>([]);
    const requestRef = useRef<GetTokenRequest | null>(null);
    const [tokenBalances, setTokenBalances] = useState<TokenBalances>([]);
    const subscriptionRef = useRef<Subscription | null>(null);

    const fetchTokens = useCallback(async () => {
        const tokens = await sdk.getTokens({
            contractAddresses: request.contractAddresses ?? [],
            tokenIds: request.tokenIds ?? [],
        });
        console.log("tokens", tokens);
        setTokens(tokens);
    }, [sdk, request]);

    const fetchTokenBalances = useCallback(async () => {
        const [tokenBalances, subscription] = await sdk.subscribeTokenBalance({
            contractAddresses: request.contractAddresses ?? [],
            accountAddresses: request.accountAddresses ?? [],
            tokenIds: request.tokenIds ?? [],
            callback: ({
                data,
                error,
            }: SubscriptionCallbackArgs<TokenBalance>) => {
                if (error) {
                    console.error(error);
                    return;
                }
                setTokenBalances((prev) => updateTokenBalancesList(prev, data));
            },
        });
        console.log("tokenBalances", tokenBalances);
        subscriptionRef.current = subscription;
        setTokenBalances(tokenBalances);
    }, [sdk, request]);

    useEffect(() => {
        if (!deepEqual(request, requestRef.current)) {
            requestRef.current = request;
            fetchTokens();
            fetchTokenBalances();
        }
    }, [request]);

    function getBalance(token: Token): TokenBalance | undefined {
        return tokenBalances.find(
            (balance) => balance.contract_address === token.contract_address
        );
    }

    function toDecimal(
        token: Token,
        balance: TokenBalance | undefined
    ): number {
        return (
            Number.parseInt(balance?.balance ?? "0", 16) * 10 ** -token.decimals
        );
    }

    return { tokens, balances: tokenBalances, getBalance, toDecimal };
}

function updateTokenBalancesList(
    previousBalances: TokenBalance[],
    newBalance: TokenBalance
): TokenBalance[] {
    const existingBalanceIndex = previousBalances.findIndex(
        (balance) => balance.token_id === newBalance.token_id
    );

    // If balance doesn't exist, append it to the list
    if (existingBalanceIndex === -1) {
        return [...previousBalances, newBalance];
    }

    // If balance exists, update it while preserving order
    return previousBalances.map((balance, index) =>
        index === existingBalanceIndex ? newBalance : balance
    );
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
