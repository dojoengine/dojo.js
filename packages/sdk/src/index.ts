import * as torii from "@dojoengine/torii-client";
import { Account, Signature, StarknetDomain, TypedData } from "starknet";

import { getEntities } from "./getEntities";
import { getEventMessages } from "./getEventMessages";
import { subscribeEntityQuery } from "./subscribeEntityQuery";
import { subscribeEventQuery } from "./subscribeEventQuery";
import { SchemaType, SDK, SDKConfig, UnionOfModelData } from "./types";

export * from "./types";
export * from "./state";
export * from "./queryBuilder";

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
 * @param {T} schema - The schema object defining the structure of the data.
 * @returns {Promise<SDK<T>>} - A promise that resolves to the initialized SDK.
 */
export async function init<T extends SchemaType>(
    options: SDKConfig,
    schema: T
): Promise<SDK<T>> {
    const client = await createClient(options.client);

    return {
        client,
        /**
         * Subscribes to entity queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<void>} - A promise that resolves when the subscription is set up.
         */
        subscribeEntityQuery: ({ query, callback, options }) =>
            subscribeEntityQuery(client, query, schema, callback, options),
        /**
         * Subscribes to event queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<void>} - A promise that resolves when the subscription is set up.
         */
        subscribeEventQuery: ({ query, callback, options }) =>
            subscribeEventQuery(client, query, schema, callback, options),
        /**
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
         */
        getEntities: ({ query, callback, limit, offset, options }) =>
            getEntities(
                client,
                query,
                schema,
                callback,
                limit,
                offset,
                options
            ),
        /**
         * Fetches event messages based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
         */
        getEventMessages: ({ query, callback, limit, offset, options }) =>
            getEventMessages(
                client,
                query,
                schema,
                callback,
                limit,
                offset,
                options
            ),

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
         * @param {boolean} [isSessionSignature=false] - Whether the signature is a session signature.
         * @returns {Promise<void>} - A promise that resolves when the message is sent successfully.
         * @throws {Error} If the message sending fails.
         */
        sendMessage: async (
            data: TypedData,
            account: Account,
            isSessionSignature: boolean = false
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
                        : [signature.r.toString(), signature.s.toString()],
                    isSessionSignature
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
    };
}
