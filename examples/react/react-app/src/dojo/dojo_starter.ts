// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.
import { Account } from "starknet";
import {
    Clause,
    Client,
    ComparisonOperator,
    ValueType,
    createClient,
} from "@dojoengine/torii-client";

//
//
// Utility types and functions
//
//

interface NumberFilter {
    eq?: number;
    neq?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
}

const filterMapping: Record<keyof NumberFilter, ComparisonOperator> = {
    eq: "Eq",
    neq: "Neq",
    gt: "Gt",
    gte: "Gte",
    lt: "Lt",
    lte: "Lte",
};

type ConvertNumberToFilter<T> = {
    [K in keyof T]: T[K] extends number ? NumberFilter | number : T[K];
};

type ModelClause<T> = {
    OR?: ModelClause<T>[];
    AND?: ModelClause<T>[];
} & Partial<ConvertNumberToFilter<T>>;

function valueToValueType(value: any): ValueType {
    if (typeof value === "number") {
        return { Int: value };
    }
    if (typeof value === "string") {
        return { String: value };
    }
    if (typeof value === "boolean") {
        return { VBool: value };
    }
    if (Array.isArray(value) && value.every((v) => typeof v === "number")) {
        return { Bytes: value };
    }

    throw new Error("Unsupported value type");
}

function valueToToriiValueAndOperator(
    value: NumberFilter | number | bigint | string | boolean
): {
    operator: ComparisonOperator;
    value: {
        primitive_type: { Felt252: "" };
        value_type: ValueType;
    };
} {
    if (typeof value === "object") {
        const key = Object.keys(value)[0] as keyof NumberFilter;
        const operator = filterMapping[key];
        const val = value[key];
        const valueType = valueToValueType(val);
        return {
            operator,
            value: {
                primitive_type: { Felt252: "" },
                value_type: valueType,
            },
        };
    }

    const valueType = valueToValueType(value);
    return {
        operator: "Eq",
        value: {
            primitive_type: { Felt252: "" },
            value_type: valueType,
        },
    };
}

// Only supports a single model for now, since torii doesn't support multiple models
// And inside that single model, there's only support for a single query.
function convertQueryToToriiClause<T extends (keyof ModelsMap)[]>(
    queries: QueryParameter<T>
): Clause | undefined {
    const query = queries[0];

    if (!query.query) {
        return undefined;
    }

    const clauses: Clause[] = Object.entries(query.query).map(
        ([key, value]) => {
            return {
                Member: {
                    model: query.model,
                    member: key,
                    ...valueToToriiValueAndOperator(value),
                },
            } satisfies Clause;
        }
    );

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

type ModelsMap = {
    Moves: MovesModel;
    Position: PositionModel;
};

type MapQueryToResult<T extends (keyof ModelsMap)[]> = {
    [K in keyof T]: ModelsMap[T[K]];
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

interface InitialParams {
    rpcUrl: string;
    toriiUrl: string;
    worldAddress: string;
    account?: Account;
}

type QueryParameter<T extends (keyof ModelsMap)[]> = {
    [K in keyof T]: {
        model: T[K];
        query?: ModelClause<ModelsMap[T[K]]>;
    };
};

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    rpcUrl: string;
    toriiUrl: string;
    toriiPromise: Promise<Client>;
    worldAddress: string;
    private _account?: Account;
    actions: ActionsCalls;

    constructor(params: InitialParams) {
        this.rpcUrl = params.rpcUrl;
        this.toriiUrl = params.toriiUrl;
        this.worldAddress = params.worldAddress;
        this._account = params.account;
        this.actions = new ActionsCalls(
            "0x297bde19ca499fd8a39dd9bedbcd881a47f7b8f66c19478ce97d7de89e6112e",
            this._account
        );

        this.toriiPromise = createClient([], {
            rpcUrl: this.rpcUrl,
            toriiUrl: this.toriiUrl,
            worldAddress: this.worldAddress,
            // hardcoded this for now until true support is added
            relayUrl: "/ip4/127.0.0.1/tcp/9090",
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

    async findEntities<T extends (keyof ModelsMap)[]>(
        queries: QueryParameter<T>,
        limit = 10,
        offset = 0
    ) {
        const torii = await this.toriiPromise;

        const clause = convertQueryToToriiClause(queries);

        const toriiResult = await torii.getEntities({
            limit,
            offset,
            clause,
        });

        const result = Object.values(toriiResult).map((entity: any) => {
            return queries.map(
                (query) => entity[query.model] as ModelsMap[typeof query.model]
            );
        });

        return result as MapQueryToResult<T>[];
    }

    async findEntity<T extends (keyof ModelsMap)[]>(
        queries: QueryParameter<T>
    ) {
        const torii = await this.toriiPromise;

        const clause = convertQueryToToriiClause(queries);

        const toriiResult = await torii.getEntities({
            limit: 1,
            offset: 0,
            clause,
        });

        const result = Object.values(toriiResult).map((entity: any) => {
            return queries.map(
                (query) => entity[query.model] as ModelsMap[typeof query.model]
            );
        });

        if (result.length === 0) {
            return undefined;
        }

        return result[0] as MapQueryToResult<T>;
    }
}
