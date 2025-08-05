// Example usage of ToriiGrpcClient with the same API as torii-wasm

import { ToriiGrpcClient } from "./torii-client";
import { ToriiQueryBuilder } from "@dojoengine/internal";

async function main() {
    // Create a client with the same config as torii-wasm
    const client = new ToriiGrpcClient({
        toriiUrl: "https://api.cartridge.gg/x/pistols-mainnet/torii",
        worldAddress:
            "0x8b4838140a3cbd36ebe64d4b5aaf56a30cc3753c928a79338bf56c53f506c5",
    });

    // Build a query using ToriiQueryBuilder
    const query = new ToriiQueryBuilder()
        .withLimit(10)
        .withEntityModels(["dojo_starter-Position", "dojo_starter-Moves"])
        .includeHashedKeys()
        .build();

    // Get entities (same API as torii-wasm)
    const entities = await client.getEntities(query);
    console.log("Entities:", entities);

    // Subscribe to entity updates (same API as torii-wasm)
    const subscription = await client.onEntityUpdated(
        {
            Keys: {
                keys: [undefined],
                pattern_matching: "VariableLen",
                models: [],
            },
        },
        (entity) => {
            console.log("Entity updated:", entity);
        }
    );

    // Get tokens
    const tokens = await client.getTokens({
        contract_addresses: [],
        token_ids: [],
        pagination: {
            limit: 500,
            cursor: undefined,
            direction: "Forward",
            order_by: [],
        },
    });
    console.log("Tokens:", tokens);

    // Subscribe to transactions
    const txSubscription = await client.onTransaction(
        {
            transaction_hashes: [],
            caller_addresses: [],
            contract_addresses: [],
            entrypoints: [],
            model_selectors: [],
            from_block: undefined,
            to_block: undefined,
        },
        (transaction) => {
            console.log("New transaction:", transaction);
        }
    );

    const tokenssub = await client.onTokenBalanceUpdated(
        [],
        [],
        [],
        (token) => {
            console.log("Token balance update", token);
        }
    );

    process.on("SIGINT", () => {
        console.log("\nInterrupted, cleaning up...");
        subscription.cancel();
        txSubscription.cancel();
        tokenssub.cancel();
        client.destroy();
        process.exit(0);
    });
}

// Run the example
main().catch(console.error);
