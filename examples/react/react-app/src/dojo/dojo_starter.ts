// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.
import { DojoProvider } from "@dojoengine/core";
import {
    Account,
    CairoCustomEnum,
    Contract,
    RpcProvider,
    TypedContractV2,
} from "starknet";
import manifest from "./manifest";

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

type Query<T extends string, U extends object> = {
    model: T;
    query?: ModelClause<U>;
};

//
//
// The base class for the Dojo codebase
//
//

interface InitialParams {
    rpcUrl: string;
    toriiUrl: string;
    account: Account;
}

const actionsAbi = manifest.contracts[0].abi;

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    public provider: RpcProvider;
    rpcUrl: string;
    toriiUrl: string;
    account: Account;
    actions: TypedContractV2<typeof actionsAbi>;

    constructor(params: InitialParams) {
        this.rpcUrl = params.rpcUrl;
        this.toriiUrl = params.toriiUrl;
        this.account = params.account;

        const untypedActionsContract = new Contract(
            actionsAbi,
            "0x0",
            this.account
        );
        this.actions = untypedActionsContract.typedv2(actionsAbi);

        this.provider = new RpcProvider({ nodeUrl: this.rpcUrl });
    }

    findEntities<T extends readonly ModelQuery[]>(
        queries: T
    ): MapQueryToResult<T>[] {
        console.log(queries);

        return [] as MapQueryToResult<T>[];
    }

    findEntity<T extends readonly ModelQuery[]>(
        queries: T
    ): MapQueryToResult<T> {
        console.log(queries);

        return [] as MapQueryToResult<T>;
    }
}

//
//
// Entity types generated from the models
//
//

export const Direction = {
    None: new CairoCustomEnum({ None: {} }),
    Left: new CairoCustomEnum({ Left: {} }),
    Right: new CairoCustomEnum({ Right: {} }),
    Up: new CairoCustomEnum({ Up: {} }),
    Down: new CairoCustomEnum({ Down: {} }),
};

// Type definition for `dojo_starter::models::moves::Moves` model
export interface MovesModel {
    player: string;
    remaining: number;
    last_direction: (typeof Direction)[keyof typeof Direction];
}

type MovesQuery = Query<"Moves", MovesModel>;

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

type PositionQuery = Query<"Position", PositionModel>;

type ModelQuery = MovesQuery | PositionQuery;

type QueryToModel<T> = T extends MovesQuery
    ? MovesModel
    : T extends PositionQuery
      ? PositionModel
      : never;

type MapQueryToResult<T extends readonly ModelQuery[]> = {
    [K in keyof T]: QueryToModel<T[K]>;
};
