import type * as torii from "@dojoengine/torii-wasm/types";
import type {
    GetTokenBalanceRequest,
    GetTokenRequest,
    SubscribeTokenBalanceRequest,
    SubscribeTokenRequest,
    UpdateTokenBalanceSubscriptionRequest,
    SubscriptionCallback,
} from "./types.ts";

import { addAddressPadding } from "starknet";

/**
 * Creates a safe callback wrapper that handles errors
 * @param callback - The user-provided callback
 * @param defaultValue - Default value to check against
 * @returns Wrapped callback that handles try/catch
 */
function safeCallback<T>(
    callback: SubscriptionCallback<T>,
    defaultValue: T
): (res: T) => void {
    return (res: T) => {
        if (res === defaultValue) {
            return;
        }
        try {
            callback({
                data: res,
                error: undefined,
            });
        } catch (error) {
            callback({
                data: undefined,
                error: error as Error,
            });
        }
    };
}

export const defaultTokenBalance: torii.TokenBalance = {
    balance:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    account_address: "0x0",
    contract_address: "0x0",
    token_id:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
};

function parseTokenRequest<T extends GetTokenRequest & GetTokenBalanceRequest>(
    req: T
): T {
    if (req.contractAddresses) {
        req.contractAddresses = req.contractAddresses.map((r) =>
            addAddressPadding(r)
        );
    }

    if (req.accountAddresses) {
        req.accountAddresses = req.accountAddresses.map((r) =>
            addAddressPadding(r)
        );
    }

    return req;
}
/**
 * @param {GetTokenRequest} request
 * @returns {Promise<torii.Tokens>}
 */
export async function getTokens(
    client: torii.ToriiClient,
    request: GetTokenRequest
): Promise<torii.Tokens> {
    const { contractAddresses, tokenIds } = parseTokenRequest(request);
    return await client.getTokens(contractAddresses ?? [], tokenIds ?? []);
}

/**
 * @param {GetTokenBalanceRequest} request
 * @returns {Promise<torii.TokenBalances>}
 */
export async function getTokenBalances(
    client: torii.ToriiClient,
    request: GetTokenBalanceRequest
): Promise<torii.TokenBalances> {
    const { contractAddresses, accountAddresses, tokenIds } =
        parseTokenRequest(request);
    return await client.getTokenBalances(
        contractAddresses ?? [],
        accountAddresses ?? [],
        tokenIds ?? []
    );
}

/**
 * Subscribes to token balance updates
 *
 * # Parameters
 * @param {SubscribeTokenBalanceRequest} request
 *
 * # Returns
 * Result containing subscription handle or error
 * @returns torii.Subscription
 */
export function onTokenBalanceUpdated(
    client: torii.ToriiClient,
    request: SubscribeTokenBalanceRequest
): torii.Subscription {
    const { contractAddresses, accountAddresses, tokenIds, callback } =
        parseTokenRequest(request);
    return client.onTokenBalanceUpdated(
        contractAddresses ?? [],
        accountAddresses ?? [],
        tokenIds ?? [],
        safeCallback(callback, defaultTokenBalance)
    );
}

/**
 * Updates an existing token balance subscription
 *
 * # Parameters
 * @param {torii.Subscription} subscription - Existing subscription to update
 * @param {UpdateTokenBalanceSubscriptionRequest} request
 *
 * # Returns
 * Result containing unit or error
 * @returns {Promise<void>}
 */
export async function updateTokenBalanceSubscription(
    client: torii.ToriiClient,
    request: UpdateTokenBalanceSubscriptionRequest
): Promise<void> {
    const { subscription, contractAddresses, accountAddresses, tokenIds } =
        request;
    return await client.updateTokenBalanceSubscription(
        subscription,
        contractAddresses ?? [],
        accountAddresses ?? [],
        tokenIds ?? []
    );
}
/**
 * Subscribes to token balance updates and returns initial data with subscription
 *
 * # Parameters
 * @param {SubscribeTokenBalanceRequest} request - Request parameters
 *
 * # Returns
 * Array containing initial token balances and subscription handle
 * @returns {Promise<[torii.TokenBalances, torii.Subscription]>}
 */
export async function subscribeTokenBalance(
    client: torii.ToriiClient,
    request: SubscribeTokenBalanceRequest
): Promise<[torii.TokenBalances, torii.Subscription]> {
    const { contractAddresses, accountAddresses, tokenIds, callback } = request;

    // Get initial token balances
    const initialBalances = await getTokenBalances(client, {
        contractAddresses: contractAddresses ?? [],
        accountAddresses: accountAddresses ?? [],
        tokenIds: tokenIds ?? [],
    });

    // Create subscription for updates
    const subscription = client.onTokenBalanceUpdated(
        contractAddresses ?? [],
        accountAddresses ?? [],
        tokenIds ?? [],
        safeCallback(callback, defaultTokenBalance)
    );

    return [initialBalances, subscription];
}

export const defaultToken: torii.Token = {
    contract_address: "0x0",
    token_id:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    name: "",
    symbol: "",
    decimals: 0,
    metadata: "",
};

/**
 * Subscribes to token updates
 *
 * # Parameters
 * @param {SubscribeTokenRequest} request
 *
 * # Returns
 * Result containing subscription handle or error
 * @returns torii.Subscription
 */
export function onTokenUpdated(
    client: torii.ToriiClient,
    request: SubscribeTokenRequest
): torii.Subscription {
    const { contractAddresses, tokenIds, callback } =
        parseTokenRequest(request);
    return client.onTokenUpdated(
        contractAddresses ?? [],
        tokenIds ?? [],
        safeCallback(callback, defaultToken)
    );
}

/**
 * Subscribes to token updates and returns initial data with subscription
 *
 * # Parameters
 * @param {SubscribeTokenRequest} request - Request parameters
 *
 * # Returns
 * Array containing initial tokens and subscription handle
 * @returns {Promise<[torii.Tokens, torii.Subscription]>}
 */
export async function subscribeToken(
    client: torii.ToriiClient,
    request: SubscribeTokenRequest
): Promise<[torii.Tokens, torii.Subscription]> {
    const { contractAddresses, tokenIds, callback } = request;

    // Get initial tokens
    const initialTokens = await getTokens(client, {
        contractAddresses: contractAddresses ?? [],
        tokenIds: tokenIds ?? [],
    });

    // Create subscription for updates
    const subscription = client.onTokenUpdated(
        contractAddresses ?? [],
        tokenIds ?? [],
        safeCallback(callback, defaultToken)
    );

    return [initialTokens, subscription];
}
