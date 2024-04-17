import {
    Entity,
    setComponent,
    Component,
    Components,
    ComponentValue,
    Type as RecsType,
    Schema,
} from "@dojoengine/recs";
import { poseidonHashMany } from "micro-starknet";

/**
 * Filters events from a given receipt based on specific criteria.
 *
 * @param {any} receipt - The transaction receipt.
 * @returns {any[]} An array of events that meet the filtering criteria.
 */
export function getEvents(receipt: any): any[] {
    console.log(receipt);
    return receipt.events.filter((event: any) => {
        return (
            event.keys.length === 1 &&
            event.keys[0] ===
                "0x1a2f334228cee715f1f0f54053bb6b5eac54fa336e0bc1aacf7516decb0471d"
        );
    });
}

/**
 * Iterates over an array of events and updates components based on event data.
 *
 * @param {Components} components - The components to be updated.
 * @param {Event[]} events - An array of events containing component data.
 */
export function setComponentsFromEvents(components: Components, events: any[]) {
    events.forEach((event) => setComponentFromEvent(components, event.data));
}

/**
 * Updates a component based on the data from a single event.
 *
 * @param {Components} components - The components to be updated.
 * @param {string[]} eventData - The data from a single event.
 */
export function setComponentFromEvent(
    components: Components,
    eventData: string[]
) {
    console.log(eventData);

    let index = 0;

    // index 0: get component name
    const componentName = hexToAscii(eventData[index++]);

    // index 1: keys count
    const keysNumber = parseInt(eventData[index++]);

    // index 2: keys
    const keys = eventData
        .slice(index, index + keysNumber)
        .map((key) => BigInt(key));
    const string_keys = keys.map((key) => key.toString());

    // get values
    index += keysNumber;
    const numberOfValues = parseInt(eventData[index++]);
    const values = eventData.slice(index, index + numberOfValues);

    // retrieve the component from name
    const component = components[componentName];

    // create component object from values with schema
    const componentValues = decodeComponent(component, [
        ...string_keys,
        ...values,
    ]);

    // get entityIndex from keys
    const entityIndex = getEntityIdFromKeys(keys);

    // set component
    setComponent(component, entityIndex, componentValues);
}

/**
 * Parse component value into typescript typed value
 *
 * @param {string} value - The value to parse
 * @param {RecsType} type - The target type
 */
export function parseComponentValue(value: string, type: RecsType) {
    switch (type) {
        case RecsType.Boolean:
            return value === "0x0" ? false : true;
        case RecsType.Number:
            return Number(value);
        case RecsType.BigInt:
            return BigInt(value);
        default:
            return value;
    }
}

/**
 * Decodes a component based on the provided schema.
 *
 * @param {Component} component - The component description created by defineComponent(), containing the schema and metadata types.
 * @param {string[]} values - An array of string values used to populate the decoded component.
 * @returns {Object} The decoded component object.
 */
export function decodeComponent(component: Component, values: string[]): any {
    const schema: any = component.schema;
    const types: string[] = (component.metadata?.types as string[]) ?? [];
    const indices = { types: 0, values: 0 };
    return decodeComponentValues(schema, types, values, indices);
}

function decodeComponentValues(
    schema: Schema,
    types: string[],
    values: string[],
    indices: any
): any {
    // Iterate through the keys of the schema and reduce them to build the decoded component.
    return Object.keys(schema).reduce((acc: any, key) => {
        const valueType = schema[key];
        if (typeof valueType === "object") {
            // valueType is a Schema
            // it means it's a nested component. Therefore, we recursively decode it.
            acc[key] = decodeComponentValues(
                valueType as Schema,
                types,
                values,
                indices
            );
        } else {
            // valueType is a RecsType
            // If the schema key points directly to a type or is not an object,
            // we parse its value using the provided parseComponentValue function
            // and move to the next index in the values array.
            acc[key] = parseComponentValue(
                values[indices.values],
                valueType as RecsType
            );
            indices.values++;
            // the u256 type in cairo is actually { low: u128, high: u128 }
            // we need to consume two u128 values, shifting the second to compose u256
            if (types[indices.types] == "u256") {
                const value = parseComponentValue(
                    values[indices.values],
                    valueType as RecsType
                ) as bigint;
                acc[key] |= value << 128n;
                indices.values++;
            }
            indices.types++;
        }
        return acc;
    }, {});
}

