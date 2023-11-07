import { Event } from "starknet";
import {
    Entity,
    setComponent,
    Components,
    ComponentValue,
    Type as RecsType,
} from "@dojoengine/recs";
import { poseidonHashMany } from "micro-starknet";

/**
 * Filters events from a given receipt based on specific criteria.
 *
 * @param {any} receipt - The transaction receipt.
 * @returns {any[]} An array of events that meet the filtering criteria.
 */
export function getEvents(receipt: any): any[] {
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
export function setComponentsFromEvents(
    components: Components,
    events: Event[]
) {
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
    // retrieve the component name
    const componentName = hexToAscii(eventData[0]);

    // retrieve the component from name
    const component = components[componentName];

    // get keys
    const keysNumber = parseInt(eventData[1]);
    let index = 2 + keysNumber + 1;

    const keys = eventData.slice(2, 2 + keysNumber).map((key) => BigInt(key));

    // get entityIndex from keys
    const entityIndex = getEntityIdFromKeys(keys);

    // get values
    const numberOfValues = parseInt(eventData[index++]);

    const string_keys = keys.map((key) => key.toString());

    // get values
    const values = eventData.slice(index, index + numberOfValues);

    // create component object from values with schema
    const valuesIndex = 0;
    const componentValues = decodeComponent(
        component.schema,
        [...string_keys, ...values],
        valuesIndex
    );

    console.log(componentName, entityIndex, componentValues);

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
 * @param {Object} schema - The schema that describes the structure of the component to decode.
 * @param {string[]} values - An array of string values used to populate the decoded component.
 * @param {number} valuesIndex - The current index in the values array to read from.
 * @returns {Object} The decoded component object.
 */
export function decodeComponent(
    schema: any,
    values: string[],
    valuesIndex: number
): any {
    // Iterate through the keys of the schema and reduce them to build the decoded component.
    return Object.keys(schema).reduce((acc: any, key) => {
        // If the current schema key points to an object and doesn't have a 'type' property,
        // it means it's a nested component. Therefore, we recursively decode it.
        if (typeof schema[key] === "object" && !schema[key].type) {
            acc[key] = decodeComponent(schema[key], values, valuesIndex);
        } else {
            // If the schema key points directly to a type or is not an object,
            // we parse its value using the provided parseComponentValue function
            // and move to the next index in the values array.
            acc[key] = parseComponentValue(values[valuesIndex], schema[key]);
            valuesIndex++;
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
    if (keys.length === 1) {
        return ("0x" + keys[0].toString(16)) as Entity;
    }
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

        console.log(componentValues);
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
