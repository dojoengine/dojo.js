import * as torii from "@dojoengine/torii-wasm";
import { err, ok, type Result } from "neverthrow";
import type { Account, Signature, TypedData } from "starknet";
import {
    NO_ACCOUNT,
    type SchemaType,
    type SDK,
    type SDKConfig,
} from "@dojoengine/internal";
import { createSDK, type GrpcClientInterface } from "../createSDK.js";

export * from "@dojoengine/internal";
export { initGrpc, type InitGrpcOptions } from "../initGrpc.js";
export type { GrpcClientInterface } from "../createSDK.js";

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
    options: SDKConfig & { grpcClient?: GrpcClientInterface }
): Promise<SDK<T>> {
    // Only create torii client if grpcClient is not provided
    let client: torii.ToriiClient | undefined;

    if (!options.grpcClient) {
        const clientConfig = {
            ...defaultClientConfig,
            ...options.client,
        } as torii.ClientConfig;

        client = await new torii.ToriiClient(clientConfig);
    }

    // Web-specific message signing implementation
    const sendMessage = async (
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
            const publishClient = options.grpcClient || client!;
            return ok(
                await publishClient.publishMessage({
                    message: dataString,
                    signature: Array.isArray(signature)
                        ? signature
                        : [signature.r.toString(), signature.s.toString()],
                    world_address: options.client!.worldAddress!,
                })
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            throw error;
        }
    };

    // Web-specific batch message signing implementation
    const sendMessageBatch = async (
        data: TypedData[],
        account?: Account
    ): Promise<Result<string[], string>> => {
        if (!account) {
            return err(NO_ACCOUNT);
        }

        try {
            // Sign all messages and prepare batch
            const messages = [];
            for (const typedData of data) {
                const signature: Signature =
                    await account.signMessage(typedData);
                const dataString = JSON.stringify(typedData);

                messages.push({
                    message: dataString,
                    signature: Array.isArray(signature)
                        ? signature
                        : [signature.r.toString(), signature.s.toString()],
                    world_address: options.client!.worldAddress!,
                });
            }

            // Publish the batch of signed messages
            const publishClient = options.grpcClient || client!;
            return ok(await publishClient.publishMessageBatch(messages));
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
        grpcClient: options.grpcClient,
    });
}
