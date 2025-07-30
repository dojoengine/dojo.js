import type { Account } from "starknet";
import { init } from "../web";

// Example usage of sendMessageBatch
async function exampleSendMessageBatch(account: Account) {
    // Initialize SDK
    const sdk = await init({
        client: {
            worldAddress: "0x...",
            toriiUrl: "http://localhost:8080",
        },
        domain: {
            name: "MyApp",
            version: "1.0.0",
            chainId: "SN_MAIN",
        },
    });

    // Prepare multiple messages
    const messages = [
        {
            player: "0x1234",
            action: "move",
            x: 10,
            y: 20,
        },
        {
            player: "0x1234",
            action: "attack",
            target: "0x5678",
        },
        {
            player: "0x1234",
            action: "collect",
            item: "sword",
        },
    ];

    // Generate typed data for each message
    const typedDataArray = messages.map((message, index) =>
        sdk.generateTypedData(`world-Action${index}`, message)
    );

    // Send all messages in a single batch
    const result = await sdk.sendMessageBatch(typedDataArray, account);

    if (result.isOk()) {
        console.log("Messages sent successfully!");
        console.log("Message IDs:", result.value);
    } else {
        console.error("Failed to send messages:", result.error);
    }
}

export { exampleSendMessageBatch };
