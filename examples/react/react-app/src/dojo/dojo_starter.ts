// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.
import { Account } from "starknet";
import {
    Clause,
    ComparisonOperator,
    ValueType,
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

function valueToToriiValueAndOperator(value: any): {
    operator: ComparisonOperator;
    value: {
        primitive_type: { Felt252: "" };
        value_type: ValueType;
    };
} {
    if (typeof value === "object") {
        const key = Object.keys(value)[0];
        const operator = filterMapping[key as keyof NumberFilter];
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

function convertQueryToToriiClause<T extends (keyof ModelsMap)[]>(
    queries: QueryParameter<T>
): Clause | null {
    // Only supports a single model for now, since torii doesn't support multiple models
    const query = queries[0];

    if (!query.query) {
        return null;
    }

    const clauses = Object.entries(query.query).map(([key, value]) => {
        return {
            Member: {
                model: query.model,
                member: key,
                ...valueToToriiValueAndOperator(value),
            },
        } satisfies Clause;
    });
    return {
        Composite: {
            model: query.model,
            operator: "And",
            clauses,
        },
    };
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
    last_direction: (typeof Direction)[keyof typeof Direction];
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
    account: Account;

    constructor(contractAddress: string, account: Account) {
        this.account = account;
        this.contractAddress = contractAddress;
    }

    async execute(entrypoint: string, calldata: any[] = []): Promise<void> {
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
    constructor(contractAddress: string, account: Account) {
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
    toriiUrl: string;
    account: Account;
}

type QueryParameter<T extends (keyof ModelsMap)[]> = {
    [K in keyof T]: {
        model: T[K];
        query?: ModelClause<ModelsMap[T[K]]>;
    };
};

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    toriiUrl: string;
    account: Account;
    actions: ActionsCalls;

    constructor(params: InitialParams) {
        this.toriiUrl = params.toriiUrl;
        this.account = params.account;
        this.actions = new ActionsCalls(
            "0x297bde19ca499fd8a39dd9bedbcd881a47f7b8f66c19478ce97d7de89e6112e",
            this.account
        );
    }

    findEntities<T extends (keyof ModelsMap)[]>(queries: QueryParameter<T>) {
        const query = convertQueryToToriiClause(queries);

        console.log(
            "🚀 ~ file: dojo_starter.ts:184 ~ Dojo_Starter ~ findEntities<Textends ~ query:",
            query
        );

        return [] as MapQueryToResult<T>[];
    }

    findEntity<T extends (keyof ModelsMap)[]>(queries: QueryParameter<T>) {
        console.log(queries);

        return [] as MapQueryToResult<T>;
    }
}
