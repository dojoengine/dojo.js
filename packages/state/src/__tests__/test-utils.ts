import testData from "./test_data.json";

// Extract unique data from test_data.json
const playerAddresses = [
    "0x0359b9068eadcaaa449c08b79a367c6fdfba9448c29e96934e3552dab0fdd950",
    "0x02af9427c5a277474c079a1283c880ee8a6f0f8fbf73ce969c08d88befec1bba",
    "0x017cc6ca902ed4e8baa8463a7009ff18cc294fa85a94b4ce6ac30a9ebd6057c7",
    "0x013d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7",
    "0x0127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
];

const entityIds = Object.keys(testData);
const directions = ["Up", "Down", "Left", "Right"];

// Random selection helpers
const getRandomItem = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

const getRandomPlayer = () => getRandomItem(playerAddresses);
const getRandomEntityId = () => getRandomItem(entityIds);
const getRandomDirection = () => getRandomItem(directions);

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * 50) + 9,
    y: Math.floor(Math.random() * 26) + 9,
});

// Updated model creators
export function createPositionModel() {
    return {
        vec: getRandomPosition(),
        player: getRandomPlayer(),
    };
}

export function createMovesModel() {
    return {
        remaining: Math.floor(Math.random() * 30) + 70,
        player: getRandomPlayer(),
        last_direction: { Some: getRandomDirection() },
        can_move: Math.random() > 0.2,
    };
}

export function createSingleModel(entityId: string, model: string) {
    const modelsMap = {
        Moves: createMovesModel,
        Position: createPositionModel,
    };

    // @ts-expect-error such implicitness
    const modelValue = modelsMap[model]();
    if (!modelValue) {
        throw new Error(`Failed to create random model ${model}`);
    }

    return {
        [entityId]: {
            entityId,
            models: {
                dojo_starter: {
                    [model]: modelValue,
                },
            },
        },
    };
}

// Helper to create batch test data
export function createBatchTestData(count: number = 5) {
    const entities = {};
    for (let i = 0; i < count; i++) {
        const entityId = getRandomEntityId();
        // @ts-expect-error test use only
        entities[entityId] = {
            entityId,
            models: {
                dojo_starter: {
                    Position: createPositionModel(),
                    Moves: createMovesModel(),
                },
            },
        };
    }
    return entities;
}

// Export test data for direct use
export { testData };
