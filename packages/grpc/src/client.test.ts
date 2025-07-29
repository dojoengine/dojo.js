import { describe, it, expect } from "vitest";
import { createDojoGrpcClient } from "./client";

describe("DojoGrpcClient", () => {
    it("should create a client instance", () => {
        const client = createDojoGrpcClient({
            url: "http://localhost:8080",
        });

        expect(client).toBeDefined();
        expect(client.worldClient).toBeDefined();
    });
});
