import * as torii from "@dojoengine/torii-client";
import { Account, Signature, StarknetDomain, TypedData } from "starknet";

import {
    GetParams,
    SchemaType,
    SDK,
    SDKConfig,
    SubscribeParams,
    SubscribeResponse,
    ToriiResponse,
    UnionOfModelData,
} from "./types";
import { intoEntityKeysClause } from "./convertClauseToEntityKeysClause";
import { parseEntities } from "./parseEntities";
import { parseHistoricalEvents } from "./parseHistoricalEvents";

export * from "./types";
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

/**
 * Initializes the SDK with the provided configuration and schema.
 *
 * @template T - The schema type.
 * @param {torii.ClientConfig} options - The configuration object for the Torii client.
 */
export async function init<T extends SchemaType>(
    options: SDKConfig
): Promise<SDK<T>> {
    const client = await createClient(options.client);

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
            const entities = parseEntities<T>(await client.getEntities(q));
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
                                callback({ data: parsedData });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
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
                    historical,
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
                                });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
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
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T, false>} params - Parameters object
         * @returns {Promise<ToriiResponse<T,false>>} - A promise that resolves to the standardized query result.
         */
        getEntities: async ({ query }) => {
            const q = query.build();
            return parseEntities(await client.getEntities(q));
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
         * @param {string} primaryType - The primary type of the message.
         * @param {M} message - The user-defined message content, must be part of the schema models.
         * @param {StarknetDomain} [domain] - The domain object. If not provided, uses the default domain from options.
         * @returns {TypedData} - The generated typed data.
         */
        generateTypedData: <M extends UnionOfModelData<T>>(
            primaryType: string,
            message: M,
            domain: StarknetDomain = options.domain
        ): TypedData => ({
            types: {
                StarknetDomain: [
                    { name: "name", type: "shortstring" },
                    { name: "version", type: "shortstring" },
                    { name: "chainId", type: "shortstring" },
                    { name: "revision", type: "shortstring" },
                ],
                [primaryType]: Object.keys(message).map((key) => ({
                    name: key,
                    type:
                        typeof message[key] === "bigint" ||
                        typeof message[key] === "number"
                            ? "felt"
                            : "string",
                })),
            },
            primaryType,
            domain,
            message,
        }),

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
         * @param {(string)[]} contract_addresses
         * @returns {Promise<Tokens>}
         */
        getTokens: async (
            contract_addresses: string[]
        ): Promise<torii.Tokens> => {
            return await client.getTokens(contract_addresses);
        },

        /**
         * @param {(string)[]} account_addresses
         * @param {(string)[]} contract_addresses
         * @returns {Promise<TokenBalances>}
         */
        getTokenBalances: async (
            account_addresses: string[],
            contract_addresses: string[]
        ): Promise<torii.TokenBalances> => {
            return await client.getTokenBalances(
                account_addresses,
                contract_addresses
            );
        },

        /**
         * Subscribes to token balance updates
         *
         * # Parameters
         * @param {string[]} contract_addresses - Array of contract addresses to filter (empty for all)
         * @param {string[]} account_addresses - Array of account addresses to filter (empty for all)
         * @param {Funtion} callback - JavaScript function to call on updates
         *
         * # Returns
         * Result containing subscription handle or error
         * @returns torii.Subscription
         */
        onTokenBalanceUpdated: (
            contract_addresses: string[],
            account_addresses: string[],
            callback: Function
        ): torii.Subscription => {
            return client.onTokenBalanceUpdated(
                contract_addresses,
                account_addresses,
                callback
            );
        },

        /**
         * Updates an existing token balance subscription
         *
         * # Parameters
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {string[]} contract_addresses - New array of contract addresses to filter
         * @param {string[]} account_addresses - New array of account addresses to filter
         *
         * # Returns
         * Result containing unit or error
         * @returns {Promise<void>}
         */
        updateTokenBalanceSubscription: async (
            subscription: torii.Subscription,
            contract_addresses: string[],
            account_addresses: string[]
        ): Promise<void> => {
            return await client.updateTokenBalanceSubscription(
                subscription,
                contract_addresses,
                account_addresses
            );
        },
    };
}
