import {
    KeysClause,
    ToriiQueryBuilder,
    createWorker,
    init,
    type ParsedEntity,
    getModel,
    HistoricalToriiQueryBuilder,
    StandardizedQueryResult,
} from "@dojoengine/sdk/node";
import { SigningKey } from "@dojoengine/torii-wasm/node";
import { dojoConfig } from "./dojoConfig.ts";
import {
    ModelsMapping,
    type Moves,
    type SchemaType,
} from "./src/typescript/models.gen.ts";
import { addAddressPadding, type BigNumberish } from "starknet";
import { w3cwebsocket } from "websocket";
import { env } from "./env.ts";

// Those lines are require so that websocket works.
// @ts-ignore
global.Websocket = w3cwebsocket;
// @ts-ignore
global.WorkerGlobalScope = global;

const sdk = await init({
    client: {
        toriiUrl: dojoConfig.toriiUrl,
        relayUrl: "/ip4/127.0.0.1/tcp/9092/ws",
        worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {
        name: "node-worker",
        version: "0.0.1",
        chainId: "KATANA",
        revision: "1",
    },

    identity: env.IDENTITY,
    signer: SigningKey.fromSecretScalar(env.SECRET_KEY),
});

type PositionCount = {
    Up: number;
    Down: number;
    Left: number;
    Right: number;
};
const defaultPositionCount = {
    Up: 0,
    Down: 0,
    Left: 0,
    Right: 0,
};

const positionToU8 = (position: string) => {
    const mapping = {
        Up: 0,
        Down: 1,
        Left: 2,
        Right: 3,
    };

    // 10 is used as default value
    return mapping[position] ?? 10;
};
const intoPositionCount = (
    pos: PositionCount
): Array<[BigNumberish, BigNumberish]> => {
    return [
        [positionToU8("Up"), `0x${pos.Up.toString(16)}`],
        [positionToU8("Down"), `0x${pos.Down.toString(16)}`],
        [positionToU8("Left"), `0x${pos.Left.toString(16)}`],
        [positionToU8("Right"), `0x${pos.Right.toString(16)}`],
    ];
};

async function publishOffchainPositionCount(moves: Moves): Promise<void> {
    const model = await sdk.getEntities({
        query: new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    [ModelsMapping.PositionCount],
                    [addAddressPadding(moves.player)]
                ).build()
            )
            .includeHashedKeys(),
    });
    const m = getModel(ModelsMapping.PositionCount, model.getItems());
    if (!m) {
        const data = sdk.generateTypedData(
            ModelsMapping.PositionCount,
            {
                identity: moves.player,
                position: intoPositionCount(positionCount),
            },
            [
                {
                    name: "identity",
                    type: "felt",
                },
                {
                    name: "position",
                    type: "(u8, u128)*",
                },
            ]
        );

        try {
            await sdk.sendMessage(data);
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log(m.position);
    }
}

let positionCount = defaultPositionCount;

function initPositionFromEvent(
    events: StandardizedQueryResult<SchemaType>
): PositionCount {
    const pc = defaultPositionCount;
    for (const e of events) {
        const moved = e.models.dojo_starter.Moved;
        if (!moved) {
            continue;
        }
        pc[moved.direction] += 1;
    }
    return pc;
}

await createWorker(async () => {
    async function onEntityUpdated({ data, error }) {
        if (error) {
            console.error(error);
            return;
        }

        const entity = data.pop();
        if (entity && entity.entityId !== "0x0") {
            // do whatever you need here
            const model = entity.models.dojo_starter;
            if (model?.Moves) {
                await publishOffchainPositionCount(model.Moves);
            }
        }
    }

    const query = new HistoricalToriiQueryBuilder()
        .withClause(
            KeysClause(
                [ModelsMapping.Moved, ModelsMapping.Moves],
                [undefined]
            ).build()
        )
        .includeHashedKeys();

    const events = await sdk.getEventMessages({
        query: query,
    });
    positionCount = initPositionFromEvent(events.getItems());

    const [entities, sub] = await sdk.subscribeEntityQuery({
        query,
        callback: onEntityUpdated,
    });

    console.log("Entities from worker", entities.getItems());
    console.log(positionCount);

    return [sub];
});
