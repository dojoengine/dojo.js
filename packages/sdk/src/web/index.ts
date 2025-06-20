import * as torii from "@dojoengine/torii-wasm";
import type { Account, Signature, TypedData } from "starknet";
import { err, ok, type Result } from "neverthrow";

import type { SDKConfig, SchemaType, SDK } from "../internal/types";
import { NO_ACCOUNT } from "../internal/errors";
import { createSDK } from "../internal/createSDK";

export * from "../internal/types";
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
};

/**
 * Initializes the SDK for web environment with the provided configuration and schema.
 *
 * @template T - The schema type.
 * @param {SDKConfig} options - The configuration object for the SDK.
 * @returns {Promise<SDK<T>>} - A promise that resolves to the initialized SDK instance.
 *
 * @example
 * ```typescript
 * import { init } from "@dojoengine/sdk";
 * import { schema } from "./models.gen";
 *
 * const sdk = await init<typeof schema>({
 *     client: {
 *         worldAddress: "0x...",
 *         toriiUrl: "http://localhost:8080",
 *     },
 *     domain: {
 *         name: "MyApp",
 *         version: "1.0.0",
 *         chainId: "SN_MAIN",
 *     },
 * });
 * ```
 */
export async function init<T extends SchemaType>(
    options: SDKConfig
): Promise<SDK<T>> {
    const clientConfig = {
        ...defaultClientConfig,
        ...options.client,
    } as torii.ClientConfig;

    const client = await new torii.ToriiClient(clientConfig);

    // Web-specific message signing implementation
    const signMessage = async (
        data: TypedData,
        account?: Account
    ): Promise<Result<string, string>> => {
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
                await client.publishMessage({
                    message: dataString,
                    signature: Array.isArray(signature)
                        ? signature
                        : [signature.r.toString(), signature.s.toString()],
                })
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            throw error;
        }
    };

    // Web-specific batch message signing implementation
    const signMessageBatch = async (
        data: TypedData[],
        account?: Account
    ): Promise<Result<string[], string>> => {
        if (!account) {
            return err(NO_ACCOUNT);
        }

        try {
            // Sign all messages and prepare batch
            const messages = await Promise.all(
                data.map(async (typedData) => {
                    const signature: Signature = await account.signMessage(typedData);
                    const dataString = JSON.stringify(typedData);
                    
                    return {
                        message: dataString,
                        signature: Array.isArray(signature)
                            ? signature
                            : [signature.r.toString(), signature.s.toString()]
                    };
                })
            );

            // Publish the batch of signed messages
            return ok(await client.publishMessageBatch(messages));
        } catch (error) {
            console.error("Failed to send message batch:", error);
            throw error;
        }
    };

    return createSDK<T>({
        client,
        config: options,
        signMessage,
        signMessageBatch,
    });
}
