import { Call, CallData, TypedData } from "starknet";

import { DojoCall } from "../types";

/**
 * Gets a contract from a manifest by name.
 *
 * @param {any} manifest - The manifest object.
 * @param {string} name - The name of the contract.
 * @returns {any} The contract object.
 *
 */
export const getContractByName = (
    manifest: any,
    nameSpace: string,
    name: string
) => {
    return manifest.contracts.find((contract: any) => {
        return contract.tag === nameSpace + "-" + name;
    });
};

/**
 * Convert a DojoCall to a Call replacing contractName with contractAddress
 *
 * @param {any} manifest - The manifest object.
 * @param {DojoCall | Call} call - A DojoCall or Call
 * @returns {Call} The contract object.
 *
 */
export const parseDojoCall = (
    manifest: any,
    nameSpace: string,
    call: DojoCall | Call
): Call => {
    if ("contractName" in call) {
        const contract = getContractByName(
            manifest,
            nameSpace,
            call.contractName
        );

        return {
            contractAddress: contract.address,
            calldata: new CallData(contract.abi).compile(
                call.entrypoint,
                call.calldata
            ),
            entrypoint: call.entrypoint,
        };
    }

    return call;
};

/**
 * Parses a model name into a class name.
 *
 * @param {any} model - The model object.
 * @returns {string} The class name.
 *
 */
export const parseModelName = (model: any) => {
    // Define a set of known acronyms
    const acronyms = new Set(["ERC"]);

    return model.name
        .split("::")
        .pop()
        .split("_")
        .map((part: string) => {
            // If the part is a known acronym, keep it in uppercase
            if (acronyms.has(part.toUpperCase())) {
                return part.toUpperCase();
            }
            // If the part is fully numeric, keep it as is
            if (!isNaN(parseInt(part))) {
                return part;
            }
            // Capitalize the first letter and make the rest lowercase
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
};

/**
 * Creates a model typed data object.
 *
 * @param {any} model - The model object.
 * @returns {any} The model typed data object.
 *
 */
export const createModelTypedData = (name: string, model: any): TypedData => {
    const typesFromSchema = (
        name: string,
        schema: any,
        types: { [typeName: string]: { name: string; type: string }[] }
    ) => {
        Object.entries(schema).forEach(([key, value]) => {
            let typeName = value?.constructor.name;
            switch (typeName) {
                case "Object":
                    typesFromSchema(key, value, types);
                    break;
                case "BigInt":
                    types[name].push({ name: key, type: "felt" });
                    break;
                case "String":
                    types[name].push({ name: key, type: "shortstring" });
                    break;
                case "Number":
                    types[name].push({ name: key, type: "u128" });
                    break;
                case "Boolean":
                    types[name].push({ name: key, type: "bool" });
                    break;
                default:
                    throw new Error(`Unsupported type: ${typeName}`);
            }
        });
        return types;
    };

    return {
        types: typesFromSchema("Model", model, {
            StarknetDomain: [
                { name: "name", type: "shortstring" },
                { name: "version", type: "shortstring" },
                { name: "chainId", type: "shortstring" },
                { name: "revision", type: "shortstring" },
            ],
            OffchainMessage: [
                { name: "model", type: "shortstring" },
                { name: name, type: "Model" },
            ],
            Model: [],
        }),
        primaryType: "OffchainMessage",
        domain: {
            name: "Dojo",
            version: "1",
            chainId: "1",
            revision: "1",
        },
        message: {
            model: name,
            [name]: Object.fromEntries(
                Object.entries(model).map(([k, v]) => {
                    if (typeof v === "bigint") {
                        return [k, "0x" + v.toString(16)];
                    }

                    return [k, v];
                })
            ),
        },
    };
};
