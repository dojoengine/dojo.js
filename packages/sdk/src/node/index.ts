import * as torii from "@dojoengine/torii-wasm/node";
import { err, ok, type Result } from "neverthrow";
import type { Account, Signature, TypedData } from "starknet";
import { NO_IDENTITY, NO_SIGNER } from "../internal/errors.ts";

export * from "../internal/clauseBuilder.ts";
export * from "../internal/models.ts";
export * from "../internal/toriiQueryBuilder.ts";
export * from "../internal/toriiQueryBuilder.ts";
export * from "../internal/types.ts";
export * from "./worker.ts";

import { createSDK } from "../internal/createSDK.ts";
import type { SchemaType, SDK, SDKConfig } from "../internal/types.ts";

export const defaultClientConfig: Partial<torii.ClientConfig> = {
    toriiUrl: "http://localhost:8080",
};

/**
 * Initializes the SDK for Node.js environment with the provided configuration and schema.
 *
 * @template T - The schema type.
 * @param {SDKConfig} options - The configuration object for the SDK.
 * @returns {Promise<SDK<T>>} - A promise that resolves to the initialized SDK instance.
 *
 * @example
 * ```typescript
 * import { init } from "@dojoengine/sdk/node";
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
 *     signer: signingKey,
 *     identity: "0x...",
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

    // Node-specific message signing implementation
    const sendMessage = async (
        data: TypedData,
        _account?: Account
    ): Promise<Result<string, string>> => {
        if (!options.signer) {
            return err(NO_SIGNER);
        }
        if (!options.identity) {
            return err(NO_IDENTITY);
        }
        if (!_account) {
            return err(NO_IDENTITY);
        }

        try {
            // Sign the typed data
            const signature: Signature = await _account.signMessage(data);

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

    // Node-specific batch message signing implementation
    const sendMessageBatch = async (
        data: TypedData[],
        _account?: Account
    ): Promise<Result<string[], string>> => {
        if (!options.signer) {
            return err(NO_SIGNER);
        }
        if (!options.identity) {
            return err(NO_IDENTITY);
        }
        if (!_account) {
            return err(NO_IDENTITY);
        }

        try {
            // Sign all messages and prepare batch
            const messages = [];
            for (const typedData of data) {
                const signature: Signature =
                    await _account.signMessage(typedData);
                const dataString = JSON.stringify(typedData);

                messages.push({
                    message: dataString,
                    signature: Array.isArray(signature)
                        ? signature
                        : [signature.r.toString(), signature.s.toString()],
                });
            }

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
        sendMessage,
        sendMessageBatch,
    });
}
