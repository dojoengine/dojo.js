import { describe, it, expect, vi } from "vitest";
import * as torii from "@dojoengine/torii-client";
import { init } from "../index";

describe("SDK Client Tests", () => {
    const mockClient = {
        onEntityUpdated: vi.fn(),
    };

    const mockCreateClient = vi
        .spyOn(torii, "createClient")
        .mockResolvedValue(mockClient);

    const initOptions: torii.ClientConfig = {
        rpcUrl: "http://localhost:8545",
        toriiUrl: "http://localhost:8080",
        relayUrl: "http://localhost:8081",
        worldAddress: "0x1234567890abcdef",
    };

    it("should create a client with the correct configuration", async () => {
        const { client } = await init(initOptions);
        expect(mockCreateClient).toHaveBeenCalledWith({
            rpcUrl: initOptions.rpcUrl,
            toriiUrl: initOptions.toriiUrl,
            relayUrl: initOptions.relayUrl,
            worldAddress: initOptions.worldAddress,
        });
        expect(client).toBe(mockClient);
    });

    it("should subscribe to a query and handle updates", async () => {
        const { client, subscribeQuery } = await init(initOptions);
        const mockCallback = vi.fn();
        const query = { key: "value" };

        const mockSubscription = {
            unsubscribe: vi.fn(),
        };

        mockClient.onEntityUpdated.mockImplementation((clauses, callback) => {
            callback({ data: [{ id: 1 }] });
            return mockSubscription;
        });

        const subscription = await subscribeQuery(query, mockCallback);

        expect(mockClient.onEntityUpdated).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith({ data: [{ id: 1 }] });
        expect(subscription).toBe(mockSubscription);
    });
});
