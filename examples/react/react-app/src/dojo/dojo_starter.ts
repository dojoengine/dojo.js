// This is an example of a generated TS file that exposes the types and methods for the Dojo starter contract.
// Currently hard-coded to serve as a reference.

// Utility type to extract common properties from a list of objects
// This is used for the parameters of the `findEntities` method
type CommonProps<T extends object[]> = T extends [infer First, ...infer Rest]
    ? Partial<
          {
              [K in keyof First &
                  keyof Rest[number]]: First[K] extends Rest[number][K]
                  ? { [P in K]: First[K] }
                  : never;
          }[keyof First & keyof Rest[number]]
      >
    : never;

//
//
// The base class for the Dojo codebase
//
//

interface InitialParams {
    rpcUrl: string;
    toriiUrl: string;
}

// Auto-generated name from the Scarb.toml
export class Dojo_Starter {
    rpcUrl: string;
    toriiUrl: string;
    moves: MovesQueries;
    position: PositionQueries;
    actions: ActionsCalls;

    constructor(params: InitialParams) {
        this.rpcUrl = params.rpcUrl;
        this.toriiUrl = params.toriiUrl;
        this.moves = new MovesQueries();
        this.position = new PositionQueries();
        this.actions = new ActionsCalls();
    }

    findEntities<T extends object[]>(query: CommonProps<T>): T[number][] {
        // Construct the return type dynamically based on the generic type parameter T
        const test: T[number][] = [];

        return test;
    }
}

//
//
// Entity types generated from the models
//
//

interface BaseEntity {
    __modelName: string;
}

class BaseModelQueries<T extends object> {
    find(query: Partial<T>): T {
        // fetch the entity
        return {} as T;
    }

    findMany(query: Partial<T>): T[] {
        // fetch the entities
        return [];
    }
}

export enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

// Type definition for `dojo_starter::models::moves::Moves` model
export interface MovesEntity extends BaseEntity {
    __modelName: "moves";
    player: string;
    remaining: number;
    last_direction: Direction;
}

export const isMovesEntity = (entity: BaseEntity): entity is MovesEntity =>
    entity.__modelName === "moves";

class MovesQueries extends BaseModelQueries<MovesEntity> {}

// Type definition for `dojo_starter::models::position::Vec2` struct
export interface Vec2 {
    x: number;
    y: number;
}

// Type definition for `dojo_starter::models::position::Position` model
export interface PositionEntity extends BaseEntity {
    __modelName: "position";
    player: string;
    vec: Vec2;
}

export const isPositionEntity = (
    entity: BaseEntity
): entity is PositionEntity => entity.__modelName === "position";

class PositionQueries extends BaseModelQueries<PositionEntity> {}

//
//
// System calls
//
//

interface AccountDetails {
    account: string;
}

interface CallParams extends AccountDetails {
    account: string;
    contractName: string;
    call: string;
    callData?: any[];
}

class BaseCallClass {
    protected callContract(params: CallParams) {
        // Call the contract using the provided action and arguments
    }
}

class ActionsCalls extends BaseCallClass {
    spawn(params: AccountDetails) {
        this.callContract({
            ...params,
            contractName: "actions",
            call: "spawn",
        });
    }

    move(params: AccountDetails & { args: [Direction] }) {
        this.callContract({
            ...params,
            contractName: "actions",
            call: "move",
            callData: params.args,
        });
    }
}
