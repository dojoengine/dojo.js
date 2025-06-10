import * as torii from "@dojoengine/torii-wasm";
import type { Account, Signature, TypedData } from "starknet";

import type {
    GetParams,
    GetTokenBalanceRequest,
    GetTokenRequest,
    SchemaType,
    SDK,
    SDKConfig,
    SubscribeParams,
    SubscribeResponse,
    ToriiResponse,
    UnionOfModelData,
    SubscribeTokenBalanceRequest,
    SubscribeTokenRequest,
    UpdateTokenBalanceSubscriptionRequest,
} from "../internal/types";

import { generateTypedData } from "../internal/generateTypedData";
import {
    getTokens,
    getTokenBalances,
    onTokenBalanceUpdated,
    onTokenUpdated,
    updateTokenBalanceSubscription,
    subscribeTokenBalance,
    subscribeToken,
} from "../internal/token";
import { err, ok, type Result } from "neverthrow";
import { NO_ACCOUNT } from "../internal/errors";
import { subscribeQueryModelCallback } from "../internal/subscribeQueryModel";
import { Pagination } from "../internal/pagination";
import { parseEntities } from "../internal/parseEntities";

export * from "../internal/types";
export * from "./queryBuilder";
export * from "../internal/clauseBuilder";
export * from "../internal/toriiQueryBuilder";

/**
 * Creates a new Torii client instance.
 *
 * @param {torii.ClientConfig} config - The configuration object for the Torii client.
 * @returns {Promise<torii.ToriiClient>} - A promise that resolves to the Torii client instance.
 */
export async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await new torii.ToriiClient(config);
}

export const defaultClientConfig: Partial<torii.ClientConfig> = {
    toriiUrl: "http://localhost:8080",
    relayUrl: "/ip4/127.0.0.1/tcp/9090",
};

/**
 * Initializes the SDK with the provided configuration and schema.
 *
 * @template T - The schema type.
 * @param {torii.ClientConfig} options - The configuration object for the Torii client.
 */