/**
 * Converts a hexadecimal string to an ASCII string.
 *
 * @param {string} hex - The hexadecimal string.
 * @returns {string} The converted ASCII string.
 */
export function hexToAscii(hex: string) {
    var str = "";
    for (var n = 2; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

/**
 * Determines the entity ID from an array of keys. If only one key is provided,
 * it's directly used as the entity ID. Otherwise, a poseidon hash of the keys is calculated.
 *
 * @param {bigint[]} keys - An array of big integer keys.
 * @returns {Entity} The determined entity ID.
 */
export function getEntityIdFromKeys(keys: bigint[]): Entity {
    // if (keys.length === 1) {
    //     return ("0x" + keys[0].toString(16)) as Entity;
    // }
    // calculate the poseidon hash of the keys
    let poseidon = poseidonHashMany(keys);
    return ("0x" + poseidon.toString(16)) as Entity;
}

/**
 * Iterate through GraphQL entities and set components based on them.
 *
 * @param {Components} components - The target components structure where the parsed data will be set.
 * @param {any[]} entities - The array of GraphQL entities to parse and set in the components.
 */
export function setComponentsFromGraphQLEntities(
    components: Components,
    entities: any
) {
    entities.forEach((entity: any) => {
        setComponentFromGraphQLEntity(components, entity);
    });
}

/**
 * Set a component from a single GraphQL entity.
 *
 * @param {Components} components - The target components structure where the parsed data will be set.
 * @param {any} entityEdge - The GraphQL entity containing node information to parse and set in the components.
 */
export function setComponentFromGraphQLEntity(
    components: Components,
    entityEdge: any
) {
    const keys = entityEdge.node.keys.map((key: string) => BigInt(key));
    const entityIndex = getEntityIdFromKeys(keys);

    entityEdge.node.models.forEach((model: any) => {
        const componentName = model.__typename;
        const component = components[componentName];

        if (!component) {
            console.error(`Component ${componentName} not found`);
            return;
        }

        const componentValues = Object.keys(component.schema).reduce(
            (acc: ComponentValue, key) => {
                const value = model[key];
                const parsedValue = parseComponentValueFromGraphQLEntity(
                    value,
                    component.schema[key]
                );
                acc[key] = parsedValue;
                return acc;
            },
            {}
        );

        // console.log(componentValues);
        setComponent(component, entityIndex, componentValues);
    });
}

/**
 * Parse a component's value from a GraphQL entity based on its type or schema.
 *
 * @param {any} value - The raw value from the GraphQL entity.
 * @param {RecsType | object} type - The expected type or schema for the value.
 * @returns {any} The parsed value.
 */
export function parseComponentValueFromGraphQLEntity(
    value: any,
    type: RecsType | object
): any {
    if (value === undefined || value === null) return value;

    // Check if type is an object (i.e., a nested schema)
    if (typeof type === "object" && type !== null) {
        const parsedObject: any = {};
        for (const key in type) {
            parsedObject[key] = parseComponentValueFromGraphQLEntity(
                value[key],
                (type as any)[key]
            );
        }
        return parsedObject;
    }

    // For primitive types
    switch (type) {
        case RecsType.Boolean:
            return !!value;
        case RecsType.Number:
            if (typeof value === "string") {
                return 0;
            }
            return !isNaN(Number(value)) ? Number(value) : value;
        case RecsType.BigInt:
            return BigInt(value);
        default:
            return value;
    }
}

export function shortenHex(hexString: string, numDigits = 6) {
    if (hexString?.length <= numDigits) {
        return hexString;
    }

    const halfDigits = Math.floor(numDigits / 2);
    const firstHalf = hexString.slice(0, halfDigits);
    const secondHalf = hexString.slice(-halfDigits);
    return `${firstHalf}...${secondHalf}`;
}
