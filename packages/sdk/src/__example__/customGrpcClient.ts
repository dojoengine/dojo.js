// @ts-nocheck This is an example file
import { init, initGrpc } from "@dojoengine/sdk";

// Example 1: Using the SDK with default setup (no change from before)
// This creates both a torii-wasm client and a ToriiGrpcClient internally
async function useDefaultClient() {
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

    // SDK uses torii-wasm client for most operations
    // and ToriiGrpcClient for event messages and some token operations
    return sdk;
}

// Example 2: Using the SDK with custom gRPC client (new feature)
// When grpcClient is provided, it REPLACES the default client entirely
async function useCustomClient() {
    // Initialize a custom gRPC client that will handle ALL operations
    const grpcClient = initGrpc({
        toriiUrl: "http://localhost:8080",
        worldAddress: "0x...",
    });

    // Pass the custom client to the SDK
    // Note: When grpcClient is provided, the torii-wasm client is NOT created
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
        grpcClient, // This replaces the default client entirely
    });

    // SDK now uses ONLY the grpcClient for ALL operations
    // (entities, events, tokens, messages, etc.)
    return sdk;
}

// Example 3: Runtime selection of gRPC client
async function runtimeSelection(useGrpc: boolean) {
    const config = {
        client: {
            worldAddress: "0x...",
            toriiUrl: "http://localhost:8080",
        },
        domain: {
            name: "MyApp",
            version: "1.0.0",
            chainId: "SN_MAIN",
        },
    };

    // Choose client at runtime
    if (useGrpc) {
        const grpcClient = initGrpc({
            toriiUrl: config.client.toriiUrl,
            worldAddress: config.client.worldAddress,
        });
        return await init({ ...config, grpcClient });
    } else {
        // Use default client setup
        return await init(config);
    }
}

// Example 4: Creating multiple SDKs with different gRPC clients
async function multipleClients() {
    const grpcClient1 = initGrpc({
        toriiUrl: "http://localhost:8080",
        worldAddress: "0x123...",
    });

    const grpcClient2 = initGrpc({
        toriiUrl: "http://localhost:8081",
        worldAddress: "0x456...",
    });

    const sdk1 = await init({
        client: {
            worldAddress: "0x123...",
            toriiUrl: "http://localhost:8080",
        },
        domain: {
            name: "MyApp1",
            version: "1.0.0",
            chainId: "SN_MAIN",
        },
        grpcClient: grpcClient1,
    });

    const sdk2 = await init({
        client: {
            worldAddress: "0x456...",
            toriiUrl: "http://localhost:8081",
        },
        domain: {
            name: "MyApp2",
            version: "1.0.0",
            chainId: "SN_MAIN",
        },
        grpcClient: grpcClient2,
    });

    return { sdk1, sdk2 };
}
