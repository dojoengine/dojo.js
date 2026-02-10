import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { createBatchTestData, testData } from "./test-utils";

// Note: Bun doesn't support module mocking like vitest
// These tests are disabled until we can properly mock modules
// or rewrite them as integration tests

// Declare mock stubs so the skipped test suite compiles without
// "noUndeclaredVariables" lint errors.  These would normally be
// created by a module-mocking system (e.g. vi.mock / jest.mock).
/* eslint-disable @typescript-eslint/no-explicit-any */
const noop = () => {};
const mockSetComponent: any = {
    mockClear: noop,
    mock: { calls: [] as any[] },
    not: { toHaveBeenCalled: noop },
};
const mockGetComponentValue: any = { mockClear: noop, mockReturnValue: noop };
const mockHasComponent: any = { mockClear: noop, mockReturnValue: noop };
const mockRemoveComponent: any = {
    mockClear: noop,
    not: { toHaveBeenCalled: noop },
};
const mockUpdateComponent: any = { mockClear: noop };
const mockConvertValues: any = {
    mockClear: noop,
    mockReturnValue: noop,
    mockImplementation: noop,
};
const setEntities: any = async () => {};

describe.skip("RECS State Implementation (mock-based tests)", () => {
    let mockComponents;

    beforeEach(() => {
        mockSetComponent.mockClear();
        mockGetComponentValue.mockClear();
        mockHasComponent.mockClear();
        mockRemoveComponent.mockClear();
        mockUpdateComponent.mockClear();
        mockConvertValues.mockClear();

        mockComponents = [
            {
                metadata: { namespace: "dojo_starter", name: "Position" },
                schema: {},
            },
            {
                metadata: { namespace: "dojo_starter", name: "Moves" },
                schema: {},
            },
        ];
    });

    describe("Entity Operations", () => {
        it("should set entities from array format", async () => {
            const entities = Object.values(testData);

            await setEntities(entities, mockComponents);

            // Verify mockSetComponent was called for each entity and model
            const expectedCallCount = entities.length * 2; // 2 models per entity
            expect(mockSetComponent).toHaveBeenCalledTimes(expectedCallCount);

            // Verify correct component names were used
            entities.forEach((entity, index) => {
                // Check that mockSetComponent was called with correct entity ID
                const calls = mockSetComponent.mock.calls;
                const entityCalls = calls.filter(
                    (call) => call[1] === entity.entityId
                );
                expect(entityCalls.length).toBeGreaterThan(0);
            });
        });

        it("should set entities from object format", async () => {
            const entitiesObject = testData;

            await setEntities(entitiesObject, mockComponents);

            // Should process all entities
            const entityCount = Object.keys(entitiesObject).length;
            const expectedCallCount = entityCount * 2; // 2 models per entity
            expect(mockSetComponent).toHaveBeenCalledTimes(expectedCallCount);
        });

        it("should handle empty entity array", async () => {
            await setEntities([], mockComponents);

            expect(mockSetComponent).not.toHaveBeenCalled();
            expect(mockRemoveComponent).not.toHaveBeenCalled();
        });

        it("should handle empty entity object", async () => {
            await setEntities({}, mockComponents);

            expect(mockSetComponent).not.toHaveBeenCalled();
            expect(mockRemoveComponent).not.toHaveBeenCalled();
        });

        it("should remove component when value is empty object", async () => {
            const entity = {
                "0x123": {
                    models: {
                        "dojo_starter-Position": {},
                    },
                },
            };

            const components = [
                {
                    metadata: { namespace: "dojo_starter", name: "Position" },
                    schema: {},
                },
            ];

            await setEntities(entity, components);

            expect(mockRemoveComponent).toHaveBeenCalledWith(
                components[0],
                "0x123",
                { skipUpdateStream: false }
            );
            expect(mockSetComponent).not.toHaveBeenCalled();
        });

        it("should update existing component", async () => {
            const entity = Object.values(testData)[0];

            // Mock that component already exists
            mockHasComponent.mockReturnValue(true);
            mockGetComponentValue.mockReturnValue({
                vec: { x: 10, y: 10 },
                player: entity.models.dojo_starter.Position.player,
            });

            await setEntities([entity], mockComponents);

            // Should use updateComponent instead of mockSetComponent
            expect(mockUpdateComponent).toHaveBeenCalled();
        });

        it("should handle entities with partial models", async () => {
            const entityWithOnlyPosition = {
                entityId: "0x999",
                models: {
                    dojo_starter: {
                        Position: {
                            vec: { x: 15, y: 20 },
                            player: "0x123",
                        },
                    },
                },
            };

            await setEntities([entityWithOnlyPosition], mockComponents);

            // Should only set the Position component
            expect(mockSetComponent).toHaveBeenCalledTimes(1);
            const call = mockSetComponent.mock.calls[0];
            expect(call[0].metadata.name).toBe("Position");
        });
    });

    describe("Component Conversion", () => {
        it("should convert values for each component", async () => {
            const entities = createBatchTestData(2);
            const entitiesArray = Object.values(entities);

            await setEntities(entitiesArray, mockComponents);

            // convertValues should be called for each model
            const expectedConvertCalls = entitiesArray.length * 2; // 2 models per entity
            expect(mockConvertValues).toHaveBeenCalledTimes(
                expectedConvertCalls
            );
        });

        it("should handle null or undefined converted values", async () => {
            const entity = Object.values(testData)[0];

            // Mock convertValues to return null
            mockConvertValues.mockReturnValueOnce(null);

            await setEntities([entity], mockComponents);

            // Should skip setting component when conversion returns null
            expect(mockSetComponent).toHaveBeenCalledTimes(1); // Only for the second model
        });

        it("should pass correct schema to convertValues", async () => {
            const entity = Object.values(testData)[0];

            await setEntities([entity], mockComponents);

            // Check that convertValues was called with correct schemas
            const calls = mockConvertValues.mock.calls;
            calls.forEach((call) => {
                expect(call[0]).toBeDefined(); // schema
                expect(call[1]).toBeDefined(); // value
            });
        });
    });

    describe("Error Handling", () => {
        it("should warn when component not found", async () => {
            const consoleSpy = spyOn(console, "warn").mockImplementation(
                () => {}
            );

            const entityWithUnknownModel = {
                entityId: "0x888",
                models: {
                    unknown_namespace: {
                        UnknownModel: { value: 123 },
                    },
                },
            };

            await setEntities([entityWithUnknownModel], mockComponents, true); // logging enabled

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Component"),
                expect.stringContaining("not found")
            );

            consoleSpy.mockRestore();
        });

        it("should handle component setting errors gracefully", async () => {
            const consoleSpy = spyOn(console, "warn").mockImplementation(
                () => {}
            );

            // Mock mockSetComponent to throw error
            mockSetComponent.mockImplementation(() => {
                throw new Error("Component error");
            });

            const entity = Object.values(testData)[0];

            // Should not throw, but log warning
            await expect(
                setEntities([entity], mockComponents)
            ).resolves.not.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Failed to set component"),
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it("should log error for invalid converted values", async () => {
            const consoleSpy = spyOn(console, "error").mockImplementation(
                () => {}
            );

            // Mock convertValues to return undefined
            mockConvertValues.mockReturnValue(undefined);

            const entity = Object.values(testData)[0];

            await setEntities([entity], mockComponents);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    "convertValues returned null or undefined"
                ),
                expect.any(String),
                expect.any(Object)
            );

            consoleSpy.mockRestore();
        });
    });

    describe("Logging", () => {
        it("should log when logging is enabled", async () => {
            const consoleSpy = spyOn(console, "log").mockImplementation(
                () => {}
            );

            const entity = Object.values(testData)[0];

            await setEntities([entity], mockComponents, true); // logging enabled

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Set component"),
                expect.any(String),
                expect.stringContaining(entity.entityId)
            );

            consoleSpy.mockRestore();
        });

        it("should not log when logging is disabled", async () => {
            const consoleSpy = spyOn(console, "log").mockImplementation(
                () => {}
            );

            const entity = Object.values(testData)[0];

            await setEntities([entity], mockComponents, false); // logging disabled

            expect(consoleSpy).not.toHaveBeenCalledWith(
                expect.stringContaining("Set component")
            );

            consoleSpy.mockRestore();
        });
    });

    describe("Batch Operations", () => {
        it("should handle large batch of entities efficiently", async () => {
            const batchData = createBatchTestData(50);
            const entities = Object.values(batchData);

            await setEntities(entities, mockComponents);

            // Should process all entities
            const expectedCallCount = entities.length * 2; // 2 models per entity
            expect(mockSetComponent).toHaveBeenCalledTimes(expectedCallCount);
        });

        it("should maintain entity integrity in batch operations", async () => {
            const batchData = createBatchTestData(10);
            const entities = Object.values(batchData);

            await setEntities(entities, mockComponents);

            // Verify each entity was processed correctly
            entities.forEach((entity) => {
                const entityCalls = mockSetComponent.mock.calls.filter(
                    (call) => call[1] === entity.entityId
                );

                // Should have 2 calls per entity (Position and Moves)
                expect(entityCalls.length).toBe(2);
            });
        });
    });
});
