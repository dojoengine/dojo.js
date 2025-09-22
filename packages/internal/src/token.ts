import type * as torii from "@dojoengine/torii-wasm/types";
import { addAddressPadding } from "starknet";
import { defaultToriiPagination } from "./pagination";
import type {
    AttributesFilter,
    GetTokenBalanceRequest,
    GetTokenContracts,
    GetTokenRequest,
    SubscribeTokenBalanceRequest,
    SubscribeTokenRequest,
    SubscriptionCallback,
    UpdateTokenBalanceSubscriptionRequest,
} from "./types";

type Strict<T> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};

/**
 * Creates a safe callback wrapper that handles errors
 * @param callback - The user-provided callback
 * @param defaultValue - Default value to check against
 * @returns Wrapped callback that handles try/catch
 */
export function safeCallback<T>(
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

export function parseTokenRequest<
    T extends GetTokenRequest & GetTokenBalanceRequest & GetTokenContracts,
>(req: T): Strict<T> {
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

    return {
        contractAddresses: req.contractAddresses ?? [],
        accountAddresses: req.accountAddresses ?? [],
        attributesFilter: req.attributesFilter ?? [],
        contractTypes: req.contractTypes ?? [],
        tokenIds: req.tokenIds ?? [],
        pagination: req.pagination ?? defaultToriiPagination,
    } as Strict<T>;
}
function toAttributesFilter(
    attributes: AttributesFilter[]
): torii.AttributeFilter[] {
    return attributes.map((a) => ({
        trait_name: a.name,
        trait_value: a.value,
    }));
}
/**
 * @param {GetTokenRequest} request
 * @returns {Promise<torii.Tokens>}
 */
export async function getTokens(
    client: torii.ToriiClient,
    request: GetTokenRequest
): Promise<torii.Tokens> {
    const { contractAddresses, tokenIds, pagination, attributesFilter } =
        parseTokenRequest(request);
    return await client.getTokens({
        contract_addresses: contractAddresses,
        token_ids: tokenIds,
        attribute_filters: toAttributesFilter(attributesFilter),
        pagination,
    });
}
/**
 * @param {GetTokenContracts} request
 * @returns {Promise<torii.Tokens>}
 */
export async function getTokenContracts(
    client: torii.ToriiClient,
    request: GetTokenContracts
): Promise<torii.TokenContracts> {
    const { contractAddresses, contractTypes, pagination } =
        parseTokenRequest(request);
    return await client.getTokenContracts({
        contract_addresses: contractAddresses,
        contract_types: contractTypes as torii.ContractType[],
        pagination,
    });
}

/**
 * @param {GetTokenBalanceRequest} request
 * @returns {Promise<torii.TokenBalances>}
 */
export async function getTokenBalances(
    client: torii.ToriiClient,
    request: GetTokenBalanceRequest
): Promise<torii.TokenBalances> {
    const { contractAddresses, accountAddresses, tokenIds, pagination } =
        parseTokenRequest(request);
    return await client.getTokenBalances({
        contract_addresses: contractAddresses,
        account_addresses: accountAddresses,
        token_ids: tokenIds,
        pagination,
    });
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
export async function onTokenBalanceUpdated(
    client: torii.ToriiClient,
    request: SubscribeTokenBalanceRequest
): Promise<torii.Subscription> {
    const { contractAddresses, accountAddresses, tokenIds } =
        parseTokenRequest(request);
    return await client.onTokenBalanceUpdated(
        contractAddresses ?? [],
        accountAddresses ?? [],
        tokenIds ?? [],
        safeCallback(request.callback, defaultTokenBalance)
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
    const subscription = await client.onTokenBalanceUpdated(
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
    total_supply: "",
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
export async function onTokenUpdated(
    client: torii.ToriiClient,
    request: SubscribeTokenRequest
): Promise<torii.Subscription> {
    const { contractAddresses, tokenIds, callback } =
        parseTokenRequest(request);
    return await client.onTokenUpdated(
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
    const subscription = await client.onTokenUpdated(
        contractAddresses ?? [],
        tokenIds ?? [],
        safeCallback(callback, defaultToken)
    );

    return [initialTokens, subscription];
}
