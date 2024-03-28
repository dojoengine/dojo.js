// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
import { Account } from "starknet";
import {
    Clause,
    Client,
    ModelClause,
    createClient,
    extractQueryFromResult,
    valueToToriiValueAndOperator,
} from "@dojoengine/torii-client";
import { LOCAL_KATANA, createManifestFromJson } from "@dojoengine/core";

//
//
// Utility types and functions
//
//

// Only supports a single model for now, since torii doesn't support multiple models
// And inside that single model, there's only support for a single query.
function convertQueryToToriiClause(query: Query): Clause | undefined {
    const [model, clause] = Object.entries(query)[0];

    if (Object.keys(clause).length === 0) {
        return undefined;
    }

    const clauses: Clause[] = Object.entries(clause).map(([key, value]) => {
        return {
            Member: {
                model: nameMap[model as keyof typeof nameMap],
                member: key,
                ...valueToToriiValueAndOperator(value),
            },
        } satisfies Clause;
    });

    return clauses[0];
}

//
//
// Entity types generated from the models
//
//

export enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

// Type definition for `dojo_starter::models::moves::Moves` model
export interface MovesModel {
    player: string;
    remaining: number;
    last_direction: Direction;
}

// Type definition for `dojo_starter::models::position::Vec2` struct
export interface Vec2 {
    x: number;
    y: number;
}

// Type definition for `dojo_starter::models::position::Position` model
export interface PositionModel {
    player: string;
    vec: Vec2;
}

type Query = Partial<{
    moves: ModelClause<MovesModel>;
    position: ModelClause<PositionModel>;
}>;

type ResultMapping = {
    moves: MovesModel;
    position: PositionModel;
};

const nameMap = {
    moves: "Moves",
    position: "Position",
};

type QueryResult<T extends Query> = {
    [K in keyof T]: K extends keyof ResultMapping ? ResultMapping[K] : never;
};

//
//
// Contract calls
//
//

class BaseCalls {
    contractAddress: string;
    account?: Account;

    constructor(contractAddress: string, account?: Account) {
        this.account = account;
        this.contractAddress = contractAddress;
    }

    async execute(entrypoint: string, calldata: any[] = []): Promise<void> {
        if (!this.account) {
            throw new Error("No account set to interact with dojo_starter");
        }

        await this.account.execute(
            {
                contractAddress: this.contractAddress,
                entrypoint,
                calldata,
            },
            undefined,
            {
                maxFee: 0,
            }
        );
    }
}

class ActionsCalls extends BaseCalls {
    constructor(contractAddress: string, account?: Account) {
        super(contractAddress, account);
    }

    async spawn(): Promise<void> {
        await this.execute("spawn");
    }

    async move(direction: Direction): Promise<void> {
        await this.execute("move", [direction]);
    }
}

//
//
// The base class for the Dojo codebase, tying everything together
//
//

type GeneralParams = {
    toriiUrl: string;
    relayUrl: string;
    account?: Account;
};

type InitialParams = GeneralParams &
    (
        | {
              rpcUrl: string;
              worldAddress: string;
          }
        | {
              manifest: any;
          }
    );

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    rpcUrl: string;
    toriiUrl: string;
    toriiPromise: Promise<Client>;
    relayUrl: string;
    worldAddress: string;
    private _account?: Account;
    actions: ActionsCalls;

    constructor(params: InitialParams) {
        this.rpcUrl = LOCAL_KATANA;
        if ("manifest" in params) {
            const config = createManifestFromJson(params.manifest);
            this.worldAddress = config.world.address;
        } else {
            this.rpcUrl = params.rpcUrl;
            this.worldAddress = params.worldAddress;
        }
        this.toriiUrl = params.toriiUrl;
        this.relayUrl = params.relayUrl;
        this._account = params.account;
        this.actions = new ActionsCalls(
            "0x297bde19ca499fd8a39dd9bedbcd881a47f7b8f66c19478ce97d7de89e6112e",
            this._account
        );

        this.toriiPromise = createClient([], {
            rpcUrl: this.rpcUrl,
            toriiUrl: this.toriiUrl,
            worldAddress: this.worldAddress,
            relayUrl: this.relayUrl,
        });
    }

    get account(): Account | undefined {
        return this._account;
    }

    set account(account: Account) {
        this._account = account;
        this.actions = new ActionsCalls(
            "0x297bde19ca499fd8a39dd9bedbcd881a47f7b8f66c19478ce97d7de89e6112e",
            this._account
        );
    }

    async findEntities<T extends Query>(query: T, limit = 10, offset = 0) {
        const torii = await this.toriiPromise;

        const clause = convertQueryToToriiClause(query);

        const toriiResult = await torii.getEntities({
            limit,
            offset,
            clause,
        });

        const result = Object.values(toriiResult).map((entity: any) => {
            return extractQueryFromResult<Query>(
                query,
                entity
            ) as QueryResult<T>;
        });

        return result as QueryResult<T>[];
    }

    async findEntity<T extends Query>(query: T) {
        const result = await this.findEntities(query, 1);

        if (result.length === 0) {
            return undefined;
        }

        return result[0] as QueryResult<T>;
    }
}
