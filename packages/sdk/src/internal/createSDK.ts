import type * as torii from "@dojoengine/torii-wasm/types";
import { ok, type Result } from "neverthrow";
import type { Account, TypedData } from "starknet";
import { generateTypedData } from "./generateTypedData.ts";
import { defaultToriiPagination, Pagination } from "./pagination.ts";
import { parseEntities } from "./parseEntities.ts";
import { subscribeQueryModelCallback } from "./subscribeQueryModel.ts";
import {
    getTokenBalances,
    getTokens,
    onTokenBalanceUpdated,
    onTokenUpdated,
    subscribeToken,
    subscribeTokenBalance,
    updateTokenBalanceSubscription,
} from "./token.ts";
import type {
    GetParams,
    GetTokenBalanceRequest,
    GetTokenRequest,
    SchemaType,
    SDK,
    SDKConfig,
    SubscribeParams,
    SubscribeResponse,
    SubscribeTokenBalanceRequest,
    SubscribeTokenRequest,
    ToriiResponse,
    UnionOfModelData,
    UpdateTokenBalanceSubscriptionRequest,
} from "./types";

export interface CreateSDKOptions {
    client: torii.ToriiClient;
    config: SDKConfig;
    sendMessage: (
        data: TypedData,
        account?: Account
    ) => Promise<Result<string, string>>;
    sendMessageBatch: (
        data: TypedData[],
        account?: Account
    ) => Promise<Result<string[], string>>;
}

/**
 * Creates an SDK instance with the provided client and configuration.
 * This is the shared implementation used by both node and web versions.
 */
export function createSDK<T extends SchemaType>({
    client,
    config,
    sendMessage,
    sendMessageBatch,
}: CreateSDKOptions): SDK<T> {
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
                await client.onEntityUpdated(
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
                await client.onEventMessageUpdated(
                    q.clause,
                    subscribeQueryModelCallback(callback)
                ),
            ];
        },

        /**
         * Subscribes to token balance updates
         *
         * @param {SubscribeTokenBalanceRequest} request
         * @returns {Promise<[torii.TokenBalances, torii.Subscription]>}
         */
        subscribeTokenBalance: async (
            request: SubscribeTokenBalanceRequest
        ): Promise<[torii.TokenBalances, torii.Subscription]> => {
            return await subscribeTokenBalance(client, request);
        },

        /**
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<ToriiResponse<T>>} - A promise that resolves to the standardized query result.
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
         * @param {Array<{ name: string; type: string }>} modelMapping - Optional model mapping for custom types.
         * @param {Record<string, Array<{ name: string; type: string }>>} additionalTypes - Optional additional types.
         * @returns {TypedData} - The generated typed data.
         */
        generateTypedData: <M extends UnionOfModelData<T>>(
            nsModel: string,
            message: M,
            modelMapping?: Array<{ name: string; type: string }>,
            additionalTypes?: Record<
                string,
                Array<{ name: string; type: string }>
            >
        ): TypedData =>
            generateTypedData(
                nsModel,
                message,
                config.domain,
                modelMapping,
                additionalTypes
            ),

        /**
         * Sends a signed message.
         *
         * @param {TypedData} data - The typed data to be signed and sent.
         * @param {Account} account - The account used to sign the message.
         * @returns {Promise<Result<Uint8Array, string>>} - A promise that resolves when the message is sent successfully.
         */
        sendMessage,

        /**
         * Sends multiple signed messages in a batch.
         *
         * @param {TypedData[]} data - Array of typed data to be signed and sent.
         * @param {Account} account - The account used to sign the messages.
         * @returns {Promise<Result<string[], string>>} - A promise that resolves when all messages are sent successfully.
         */
        sendMessageBatch,

        /**
         * Sends already signed messages to the Torii server in a batch.
         * This method allows you to send pre-signed messages directly without signing them again.
         *
         * @param {torii.Message[]} data - Array of signed messages with message content and signatures
         * @returns {Promise<Result<string[], string>>} - A promise that resolves when all messages are sent successfully.
         */
        sendSignedMessageBatch: async (
            data: torii.Message[]
        ): Promise<Result<string[], string>> => {
            try {
                // Publish the batch of already signed messages
                return ok(await client.publishMessageBatch(data));
            } catch (error) {
                console.error("Failed to send signed message batch:", error);
                throw error;
            }
        },

        /**
         * Gets tokens based on the provided request.
         *
         * @param {GetTokenRequest} request
         * @returns {Promise<torii.Tokens>}
         */
        getTokens: async (request: GetTokenRequest): Promise<torii.Tokens> => {
            return await getTokens(client, request);
        },

        /**
         * Gets token balances based on the provided request.
         *
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
         * @param {SubscribeTokenBalanceRequest} request
         * @returns {torii.Subscription}
         */
        onTokenBalanceUpdated: async (
            request: SubscribeTokenBalanceRequest
        ): Promise<torii.Subscription> => {
            return await onTokenBalanceUpdated(client, request);
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
        onTokenUpdated: async (
            request: SubscribeTokenRequest
        ): Promise<torii.Subscription> => {
            return await onTokenUpdated(client, request);
        },

        /**
         * Updates an existing token balance subscription
         *
         * @param {UpdateTokenBalanceSubscriptionRequest} request
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
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New clauses for filtering
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
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New clauses for filtering
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
         * @param {string[]} contract_addresses - Array of contract addresses as hex strings. If empty, all
         *   controllers will be returned.
         * @returns {Promise<torii.Controllers>}
         */
        getControllers: async (
            contract_addresses: string[],
            usernames: string[],
            pagination: torii.Pagination = defaultToriiPagination
        ): Promise<torii.Controllers> => {
            return await client.getControllers({
                contract_addresses,
                usernames,
                pagination,
            });
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
    };
}
