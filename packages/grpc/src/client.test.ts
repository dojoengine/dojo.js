import { describe, test, expect } from "bun:test";
import { createDojoGrpcClient } from "./client";

describe("DojoGrpcClient", () => {
    test("should create a client instance", () => {
        const client = createDojoGrpcClient({
            url: "http://localhost:8080",
        });

        expect(client).toBeDefined();
        expect(client.worldClient).toBeDefined();
    });
});
