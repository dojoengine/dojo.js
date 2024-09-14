import { init } from "../index";
import * as torii from "@dojoengine/torii-client";
import { subscribeQuery } from "../subscribeQuery";
import { getEntities } from "../getEntities";
import { describe, it, expect, beforeEach, vi } from "vitest";

// // Mock dependencies
// vi.mock("@dojoengine/torii-client", () => ({
//     createClient: vi.fn(),
// }));
// vi.mock("../subscribeQuery", () => ({
//     subscribeQuery: vi.fn(),
// }));
// vi.mock("../getEntities", () => ({
//     getEntities: vi.fn(),
// }));

// describe("init function", () => {
//     const mockConfig: torii.ClientConfig = {
//         rpcUrl: "mock-rpc-url",
//         toriiUrl: "mock-torii-url",
//         relayUrl: "mock-relay-url",
//         worldAddress: "mock-world-address",
//     };

//     const mockClient = {} as torii.ToriiClient;

//     beforeEach(() => {
//         vi.clearAllMocks();
//         (torii.createClient as any).mockResolvedValue(mockClient);
//     });

//     it("should create a client with the provided config", async () => {
//         await init(mockConfig);
//         expect(torii.createClient).toHaveBeenCalledWith(mockConfig);
//     });

//     it("should return an object with client, subscribeQuery, and getEntities", async () => {
//         const result = await init(mockConfig);
//         expect(result).toHaveProperty("client", mockClient);
//         expect(result).toHaveProperty("subscribeQuery");
//         expect(result).toHaveProperty("getEntities");
//     });

//     it("should call subscribeQuery with correct parameters", async () => {
//         const { subscribeQuery: subscribeFn } = await init(mockConfig);
//         const mockQuery = { todos: { done: true } };
//         const mockCallback = vi.fn();

//         await subscribeFn(mockQuery, mockCallback);
//         expect(subscribeQuery).toHaveBeenCalledWith(
//             mockClient,
//             mockQuery,
//             mockCallback
//         );
//     });

//     it("should call getEntities with correct parameters", async () => {
//         const { getEntities: getEntitiesFn } = await init(mockConfig);
//         const mockQuery = { todos: { done: true } };
//         const mockCallback = vi.fn();

//         await getEntitiesFn(mockQuery, mockCallback);
//         expect(getEntities).toHaveBeenCalledWith(
//             mockClient,
//             mockQuery,
//             mockCallback
//         );
//     });
// });
