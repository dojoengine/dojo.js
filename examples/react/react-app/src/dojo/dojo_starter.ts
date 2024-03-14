// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.

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

type ComponentQuery<T> = {
    OR?: ComponentQuery<T>[];
    AND?: ComponentQuery<T>[];
} & Partial<ConvertNumberToFilter<T>>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

type ComponentQueryAtIndex<T extends any[]> = {
    [K in keyof T]: ComponentQuery<T[K]>;
};

//
//
// The base class for the Dojo codebase
//
//

interface InitialParams {
    rpcUrl: string;
    toriiUrl: string;
    account: string;
}

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    rpcUrl: string;
    toriiUrl: string;
    account: string;
    actions: ActionsCalls;

    constructor(params: InitialParams) {
        this.rpcUrl = params.rpcUrl;
        this.toriiUrl = params.toriiUrl;
        this.account = params.account;
        this.actions = new ActionsCalls(this.account);
    }

    findEntities<T extends object[]>(
        components: ComponentQueryAtIndex<T>,
        limit = 100,
        offset = 0
    ): UnionToIntersection<T[number]>[] {
        // Perform fetching logic here, for now returning an empty array
        return [];
    }

    findEntity<T extends object[]>(
        components: ComponentQueryAtIndex<T>
    ): UnionToIntersection<T[number]> | undefined {
        // Perform fetching logic here, for now returning an empty array
        return {} as UnionToIntersection<T[number]>;
    }
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

//
//
// System calls
//
//

class BaseCallClass {
    account: string;

    constructor(account: string) {
        this.account = account;
    }

    protected callContract(
        contractName: string,
        call: string,
        ...callData: any[]
    ) {
        // Call the contract using the provided action and arguments
    }
}

type MoveArgs = [Direction];

class ActionsCalls extends BaseCallClass {
    spawn() {
        this.callContract("actions", "spawn");
    }

    move(...args: MoveArgs) {
        this.callContract("actions", "move", ...args);
    }
}
