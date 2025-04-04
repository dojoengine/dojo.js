import * as torii from "@dojoengine/torii-client";
import type { Account, Signature, StarknetDomain, TypedData } from "starknet";

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
    UpdateTokenBalanceSubscriptionRequest,
} from "./types";

import { intoEntityKeysClause } from "./convertClauseToEntityKeysClause";
import { parseEntities } from "./parseEntities";
import { parseHistoricalEvents } from "./parseHistoricalEvents";
import type { ToriiQueryBuilder } from "./toriiQueryBuilder";
import { generateTypedData } from "./generateTypedData";
import {
    getTokens,
    getTokenBalances,
    onTokenBalanceUpdated,
    updateTokenBalanceSubscription,
    subscribeTokenBalance,
} from "./token";

export * from "./types";
export * from "./convertClauseToEntityKeysClause";
export * from "./queryBuilder";
export * from "./clauseBuilder";
export * from "./toriiQueryBuilder";

/**
 * Creates a new Torii client instance.
 *
 * @param {torii.ClientConfig} config - The configuration object for the Torii client.
 * @returns {Promise<torii.ToriiClient>} - A promise that resolves to the Torii client instance.
 */
export async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
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
    const client = await createClient(clientConfig);

    return {
        client,
        /**
         * Subscribes to entity queries.
         *
         * @param {SubscribeParams<T, false>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T, false>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEntityQuery: async ({ query, callback }) => {
            const q = query.build();

            if (
                q.dont_include_hashed_keys &&
                q.clause &&
                !Object.hasOwn(q.clause, "Keys")
            ) {
                throw new Error(
                    "For subscription, you need to include entity ids"
                );
            }
            const entities = parseEntities<T>(
                await client.getEntities(q, false)
            );
            return [
                entities,
                client.onEntityUpdated(
                    intoEntityKeysClause<T>(q.clause, entities),
                    (entityId: string, entityData: any) => {
                        try {
                            if (callback) {
                                const parsedData = parseEntities<T>({
                                    [entityId]: entityData,
                                });
                                callback({
                                    data: parsedData,
                                    error: undefined,
                                });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
                                    data: undefined,
                                    error:
                                        error instanceof Error
                                            ? error
                                            : new Error(String(error)),
                                });
                            }
                        }
                    }
                ),
            ];
        },
        /**
         * Subscribes to event queries.
         *
         * @param {SubscribeParams<T, Historical>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T, Historical>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEventQuery: async <Historical extends boolean>({
            query,
            callback,
            historical = false as Historical,
        }: SubscribeParams<T, Historical>): Promise<
            SubscribeResponse<T, Historical>
        > => {
            const q = query.build();
            if (
                q.dont_include_hashed_keys &&
                q.clause &&
                !Object.hasOwn(q.clause, "Keys")
            ) {
                throw new Error(
                    "For subscription, you need to include entity ids"
                );
            }
            const events = (
                historical
                    ? parseHistoricalEvents<T>(
                          await client.getEventMessages(q, historical)
                      )
                    : parseEntities<T>(
                          await client.getEventMessages(q, historical)
                      )
            ) as ToriiResponse<T, Historical>;
            return [
                events,
                client.onEventMessageUpdated(
                    // @ts-expect-error will fix
                    intoEntityKeysClause<T>(q.clause, events),
                    (entityId: string, entityData: any) => {
                        try {
                            if (callback) {
                                const data = { [entityId]: entityData };
                                const parsedData = historical
                                    ? parseHistoricalEvents<T>(data)
                                    : parseEntities<T>(data);

                                callback({
                                    data: parsedData as ToriiResponse<
                                        T,
                                        Historical
                                    >,
                                    error: undefined,
                                });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
                                    data: undefined,
                                    error:
                                        error instanceof Error
                                            ? error
                                            : new Error(String(error)),
                                });
                            }
                        }
                    }
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
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T, false>} params - Parameters object
         * @returns {Promise<ToriiResponse<T,false>>} - A promise that resolves to the standardized query result.
         */
        getEntities: async ({ query }) => {
            const q = query.build();
            return parseEntities(await client.getEntities(q, false));
        },
        /**
         * Fetches event messages based on the provided query.
         *
         * @param {GetParams<T, Historical>} params - Parameters object
         * @returns {Promise<ToriiResponse<T, Historical>} - A promise that resolves to the standardized query result.
         */
        getEventMessages: async <Historical extends boolean>({
            query,
            historical,
        }: GetParams<T, Historical>): Promise<ToriiResponse<T, Historical>> => {
            const q = query.build();

            const events = await client.getEventMessages(
                q,
                historical ? historical : false
            );

            return (
                historical
                    ? parseHistoricalEvents(events)
                    : parseEntities(events)
            ) as ToriiResponse<T, Historical>;
        },

        /**
         * Generates typed data for any user-defined message.
         *
         * @template M - The message type defined by the schema models.
         * @param {string} nsModel - Model name prefixed with namespace joined by a hyphen.
         * @param {M} message - The user-defined message content, must be part of the schema models.
         * @param {StarknetDomain} [domain] - The domain object. If not provided, uses the default domain from options.
         * @returns {TypedData} - The generated typed data.
         */
        generateTypedData: <M extends UnionOfModelData<T>>(
            nsModel: string,
            message: M,
            modelMapping?: Array<{ name: string; type: string }>,
            domain: StarknetDomain = options.domain
        ): TypedData =>
            generateTypedData(nsModel, message, domain, modelMapping),

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
            account: Account
        ): Promise<void> => {
            try {
                // Sign the typed data
                const signature: Signature = await account.signMessage(data);

                // Stringify typed data for publishing
                const dataString = JSON.stringify(data);
                // Publish the signed message
                await client.publishMessage(
                    dataString,
                    Array.isArray(signature)
                        ? signature
                        : [signature.r.toString(), signature.s.toString()]
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
         * @param {torii.EntityKeysClause[]} clauses - New array of key clauses for filtering
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateEntitySubscription: async (
            subscription: torii.Subscription,
            clauses: torii.EntityKeysClause[]
        ): Promise<void> => {
            return await client.updateEntitySubscription(subscription, clauses);
        },

        /**
         * Updates an existing event message subscription
         *
         * # Parameters
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.EntityKeysClause[]} clauses - New array of key clauses for filtering
         * @param {boolean} historical - Whether to include historical messages
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateEventMessageSubscription: async (
            subscription: torii.Subscription,
            clauses: torii.EntityKeysClause[]
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
        /**
         * Convert torii clause into EntityKeysClause[];
         *
         * @param {query} query - ToriiQueryBuilder
         * @returns [ToriiResponse<T,false>,torii.EntityKeysClause[]]
         */
        toriiQueryIntoHashedKeys: async (
            query: ToriiQueryBuilder<T>
        ): Promise<[ToriiResponse<T, false>, torii.EntityKeysClause[]]> => {
            const q = query.build();
            const entities = parseEntities<T>(
                await client.getEntities(q, false)
            );
            return [entities, intoEntityKeysClause<T>(q.clause, entities)];
        },

        /**
         * Convert torii clause into EntityKeysClause[];
         *
         * @param {query} query - ToriiQueryBuilder
         * @returns [ToriiResponse<T,false>,torii.EntityKeysClause[]]
         */
        toriiEventMessagesQueryIntoHashedKeys: async <H extends boolean>(
            query: ToriiQueryBuilder<T>,
            historical: H
        ): Promise<[ToriiResponse<T, H>, torii.EntityKeysClause[]]> => {
            const q = query.build();

            const events = await client.getEventMessages(
                q,
                historical ? historical : false
            );
            return [
                (historical
                    ? parseHistoricalEvents(events)
                    : parseEntities(events)) as ToriiResponse<T, H>,

                // @ts-expect-error will fix
                intoEntityKeysClause<T>(q.clause, events),
            ];
        },
    };
}
