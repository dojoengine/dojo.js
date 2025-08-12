import { createDojoGrpcClient } from "../client";
import * as fs from "fs";
import * as path from "path";
import {
    RetrieveEntitiesRequest,
    RetrieveTokensRequest,
    RetrieveTokenBalancesRequest,
    RetrieveTransactionsRequest,
    RetrieveControllersRequest,
} from "../generated/world";
import {
    PaginationDirection,
    PatternMatching,
    ComparisonOperator,
} from "../generated/types";

const TORII_URL = "http://localhost:8080";

async function fetchRawTestData() {
    console.log("Connecting to torii server at", TORII_URL);

    const client = createDojoGrpcClient({
        url: TORII_URL,
    });

    const outputDir = path.join(__dirname, "../../src/__tests__/raw-data");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        console.log("\n1. Fetching raw entities (all)...");
        const allEntitiesRequest: RetrieveEntitiesRequest = {
            query: {
                clause: undefined,
                no_hashed_keys: false,
                models: [],
                pagination: {
                    cursor: "",
                    limit: 100,
                    direction: PaginationDirection.FORWARD,
                    order_by: [],
                },
                historical: false,
            },
        };

        const allEntitiesResponse =
            await client.worldClient.retrieveEntities(allEntitiesRequest)
                .response;
        console.log(`  Found ${allEntitiesResponse.entities.length} entities`);

        fs.writeFileSync(
            path.join(outputDir, "entities_all.json"),
            JSON.stringify(
                allEntitiesResponse,
                (key, value) => {
                    // Convert BigInt to string for JSON serialization
                    if (typeof value === "bigint") {
                        return value.toString();
                    }
                    // Convert Uint8Array to hex string
                    if (value instanceof Uint8Array) {
                        return (
                            "0x" +
                            Array.from(value)
                                .map((b) => b.toString(16).padStart(2, "0"))
                                .join("")
                        );
                    }
                    return value;
                },
                4
            )
        );

        console.log("\n2. Fetching raw entities with model filter...");
        const modelEntitiesRequest: RetrieveEntitiesRequest = {
            query: {
                clause: {
                    clause_type: {
                        oneofKind: "keys",
                        keys: {
                            keys: [],
                            pattern_matching: PatternMatching.VariableLen,
                            models: [
                                "dojo_starter-Position",
                                "dojo_starter-Moves",
                            ],
                        },
                    },
                },
                no_hashed_keys: false,
                models: ["dojo_starter-Position", "dojo_starter-Moves"],
                pagination: {
                    cursor: "",
                    limit: 50,
                    direction: PaginationDirection.FORWARD,
                    order_by: [],
                },
                historical: false,
            },
        };

        const modelEntitiesResponse =
            await client.worldClient.retrieveEntities(modelEntitiesRequest)
                .response;
        console.log(
            `  Found ${modelEntitiesResponse.entities.length} entities with Position/Moves models`
        );

        fs.writeFileSync(
            path.join(outputDir, "entities_with_models.json"),
            JSON.stringify(
                modelEntitiesResponse,
                (key, value) => {
                    if (typeof value === "bigint") {
                        return value.toString();
                    }
                    if (value instanceof Uint8Array) {
                        return (
                            "0x" +
                            Array.from(value)
                                .map((b) => b.toString(16).padStart(2, "0"))
                                .join("")
                        );
                    }
                    return value;
                },
                4
            )
        );

        console.log("\n3. Fetching raw entities with keys clause...");
        const keysEntitiesRequest: RetrieveEntitiesRequest = {
            query: {
                clause: {
                    clause_type: {
                        oneofKind: "keys",
                        keys: {
                            keys: [new Uint8Array(0)], // Empty key for all entities
                            pattern_matching: PatternMatching.VariableLen,
                            models: [],
                        },
                    },
                },
                no_hashed_keys: false,
                models: [],
                pagination: {
                    cursor: "",
                    limit: 10,
                    direction: PaginationDirection.FORWARD,
                    order_by: [],
                },
                historical: false,
            },
        };

        const keysEntitiesResponse =
            await client.worldClient.retrieveEntities(keysEntitiesRequest)
                .response;
        console.log(
            `  Found ${keysEntitiesResponse.entities.length} entities with keys clause`
        );

        fs.writeFileSync(
            path.join(outputDir, "entities_with_keys.json"),
            JSON.stringify(
                keysEntitiesResponse,
                (key, value) => {
                    if (typeof value === "bigint") {
                        return value.toString();
                    }
                    if (value instanceof Uint8Array) {
                        return (
                            "0x" +
                            Array.from(value)
                                .map((b) => b.toString(16).padStart(2, "0"))
                                .join("")
                        );
                    }
                    return value;
                },
                4
            )
        );

        console.log("\n4. Fetching raw tokens...");
        try {
            const tokensRequest: RetrieveTokensRequest = {
                query: {
                    contract_addresses: [],
                    token_ids: [],
                    pagination: {
                        cursor: "",
                        limit: 50,
                        direction: PaginationDirection.FORWARD,
                        order_by: [],
                    },
                },
            };

            const tokensResponse =
                await client.worldClient.retrieveTokens(tokensRequest).response;
            console.log(`  Found ${tokensResponse.tokens.length} tokens`);

            fs.writeFileSync(
                path.join(outputDir, "tokens.json"),
                JSON.stringify(
                    tokensResponse,
                    (key, value) => {
                        if (typeof value === "bigint") {
                            return value.toString();
                        }
                        if (value instanceof Uint8Array) {
                            return (
                                "0x" +
                                Array.from(value)
                                    .map((b) => b.toString(16).padStart(2, "0"))
                                    .join("")
                            );
                        }
                        return value;
                    },
                    4
                )
            );
        } catch (error) {
            console.log("  Error fetching tokens:", error);
        }

        console.log("\n5. Fetching raw token balances...");
        try {
            const tokenBalancesRequest: RetrieveTokenBalancesRequest = {
                query: {
                    contract_addresses: [],
                    account_addresses: [],
                    token_ids: [],
                    pagination: {
                        cursor: "",
                        limit: 50,
                        direction: PaginationDirection.FORWARD,
                        order_by: [],
                    },
                },
            };

            const tokenBalancesResponse =
                await client.worldClient.retrieveTokenBalances(
                    tokenBalancesRequest
                ).response;
            console.log(
                `  Found ${tokenBalancesResponse.balances.length} token balances`
            );

            fs.writeFileSync(
                path.join(outputDir, "token_balances.json"),
                JSON.stringify(
                    tokenBalancesResponse,
                    (key, value) => {
                        if (typeof value === "bigint") {
                            return value.toString();
                        }
                        if (value instanceof Uint8Array) {
                            return (
                                "0x" +
                                Array.from(value)
                                    .map((b) => b.toString(16).padStart(2, "0"))
                                    .join("")
                            );
                        }
                        return value;
                    },
                    4
                )
            );
        } catch (error) {
            console.log("  Error fetching token balances:", error);
        }

        console.log("\n6. Fetching raw transactions...");
        try {
            const transactionsRequest: RetrieveTransactionsRequest = {
                filter: {
                    transaction_hashes: [],
                    caller_addresses: [],
                    contract_addresses: [],
                    entrypoints: [],
                    model_selectors: [],
                    from_block: undefined,
                    to_block: undefined,
                },
                pagination: {
                    cursor: "",
                    limit: 50,
                    direction: PaginationDirection.FORWARD,
                    order_by: [],
                },
            };

            const transactionsResponse =
                await client.worldClient.retrieveTransactions(
                    transactionsRequest
                ).response;
            console.log(
                `  Found ${transactionsResponse.transactions.length} transactions`
            );

            fs.writeFileSync(
                path.join(outputDir, "transactions.json"),
                JSON.stringify(
                    transactionsResponse,
                    (key, value) => {
                        if (typeof value === "bigint") {
                            return value.toString();
                        }
                        if (value instanceof Uint8Array) {
                            return (
                                "0x" +
                                Array.from(value)
                                    .map((b) => b.toString(16).padStart(2, "0"))
                                    .join("")
                            );
                        }
                        return value;
                    },
                    4
                )
            );
        } catch (error) {
            console.log("  Error fetching transactions:", error);
        }

        console.log("\n7. Fetching raw controllers...");
        try {
            const controllersRequest: RetrieveControllersRequest = {
                query: {
                    contract_addresses: [],
                    usernames: [],
                    pagination: {
                        cursor: "",
                        limit: 50,
                        direction: PaginationDirection.FORWARD,
                        order_by: [],
                    },
                },
            };

            const controllersResponse =
                await client.worldClient.retrieveControllers(controllersRequest)
                    .response;
            console.log(
                `  Found ${controllersResponse.controllers.length} controllers`
            );

            fs.writeFileSync(
                path.join(outputDir, "controllers.json"),
                JSON.stringify(
                    controllersResponse,
                    (key, value) => {
                        if (typeof value === "bigint") {
                            return value.toString();
                        }
                        if (value instanceof Uint8Array) {
                            return (
                                "0x" +
                                Array.from(value)
                                    .map((b) => b.toString(16).padStart(2, "0"))
                                    .join("")
                            );
                        }
                        return value;
                    },
                    4
                )
            );
        } catch (error) {
            console.log("  Error fetching controllers:", error);
        }

        console.log(`\n✅ Raw test data saved to ${outputDir}`);
        console.log("   Files created:");
        const files = fs.readdirSync(outputDir);
        files.forEach((file) => console.log(`     - ${file}`));
    } catch (error) {
        console.error("Error fetching raw test data:", error);
    } finally {
        client.destroy();
    }
}

fetchRawTestData().catch(console.error);
