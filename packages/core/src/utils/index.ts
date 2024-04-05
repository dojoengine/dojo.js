import { Type } from "@dojoengine/recs";

/**
 * Gets a contract from a manifest by name.
 *
 * @param {any} manifest - The manifest object.
 * @param {string} name - The name of the contract.
 * @returns {any} The contract object.
 *
 */
export const getContractByName = (manifest: any, name: string) => {
    return manifest.contracts.find((contract: any) => {
        const nameParts = contract.name.split("::");
        // Check if the last part matches or if the full name matches
        return (
            nameParts[nameParts.length - 1] === name || contract.name === name
        );
    });
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
export const createModelTypedData = (name: string, model: any) => {
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
            [name]: model,
        },
    };
};