export async function init<T extends SchemaType>(
    options: SDKConfig
): Promise<SDK<T>> {
    const clientConfig = {
        ...defaultClientConfig,
        ...options.client,
    } as torii.ClientConfig;
    const client = await new torii.ToriiClient(clientConfig);

    return {
        client,
        /**
         * Subscribes to entity queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEntityQuery: async ({ query, callback }) => {
            const q = query.build();

            const entities = await client.getEntities(q);
            const parsedEntities = parseEntities<T>(entities.items);
            return [
                Pagination.fromQuery(query, entities.next_cursor).withItems(
                    parsedEntities
                ),
                client.onEntityUpdated(
                    q.clause,
                    subscribeQueryModelCallback(callback)
                ),
            ];
        },
        /**
         * Subscribes to event queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEventQuery: async ({
            query,
            callback,
        }: SubscribeParams<T>): Promise<SubscribeResponse<T>> => {
            const q = query.build();

            const entities = await client.getEventMessages(q);
            const parsedEntities = parseEntities<T>(entities.items);
            return [
                Pagination.fromQuery(query, entities.next_cursor).withItems(
                    parsedEntities
                ),
                client.onEventMessageUpdated(
                    q.clause,
                    subscribeQueryModelCallback(callback)
                ),
            ];
        },
        /**
         * Subscribes to token balance updates
         *
         * # Parameters
         * @param {SubscribeTokenBalanceRequest} request
         * @returns {Promise<[torii.TokenBalances, torii.Subscription]>}
         */
        subscribeTokenBalance: async (
            request: SubscribeTokenBalanceRequest
        ): Promise<[torii.TokenBalances, torii.Subscription]> => {
            return await subscribeTokenBalance(client, request);
        },

        /**
         * Subscribes to token updates
         *
         * # Parameters
         * @param {SubscribeTokenRequest} request
         * @returns {Promise<[torii.Tokens, torii.Subscription]>}
         */
        subscribeToken: async (
            request: SubscribeTokenRequest
        ): Promise<[torii.Tokens, torii.Subscription]> => {
            return await subscribeToken(client, request);
        },

        /**
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T, false>} params - Parameters object
         * @returns {Promise<ToriiResponse<T,false>>} - A promise that resolves to the standardized query result.
         */
        getEntities: async ({ query }) => {
            const q = query.build();

            const entities = await client.getEntities(q);

            return Pagination.fromQuery(query, entities.next_cursor).withItems(
                parseEntities(entities.items)
            );
        },
        /**
         * Fetches event messages based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<ToriiResponse<T>} - A promise that resolves to the standardized query result.
         */
        getEventMessages: async ({
            query,
        }: GetParams<T>): Promise<ToriiResponse<T>> => {
            const q = query.build();

            const entities = await client.getEventMessages(q);

            return Pagination.fromQuery(query, entities.next_cursor).withItems(
                parseEntities(entities.items)
            );
        },

        /**
         * Generates typed data for any user-defined message.
         *
         * @template M - The message type defined by the schema models.
         * @param {string} nsModel - Model name prefixed with namespace joined by a hyphen.
         * @param {M} message - The user-defined message content, must be part of the schema models.
         * @returns {TypedData} - The generated typed data.
         */
        generateTypedData: <M extends UnionOfModelData<T>>(
            nsModel: string,
            message: M,
            modelMapping?: Array<{ name: string; type: string }>,
            additionnalTypes?: Record<
                string,
                Array<{ name: string; type: string }>
            >
        ): TypedData =>
            generateTypedData(
                nsModel,
                message,
                options.domain,
                modelMapping,
                additionnalTypes
            ),

        /**
         * Sends a signed message.
         *
         * @param {TypedData} data - The typed data to be signed and sent.
         * @param {Account} account - The account used to sign the message.
         * @returns {Promise<void>} - A promise that resolves when the message is sent successfully.
         * @throws {Error} If the message sending fails.
         */
        sendMessage: async (
            data: TypedData,
            account?: Account
        ): Promise<Result<Uint8Array, string>> => {
            if (!account) {
                return err(NO_ACCOUNT);
            }
            try {
                // Sign the typed data
                const signature: Signature = await account.signMessage(data);

                // Stringify typed data for publishing
                const dataString = JSON.stringify(data);
                // Publish the signed message
                return ok(
                    await client.publishMessage(
                        dataString,
                        Array.isArray(signature)
                            ? signature
                            : [signature.r.toString(), signature.s.toString()]
                    )
                );
            } catch (error) {
                console.error("Failed to send message:", error);
                throw error;
            }
        },

        /**
         * @param {GetTokenRequest} request
         * @returns {Promise<torii.Tokens>}
         */
        getTokens: async (request: GetTokenRequest): Promise<torii.Tokens> => {
            return await getTokens(client, request);
        },

        /**
         * @param {GetTokenBalanceRequest} request
         * @returns {Promise<torii.TokenBalances>}
         */
        getTokenBalances: async (
            request: GetTokenBalanceRequest
        ): Promise<torii.TokenBalances> => {
            return await getTokenBalances(client, request);
        },

        /**
         * Subscribes to token balance updates
         *
         * # Parameters
         * @param {SubscribeTokenBalanceRequest} request
         * @param {Funtion} callback - JavaScript function to call on updates
         *
         * # Returns
         * Result containing subscription handle or error
         * @returns torii.Subscription
         */
        onTokenBalanceUpdated: (
            request: SubscribeTokenBalanceRequest
        ): torii.Subscription => {
            return onTokenBalanceUpdated(client, request);
        },

        /**
         * Subscribes to token updates
         *
         * # Parameters
         * @param {SubscribeTokenRequest} request
         * @param {Function} callback - JavaScript function to call on updates
         *
         * # Returns
         * Result containing subscription handle or error
         * @returns torii.Subscription
         */
        onTokenUpdated: (
            request: SubscribeTokenRequest
        ): torii.Subscription => {
            return onTokenUpdated(client, request);
        },

        /**
         * Updates an existing token balance subscription
         *
         * # Parameters
         * @param {UpdateTokenBalanceSubscriptionRequest} request
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateTokenBalanceSubscription: async (
            request: UpdateTokenBalanceSubscriptionRequest
        ): Promise<void> => {
            return await updateTokenBalanceSubscription(client, request);
        },

        /**
         * Updates an existing entity subscription
         *
         * # Parameters
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New array of key clauses for filtering
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateEntitySubscription: async (
            subscription: torii.Subscription,
            clauses: torii.Clause
        ): Promise<void> => {
            return await client.updateEntitySubscription(subscription, clauses);
        },

        /**
         * Updates an existing event message subscription
         *
         * # Parameters
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New array of key clauses for filtering
         * @param {boolean} historical - Whether to include historical messages
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateEventMessageSubscription: async (
            subscription: torii.Subscription,
            clauses: torii.Clause
        ): Promise<void> => {
            return await client.updateEventMessageSubscription(
                subscription,
                clauses
            );
        },

        /**
         * Gets controllers along with their usernames for the given contract addresses
         *
         * # Parameters
         * @param {string[]} contract_addresses - Array of contract addresses as hex strings. If empty, all
         *   controllers will be returned.
         *
         * # Returns
         * Result containing controllers or error
         * @returns {Promise<torii.Controllers>}
         */
        getControllers: async (
            contract_addresses: string[]
        ): Promise<torii.Controllers> => {
            return await client.getControllers(contract_addresses);
        },
    };
}
