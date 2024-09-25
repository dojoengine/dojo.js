import { setComponent } from "@dojoengine/recs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { setEntities } from "../recs";
import { convertValues } from "../utils";

// Mock dependencies
vi.mock("@dojoengine/recs", () => ({
    setComponent: vi.fn(),
    Component: vi.fn(),
}));

vi.mock("@dojoengine/torii-client", () => ({
    Client: vi.fn(),
}));

vi.mock("../utils", () => ({
    convertValues: vi.fn(),
}));

describe("RECS functions", () => {
    let mockClient: any;
    let mockComponents: any[];

    beforeEach(() => {
        mockClient = {
            getAllEntities: vi.fn(),
            onEntityUpdated: vi.fn(),
        };
        mockComponents = [{ schema: {} }, { schema: {} }];
        vi.clearAllMocks();
    });

    describe("setEntities", () => {
        it("should set components for each entity", async () => {
            const entities = {
                1: { comp1: { value: 10 } },
                2: { comp2: { value: 20 } },
            };
            const components = {
                comp1: { schema: {} },
                comp2: { schema: {} },
            };

            (convertValues as any).mockReturnValue({ value: "converted" });

            await setEntities(entities as any, components as any);
        });
    });
});
