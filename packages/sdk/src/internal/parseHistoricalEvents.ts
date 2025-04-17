import type * as torii from "@dojoengine/torii-wasm/types";
import type { SchemaType, StandardizedQueryResult } from "./types.ts";

import { parseEntities } from "./parseEntities.ts";

/**
 * Parses historical events returned by torii
 *
 * @template T - The schema type.
 * @param {torii.Entities} entities - The collection of entities to parse.
 * @param {{ logging?: boolean }} [options] - Optional settings for logging.
 * @returns {StandardizedQueryResult<T>} - The parsed entities in a standardized query result format.
 *
 * @example
 * const parsedResult = parseHistoricalEvents(entities, { logging: true });
 * console.log(parsedResult);
 */
export function parseHistoricalEvents<T extends SchemaType>(
    entities: torii.Entities,
    options?: { logging?: boolean }
): StandardizedQueryResult<T> {
    if (options?.logging) {
        console.log("Raw historical events", entities);
    }
    // Events come from torii flagged as "dojo_starter-Moved-idx"
    let events: StandardizedQueryResult<T> = [];
    for (const entityId in entities) {
        const entityData = entities[entityId];
        const keys = orderKeys(Object.keys(entityData));

        for (const model of keys) {
            const modelData = entityData[model];
            const modelNameSplit = model.split("-");
            modelNameSplit.pop();
            // event at index 0 does not have index thus, we take modelName as is
            const modelName =
                modelNameSplit.length > 1 ? modelNameSplit.join("-") : model;

            events.push(
                ...parseEntities<T>(
                    { [entityId]: { [modelName]: modelData } },
                    options
                )
            );
        }
    }
    if (options?.logging) {
        console.log("Parsed historical events", events);
    }

    return events;
}

/**
 * Torii entities comes in format:
 * {
 *    "entityId": {
 *      "ns-Model-idx": {
 *       ...toriiData
 *      }
 *    }
 * }
 *
 * Object.keys returns keys but is not respecting defined keys order.
 * Therefore, we need do sort keys before building up final parsedEntities array.
 */
export function orderKeys(keys: string[]) {
    keys.sort((a, b) => {
        // Extract the last number from each string using regex
        const getLastNumber = (str: string) => {
            const match = str.match(/-(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        };

        return getLastNumber(a) - getLastNumber(b);
    });
    return keys;
}
