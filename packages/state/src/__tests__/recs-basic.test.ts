import { describe, it, expect } from "bun:test";
import { testData, createBatchTestData } from "./test-utils";

describe("RECS State Basic Tests", () => {
    describe("Test Data Generation", () => {
        it("should generate random position models", () => {
            const batchData = createBatchTestData(10);
            const entities = Object.values(batchData);

            entities.forEach((entity) => {
                expect(entity).toHaveProperty("entityId");
                expect(entity).toHaveProperty("models");
                expect(entity.models.dojo_starter).toHaveProperty("Position");
                expect(entity.models.dojo_starter).toHaveProperty("Moves");

                const position = entity.models.dojo_starter.Position;
                expect(position).toHaveProperty("vec");
                expect(position).toHaveProperty("player");
                expect(position.vec.x).toBeGreaterThanOrEqual(9);
                expect(position.vec.x).toBeLessThanOrEqual(59);
                expect(position.vec.y).toBeGreaterThanOrEqual(9);
                expect(position.vec.y).toBeLessThanOrEqual(34);
            });
        });

        it("should generate random moves models", () => {
            const batchData = createBatchTestData(10);
            const entities = Object.values(batchData);

            entities.forEach((entity) => {
                const moves = entity.models.dojo_starter.Moves;
                expect(moves).toHaveProperty("remaining");
                expect(moves).toHaveProperty("player");
                expect(moves).toHaveProperty("last_direction");
                expect(moves).toHaveProperty("can_move");

                expect(moves.remaining).toBeGreaterThanOrEqual(70);
                expect(moves.remaining).toBeLessThanOrEqual(99);
                expect(["Up", "Down", "Left", "Right"]).toContain(
                    moves.last_direction.Some
                );
                expect(typeof moves.can_move).toBe("boolean");
            });
        });

        it("should use valid player addresses", () => {
            const validPlayers = [
                "0x0359b9068eadcaaa449c08b79a367c6fdfba9448c29e96934e3552dab0fdd950",
                "0x02af9427c5a277474c079a1283c880ee8a6f0f8fbf73ce969c08d88befec1bba",
                "0x017cc6ca902ed4e8baa8463a7009ff18cc294fa85a94b4ce6ac30a9ebd6057c7",
                "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
                "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
            ];

            const batchData = createBatchTestData(20);
            const entities = Object.values(batchData);

            entities.forEach((entity) => {
                expect(validPlayers).toContain(
                    entity.models.dojo_starter.Position.player
                );
                expect(validPlayers).toContain(
                    entity.models.dojo_starter.Moves.player
                );
            });
        });

        it("should use valid entity IDs from test data", () => {
            const validEntityIds = Object.keys(testData);
            const batchData = createBatchTestData(10);
            const entities = Object.values(batchData);

            entities.forEach((entity) => {
                expect(validEntityIds).toContain(entity.entityId);
            });
        });
    });

    describe("Test Data Consistency", () => {
        it("should maintain structure from test_data.json", () => {
            const entities = Object.values(testData);

            entities.forEach((entity) => {
                expect(entity).toHaveProperty("entityId");
                expect(entity).toHaveProperty("models");
                expect(entity.models).toHaveProperty("dojo_starter");

                const models = entity.models.dojo_starter;

                // Check Position model structure
                expect(models.Position).toHaveProperty("vec");
                expect(models.Position).toHaveProperty("player");
                expect(models.Position.vec).toHaveProperty("x");
                expect(models.Position.vec).toHaveProperty("y");

                // Check Moves model structure
                expect(models.Moves).toHaveProperty("remaining");
                expect(models.Moves).toHaveProperty("player");
                expect(models.Moves).toHaveProperty("last_direction");
                expect(models.Moves).toHaveProperty("can_move");
                expect(models.Moves.last_direction).toHaveProperty("Some");
            });
        });

        it("should generate different random data each time", () => {
            const batch1 = createBatchTestData(5);
            const batch2 = createBatchTestData(5);

            const entities1 = Object.values(batch1);
            const entities2 = Object.values(batch2);

            // At least some values should be different
            let hasDifference = false;

            for (
                let i = 0;
                i < Math.min(entities1.length, entities2.length);
                i++
            ) {
                const pos1 = entities1[i].models.dojo_starter.Position.vec;
                const pos2 = entities2[i].models.dojo_starter.Position.vec;

                if (pos1.x !== pos2.x || pos1.y !== pos2.y) {
                    hasDifference = true;
                    break;
                }

                const moves1 = entities1[i].models.dojo_starter.Moves;
                const moves2 = entities2[i].models.dojo_starter.Moves;

                if (moves1.remaining !== moves2.remaining) {
                    hasDifference = true;
                    break;
                }
            }

            expect(hasDifference).toBe(true);
        });
    });
});
