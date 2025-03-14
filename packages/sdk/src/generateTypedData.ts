import type { StarknetDomain, TypedData } from "starknet";
import type { SchemaType, UnionOfModelData } from "./types";

/**
 * Generates typed data for any user-defined message.
 *
 * @template M - The message type defined by the schema models.
 * @param {string} nsModel - Model name prefixed with namespace joined by a hyphen.
 * @param {M} message - The user-defined message content, must be part of the schema models.
 * @param {StarknetDomain} [domain] - The domain object. If not provided, uses the default domain from options.
 * @returns {TypedData} - The generated typed data.
 */
export function generateTypedData<
    T extends SchemaType,
    M extends UnionOfModelData<T>
>(
    nsModel: string,
    message: M,
    domain: StarknetDomain,
    modelMapping?: Array<{ name: string; type: string }>
): TypedData {
    return {
        types: {
            StarknetDomain: [
                { name: "name", type: "shortstring" },
                { name: "version", type: "shortstring" },
                { name: "chainId", type: "shortstring" },
                { name: "revision", type: "shortstring" },
            ],
            [nsModel]:
                undefined !== modelMapping
                    ? modelMapping
                    : Object.keys(message).map((key) => ({
                          name: key,
                          type:
                              typeof message[key] === "bigint" ||
                              typeof message[key] === "number"
                                  ? "felt"
                                  : "string",
                      })),
        },
        primaryType: nsModel,
        domain,
        message,
    };
}
