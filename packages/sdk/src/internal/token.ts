import type * as torii from "@dojoengine/torii-wasm/types";
import type {
    GetTokenBalanceRequest,
    GetTokenRequest,
    SubscribeTokenBalanceRequest,
    UpdateTokenBalanceSubscriptionRequest,
} from "./types.ts";

import { addAddressPadding } from "starknet";

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
        callback
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
        (res: torii.TokenBalance) => {
            if (res === defaultTokenBalance) {
                return;
            }
            try {
                callback({
                    data: res,
                    error: undefined,
                });
                return;
            } catch (error) {
                callback({
                    data: undefined,
                    error: error as Error,
                });
            }
        }
    );

    return [initialBalances, subscription];
}
