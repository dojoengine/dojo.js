import { Schema } from "effect";
import {
    transformTransaction,
    transformEntity,
} from "../mappings/effect-schema/transformers";
import { mapTransaction, mapEntity } from "../mappings/types";

// Test simple transaction transformation
const testTransaction = {
    transaction_hash: new Uint8Array([1, 2, 3]),
    sender_address: new Uint8Array([4, 5, 6]),
    calldata: [new Uint8Array([7, 8])],
    max_fee: new Uint8Array([9, 10]),
    signature: [new Uint8Array([11, 12])],
    nonce: new Uint8Array([13, 14]),
    block_number: BigInt(1000),
    block_timestamp: BigInt(2000),
    transaction_type: "invoke",
    calls: [],
    unique_models: [],
};

console.log("Testing Effect Schema transformations...");

try {
    // Test manual transformation
    const start1 = performance.now();
    const manual = mapTransaction(testTransaction);
    const end1 = performance.now();
    console.log("Manual transformation time:", end1 - start1, "ms");
    console.log("Manual result:", manual);

    // Test Effect Schema transformation
    const start2 = performance.now();
    const effect = transformTransaction(testTransaction);
    const end2 = performance.now();
    console.log("Effect Schema transformation time:", end2 - start2, "ms");
    console.log("Effect result:", effect);
} catch (error) {
    console.error("Error:", error);
}
