// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.
import { Account } from "starknet";

//
//
// Utility types
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

type ConvertNumberToFilter<T> = {
    [K in keyof T]: T[K] extends number ? NumberFilter | number : T[K];
};

type ModelClause<T> = {
    OR?: ModelClause<T>[];
    AND?: ModelClause<T>[];
} & Partial<ConvertNumberToFilter<T>>;

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

    findEntities<T extends (keyof ModelsMap)[]>(queries: {
        [K in keyof T]: {
            model: T[K];
            query?: ModelClause<ModelsMap[T[K]]>;
        };
    }) {
        console.log(queries);

        return [] as MapQueryToResult<T>[];
    }

    findEntity<T extends (keyof ModelsMap)[]>(queries: {
        [K in keyof T]: {
            model: T[K];
            query?: ModelClause<ModelsMap[T[K]]>;
        };
    }) {
        console.log(queries);

        return [] as MapQueryToResult<T>;
    }
}
