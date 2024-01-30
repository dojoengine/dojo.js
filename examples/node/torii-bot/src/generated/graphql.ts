import { GraphQLClient } from "graphql-request";
export type GraphQLClientRequestHeaders =
    | Headers
    | string[][]
    | Record<string, string>;
import { GraphQLError, print } from "graphql";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends " $fragmentName" | "__typename"
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    ContractAddress: { input: any; output: any };
    Cursor: { input: any; output: any };
    DateTime: { input: any; output: any };
    Enum: { input: any; output: any };
    felt252: { input: any; output: any };
    u8: { input: any; output: any };
    u32: { input: any; output: any };
};

export type ModelUnion = Moves | Position;

export type Moves = {
    __typename?: "Moves";
    entity?: Maybe<World__Entity>;
    last_direction?: Maybe<Scalars["Enum"]["output"]>;
    player?: Maybe<Scalars["ContractAddress"]["output"]>;
    remaining?: Maybe<Scalars["u8"]["output"]>;
};

export type MovesConnection = {
    __typename?: "MovesConnection";
    edges?: Maybe<Array<Maybe<MovesEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type MovesEdge = {
    __typename?: "MovesEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<Moves>;
};

export type MovesOrder = {
    direction: OrderDirection;
    field: MovesOrderField;
};

export enum MovesOrderField {
    LastDirection = "LAST_DIRECTION",
    Player = "PLAYER",
    Remaining = "REMAINING",
}

export type MovesWhereInput = {
    last_direction?: InputMaybe<Scalars["Enum"]["input"]>;
    player?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerEQ?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerGT?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerGTE?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerLT?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerLTE?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerNEQ?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    remaining?: InputMaybe<Scalars["u8"]["input"]>;
    remainingEQ?: InputMaybe<Scalars["u8"]["input"]>;
    remainingGT?: InputMaybe<Scalars["u8"]["input"]>;
    remainingGTE?: InputMaybe<Scalars["u8"]["input"]>;
    remainingLT?: InputMaybe<Scalars["u8"]["input"]>;
    remainingLTE?: InputMaybe<Scalars["u8"]["input"]>;
    remainingNEQ?: InputMaybe<Scalars["u8"]["input"]>;
};

export enum OrderDirection {
    Asc = "ASC",
    Desc = "DESC",
}

export type Position = {
    __typename?: "Position";
    entity?: Maybe<World__Entity>;
    player?: Maybe<Scalars["ContractAddress"]["output"]>;
    vec?: Maybe<Position_Vec2>;
};

export type PositionConnection = {
    __typename?: "PositionConnection";
    edges?: Maybe<Array<Maybe<PositionEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type PositionEdge = {
    __typename?: "PositionEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<Position>;
};

export type PositionOrder = {
    direction: OrderDirection;
    field: PositionOrderField;
};

export enum PositionOrderField {
    Player = "PLAYER",
    Vec = "VEC",
}

export type PositionWhereInput = {
    player?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerEQ?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerGT?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerGTE?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerLT?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerLTE?: InputMaybe<Scalars["ContractAddress"]["input"]>;
    playerNEQ?: InputMaybe<Scalars["ContractAddress"]["input"]>;
};

export type Position_Vec2 = {
    __typename?: "Position_Vec2";
    x?: Maybe<Scalars["u32"]["output"]>;
    y?: Maybe<Scalars["u32"]["output"]>;
};

export type World__Content = {
    __typename?: "World__Content";
    coverUri?: Maybe<Scalars["String"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    iconUri?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    socials?: Maybe<Array<Maybe<World__Social>>>;
    website?: Maybe<Scalars["String"]["output"]>;
};

export type World__Entity = {
    __typename?: "World__Entity";
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    eventId?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["ID"]["output"]>;
    keys?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
    models?: Maybe<Array<Maybe<ModelUnion>>>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type World__EntityConnection = {
    __typename?: "World__EntityConnection";
    edges?: Maybe<Array<Maybe<World__EntityEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type World__EntityEdge = {
    __typename?: "World__EntityEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<World__Entity>;
};

export type World__Event = {
    __typename?: "World__Event";
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
    id?: Maybe<Scalars["ID"]["output"]>;
    keys?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
    transactionHash?: Maybe<Scalars["String"]["output"]>;
};

export type World__EventConnection = {
    __typename?: "World__EventConnection";
    edges?: Maybe<Array<Maybe<World__EventEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type World__EventEdge = {
    __typename?: "World__EventEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<World__Event>;
};

export type World__Metadata = {
    __typename?: "World__Metadata";
    content?: Maybe<World__Content>;
    coverImg?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    iconImg?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["ID"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
    uri?: Maybe<Scalars["String"]["output"]>;
    worldAddress: Scalars["String"]["output"];
};

export type World__MetadataConnection = {
    __typename?: "World__MetadataConnection";
    edges?: Maybe<Array<Maybe<World__MetadataEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type World__MetadataEdge = {
    __typename?: "World__MetadataEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<World__Metadata>;
};

export type World__Model = {
    __typename?: "World__Model";
    classHash?: Maybe<Scalars["felt252"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["ID"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    transactionHash?: Maybe<Scalars["felt252"]["output"]>;
};

export type World__ModelConnection = {
    __typename?: "World__ModelConnection";
    edges?: Maybe<Array<Maybe<World__ModelEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type World__ModelEdge = {
    __typename?: "World__ModelEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<World__Model>;
};

export type World__ModelOrder = {
    direction: OrderDirection;
    field: World__ModelOrderField;
};

export enum World__ModelOrderField {
    ClassHash = "CLASS_HASH",
    Name = "NAME",
}

export type World__PageInfo = {
    __typename?: "World__PageInfo";
    endCursor?: Maybe<Scalars["Cursor"]["output"]>;
    hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
    hasPreviousPage?: Maybe<Scalars["Boolean"]["output"]>;
    startCursor?: Maybe<Scalars["Cursor"]["output"]>;
};

export type World__Query = {
    __typename?: "World__Query";
    entities?: Maybe<World__EntityConnection>;
    entity: World__Entity;
    events?: Maybe<World__EventConnection>;
    metadatas?: Maybe<World__MetadataConnection>;
    model: World__Model;
    models?: Maybe<World__ModelConnection>;
    movesModels?: Maybe<MovesConnection>;
    positionModels?: Maybe<PositionConnection>;
    transaction: World__Transaction;
    transactions?: Maybe<World__TransactionConnection>;
};

export type World__QueryEntitiesArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    keys?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type World__QueryEntityArgs = {
    id: Scalars["ID"]["input"];
};

export type World__QueryEventsArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    keys?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type World__QueryMetadatasArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type World__QueryModelArgs = {
    id: Scalars["ID"]["input"];
};

export type World__QueryModelsArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
    order?: InputMaybe<World__ModelOrder>;
};

export type World__QueryMovesModelsArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
    order?: InputMaybe<MovesOrder>;
    where?: InputMaybe<MovesWhereInput>;
};

export type World__QueryPositionModelsArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
    order?: InputMaybe<PositionOrder>;
    where?: InputMaybe<PositionWhereInput>;
};

export type World__QueryTransactionArgs = {
    id: Scalars["ID"]["input"];
};

export type World__QueryTransactionsArgs = {
    after?: InputMaybe<Scalars["Cursor"]["input"]>;
    before?: InputMaybe<Scalars["Cursor"]["input"]>;
    first?: InputMaybe<Scalars["Int"]["input"]>;
    last?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type World__Social = {
    __typename?: "World__Social";
    name?: Maybe<Scalars["String"]["output"]>;
    url?: Maybe<Scalars["String"]["output"]>;
};

export type World__Subscription = {
    __typename?: "World__Subscription";
    entityUpdated: World__Entity;
    eventEmitted: World__Event;
    modelRegistered: World__Model;
};

export type World__SubscriptionEntityUpdatedArgs = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type World__SubscriptionEventEmittedArgs = {
    keys?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type World__SubscriptionModelRegisteredArgs = {
    id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type World__Transaction = {
    __typename?: "World__Transaction";
    calldata?: Maybe<Array<Maybe<Scalars["felt252"]["output"]>>>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["ID"]["output"]>;
    maxFee?: Maybe<Scalars["felt252"]["output"]>;
    nonce?: Maybe<Scalars["felt252"]["output"]>;
    senderAddress?: Maybe<Scalars["felt252"]["output"]>;
    signature?: Maybe<Array<Maybe<Scalars["felt252"]["output"]>>>;
    transactionHash?: Maybe<Scalars["felt252"]["output"]>;
};

export type World__TransactionConnection = {
    __typename?: "World__TransactionConnection";
    edges?: Maybe<Array<Maybe<World__TransactionEdge>>>;
    pageInfo: World__PageInfo;
    totalCount: Scalars["Int"]["output"];
};

export type World__TransactionEdge = {
    __typename?: "World__TransactionEdge";
    cursor?: Maybe<Scalars["Cursor"]["output"]>;
    node?: Maybe<World__Transaction>;
};

export type GetMovesQueryVariables = Exact<{
    player: Scalars["ContractAddress"]["input"];
}>;

export type GetMovesQuery = {
    __typename?: "World__Query";
    movesModels?: {
        __typename?: "MovesConnection";
        edges?: Array<{
            __typename?: "MovesEdge";
            node?: {
                __typename?: "Moves";
                player?: any | null;
                remaining?: any | null;
                last_direction?: any | null;
            } | null;
        } | null> | null;
    } | null;
};

export type GetTransationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTransationsQuery = {
    __typename?: "World__Query";
    transactions?: {
        __typename?: "World__TransactionConnection";
        totalCount: number;
        edges?: Array<{
            __typename?: "World__TransactionEdge";
            node?: {
                __typename?: "World__Transaction";
                id?: string | null;
                transactionHash?: any | null;
                senderAddress?: any | null;
                calldata?: Array<any | null> | null;
            } | null;
        } | null> | null;
    } | null;
};

export const GetMovesDocument = gql`
    query getMoves($player: ContractAddress!) {
        movesModels(where: { player: $player }) {
            edges {
                node {
                    player
                    remaining
                    last_direction
                }
            }
        }
    }
`;
export const GetTransationsDocument = gql`
    query getTransations {
        transactions {
            edges {
                node {
                    id
                    transactionHash
                    senderAddress
                    calldata
                }
            }
            totalCount
        }
    }
`;

export type SdkFunctionWrapper = <T>(
    action: (requestHeaders?: Record<string, string>) => Promise<T>,
    operationName: string,
    operationType?: string,
    variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
    action,
    _operationName,
    _operationType,
    variables
) => action();
const GetMovesDocumentString = print(GetMovesDocument);
const GetTransationsDocumentString = print(GetTransationsDocument);
export function getSdk(
    client: GraphQLClient,
    withWrapper: SdkFunctionWrapper = defaultWrapper
) {
    return {
        getMoves(
            variables: GetMovesQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<{
            data: GetMovesQuery;
            errors?: GraphQLError[];
            extensions?: any;
            headers: Headers;
            status: number;
        }> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.rawRequest<GetMovesQuery>(
                        GetMovesDocumentString,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                "getMoves",
                "query",
                variables
            );
        },
        getTransations(
            variables?: GetTransationsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<{
            data: GetTransationsQuery;
            errors?: GraphQLError[];
            extensions?: any;
            headers: Headers;
            status: number;
        }> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.rawRequest<GetTransationsQuery>(
                        GetTransationsDocumentString,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                "getTransations",
                "query",
                variables
            );
        },
    };
}
export type Sdk = ReturnType<typeof getSdk>;
