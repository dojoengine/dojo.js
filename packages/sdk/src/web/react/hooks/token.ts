import type { Subscription, Token, TokenBalance } from "@dojoengine/torii-wasm";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
    GetTokenBalanceRequest,
    GetTokenRequest,
    SubscriptionCallbackArgs,
} from "@dojoengine/internal";
import { useDojoSDK } from "../hooks";
import { deepEqual } from "./utils";

export function useTokens(request: GetTokenRequest & GetTokenBalanceRequest) {
    const { sdk } = useDojoSDK();
    const [tokens, setTokens] = useState<Token[]>([]);
    const requestRef = useRef<GetTokenRequest | null>(null);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const subscriptionRef = useRef<Subscription | null>(null);

    const fetchTokens = useCallback(async () => {
        const tokens = await sdk.getTokens({
            contractAddresses: request.contractAddresses ?? [],
            tokenIds: request.tokenIds ?? [],
        });
        setTokens(tokens.items);
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
        subscriptionRef.current = subscription;
        setTokenBalances(tokenBalances.items);
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
    if (
        BigInt(newBalance.account_address) === 0n &&
        BigInt(newBalance.contract_address) === 0n
    ) {
        // torii subscription received, we ignore
        return previousBalances;
    }

    const existingBalanceIndex = previousBalances.findIndex(
        (balance) =>
            balance.token_id === newBalance.token_id &&
            balance.contract_address === newBalance.contract_address
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
