import * as _protobuf_ts_runtime from '@protobuf-ts/runtime';
import { MessageType, PartialMessage, IBinaryReader, BinaryReadOptions, IBinaryWriter, BinaryWriteOptions } from '@protobuf-ts/runtime';
import * as _protobuf_ts_runtime_rpc from '@protobuf-ts/runtime-rpc';
import { ServiceType, RpcOptions, ServerStreamingCall, UnaryCall, ServiceInfo, RpcTransport } from '@protobuf-ts/runtime-rpc';

declare class EnumOption$Type extends MessageType<EnumOption> {
    constructor();
    create(value?: PartialMessage<EnumOption>): EnumOption;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumOption): EnumOption;
    internalBinaryWrite(message: EnumOption, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.EnumOption
 */
interface EnumOption {
    /**
     * @generated from protobuf field: string name = 1
     */
    name: string;
    /**
     * @generated from protobuf field: types.Ty ty = 2
     */
    ty?: Ty;
}
/**
 * @generated MessageType for protobuf message types.EnumOption
 */
declare const EnumOption: EnumOption$Type;
declare class Enum$Type extends MessageType<Enum> {
    constructor();
    create(value?: PartialMessage<Enum>): Enum;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Enum): Enum;
    internalBinaryWrite(message: Enum, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Enum
 */
interface Enum {
    /**
     * @generated from protobuf field: string name = 1
     */
    name: string;
    /**
     * @generated from protobuf field: uint32 option = 2
     */
    option: number;
    /**
     * @generated from protobuf field: repeated types.EnumOption options = 3
     */
    options: EnumOption[];
}
/**
 * @generated MessageType for protobuf message types.Enum
 */
declare const Enum: Enum$Type;
declare class Primitive$Type extends MessageType<Primitive> {
    constructor();
    create(value?: PartialMessage<Primitive>): Primitive;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Primitive): Primitive;
    internalBinaryWrite(message: Primitive, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Primitive
 */
interface Primitive {
    /**
     * @generated from protobuf oneof: primitive_type
     */
    primitiveType: {
        oneofKind: "i8";
        /**
         * @generated from protobuf field: int32 i8 = 1
         */
        i8: number;
    } | {
        oneofKind: "i16";
        /**
         * @generated from protobuf field: int32 i16 = 2
         */
        i16: number;
    } | {
        oneofKind: "i32";
        /**
         * @generated from protobuf field: int32 i32 = 3
         */
        i32: number;
    } | {
        oneofKind: "i64";
        /**
         * @generated from protobuf field: int64 i64 = 4
         */
        i64: bigint;
    } | {
        oneofKind: "i128";
        /**
         * @generated from protobuf field: bytes i128 = 5
         */
        i128: Uint8Array;
    } | {
        oneofKind: "u8";
        /**
         * @generated from protobuf field: uint32 u8 = 6
         */
        u8: number;
    } | {
        oneofKind: "u16";
        /**
         * @generated from protobuf field: uint32 u16 = 7
         */
        u16: number;
    } | {
        oneofKind: "u32";
        /**
         * @generated from protobuf field: uint32 u32 = 8
         */
        u32: number;
    } | {
        oneofKind: "u64";
        /**
         * @generated from protobuf field: uint64 u64 = 9
         */
        u64: bigint;
    } | {
        oneofKind: "u128";
        /**
         * @generated from protobuf field: bytes u128 = 10
         */
        u128: Uint8Array;
    } | {
        oneofKind: "u256";
        /**
         * @generated from protobuf field: bytes u256 = 11
         */
        u256: Uint8Array;
    } | {
        oneofKind: "bool";
        /**
         * @generated from protobuf field: bool bool = 12
         */
        bool: boolean;
    } | {
        oneofKind: "felt252";
        /**
         * @generated from protobuf field: bytes felt252 = 13
         */
        felt252: Uint8Array;
    } | {
        oneofKind: "classHash";
        /**
         * @generated from protobuf field: bytes class_hash = 14
         */
        classHash: Uint8Array;
    } | {
        oneofKind: "contractAddress";
        /**
         * @generated from protobuf field: bytes contract_address = 15
         */
        contractAddress: Uint8Array;
    } | {
        oneofKind: "ethAddress";
        /**
         * @generated from protobuf field: bytes eth_address = 16
         */
        ethAddress: Uint8Array;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated MessageType for protobuf message types.Primitive
 */
declare const Primitive: Primitive$Type;
declare class Struct$Type extends MessageType<Struct> {
    constructor();
    create(value?: PartialMessage<Struct>): Struct;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Struct): Struct;
    internalBinaryWrite(message: Struct, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Struct
 */
interface Struct {
    /**
     * @generated from protobuf field: string name = 1
     */
    name: string;
    /**
     * @generated from protobuf field: repeated types.Member children = 2
     */
    children: Member[];
}
/**
 * @generated MessageType for protobuf message types.Struct
 */
declare const Struct: Struct$Type;
declare class Array$$Type extends MessageType<Array$> {
    constructor();
    create(value?: PartialMessage<Array$>): Array$;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Array$): Array$;
    internalBinaryWrite(message: Array$, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Array
 */
interface Array$ {
    /**
     * @generated from protobuf field: repeated types.Ty children = 1
     */
    children: Ty[];
}
/**
 * @generated MessageType for protobuf message types.Array
 */
declare const Array$: Array$$Type;
declare class Ty$Type extends MessageType<Ty> {
    constructor();
    create(value?: PartialMessage<Ty>): Ty;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Ty): Ty;
    internalBinaryWrite(message: Ty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Ty
 */
interface Ty {
    /**
     * @generated from protobuf oneof: ty_type
     */
    tyType: {
        oneofKind: "primitive";
        /**
         * @generated from protobuf field: types.Primitive primitive = 2
         */
        primitive: Primitive;
    } | {
        oneofKind: "enum";
        /**
         * @generated from protobuf field: types.Enum enum = 3
         */
        enum: Enum;
    } | {
        oneofKind: "struct";
        /**
         * @generated from protobuf field: types.Struct struct = 4
         */
        struct: Struct;
    } | {
        oneofKind: "tuple";
        /**
         * @generated from protobuf field: types.Array tuple = 5
         */
        tuple: Array$;
    } | {
        oneofKind: "array";
        /**
         * @generated from protobuf field: types.Array array = 6
         */
        array: Array$;
    } | {
        oneofKind: "bytearray";
        /**
         * @generated from protobuf field: string bytearray = 7
         */
        bytearray: string;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated MessageType for protobuf message types.Ty
 */
declare const Ty: Ty$Type;
declare class Member$Type extends MessageType<Member> {
    constructor();
    create(value?: PartialMessage<Member>): Member;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Member): Member;
    internalBinaryWrite(message: Member, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Member
 */
interface Member {
    /**
     * @generated from protobuf field: string name = 1
     */
    name: string;
    /**
     * @generated from protobuf field: types.Ty ty = 2
     */
    ty?: Ty;
    /**
     * @generated from protobuf field: bool key = 3
     */
    key: boolean;
}
/**
 * @generated MessageType for protobuf message types.Member
 */
declare const Member: Member$Type;

/**
 * @generated from protobuf enum types.PatternMatching
 */
declare enum PatternMatching {
    /**
     * @generated from protobuf enum value: FixedLen = 0;
     */
    FixedLen = 0,
    /**
     * @generated from protobuf enum value: VariableLen = 1;
     */
    VariableLen = 1
}
/**
 * @generated from protobuf enum types.LogicalOperator
 */
declare enum LogicalOperator {
    /**
     * @generated from protobuf enum value: AND = 0;
     */
    AND = 0,
    /**
     * @generated from protobuf enum value: OR = 1;
     */
    OR = 1
}
/**
 * @generated from protobuf enum types.ComparisonOperator
 */
declare enum ComparisonOperator {
    /**
     * @generated from protobuf enum value: EQ = 0;
     */
    EQ = 0,
    /**
     * @generated from protobuf enum value: NEQ = 1;
     */
    NEQ = 1,
    /**
     * @generated from protobuf enum value: GT = 2;
     */
    GT = 2,
    /**
     * @generated from protobuf enum value: GTE = 3;
     */
    GTE = 3,
    /**
     * @generated from protobuf enum value: LT = 4;
     */
    LT = 4,
    /**
     * @generated from protobuf enum value: LTE = 5;
     */
    LTE = 5,
    /**
     * @generated from protobuf enum value: IN = 6;
     */
    IN = 6,
    /**
     * @generated from protobuf enum value: NOT_IN = 7;
     */
    NOT_IN = 7
}
/**
 * @generated from protobuf enum types.OrderDirection
 */
declare enum OrderDirection {
    /**
     * @generated from protobuf enum value: ASC = 0;
     */
    ASC = 0,
    /**
     * @generated from protobuf enum value: DESC = 1;
     */
    DESC = 1
}
/**
 * @generated from protobuf enum types.PaginationDirection
 */
declare enum PaginationDirection {
    /**
     * @generated from protobuf enum value: FORWARD = 0;
     */
    FORWARD = 0,
    /**
     * @generated from protobuf enum value: BACKWARD = 1;
     */
    BACKWARD = 1
}
/**
 * @generated from protobuf enum types.CallType
 */
declare enum CallType {
    /**
     * @generated from protobuf enum value: EXECUTE = 0;
     */
    EXECUTE = 0,
    /**
     * @generated from protobuf enum value: EXECUTE_FROM_OUTSIDE = 1;
     */
    EXECUTE_FROM_OUTSIDE = 1
}
declare class World$Type extends MessageType<World$1> {
    constructor();
    create(value?: PartialMessage<World$1>): World$1;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: World$1): World$1;
    internalBinaryWrite(message: World$1, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.World
 */
interface World$1 {
    /**
     * The hex-encoded address of the world.
     *
     * @generated from protobuf field: string world_address = 1
     */
    worldAddress: string;
    /**
     * A list of metadata for all registered components in the world.
     *
     * @generated from protobuf field: repeated types.Model models = 2
     */
    models: Model[];
}
/**
 * @generated MessageType for protobuf message types.World
 */
declare const World$1: World$Type;
declare class Model$Type extends MessageType<Model> {
    constructor();
    create(value?: PartialMessage<Model>): Model;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Model): Model;
    internalBinaryWrite(message: Model, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Model
 */
interface Model {
    /**
     * Model selector
     *
     * @generated from protobuf field: bytes selector = 1
     */
    selector: Uint8Array;
    /**
     * Model namespace
     *
     * @generated from protobuf field: string namespace = 2
     */
    namespace: string;
    /**
     * Model name
     *
     * @generated from protobuf field: string name = 3
     */
    name: string;
    /**
     * Model size when it is packed for storage
     *
     * @generated from protobuf field: uint32 packed_size = 4
     */
    packedSize: number;
    /**
     * Model size when it is unpacked
     *
     * @generated from protobuf field: uint32 unpacked_size = 5
     */
    unpackedSize: number;
    /**
     * felt bytes of the class hash of the component
     *
     * @generated from protobuf field: bytes class_hash = 6
     */
    classHash: Uint8Array;
    /**
     * The layout of the component in bytes
     *
     * @generated from protobuf field: bytes layout = 7
     */
    layout: Uint8Array;
    /**
     * The schema of the component serialized in bytes (for simplicity sake)
     *
     * @generated from protobuf field: bytes schema = 8
     */
    schema: Uint8Array;
    /**
     * felt bytes of the contract address of the component
     *
     * @generated from protobuf field: bytes contract_address = 9
     */
    contractAddress: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.Model
 */
declare const Model: Model$Type;
declare class Entity$Type extends MessageType<Entity> {
    constructor();
    create(value?: PartialMessage<Entity>): Entity;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Entity): Entity;
    internalBinaryWrite(message: Entity, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Entity
 */
interface Entity {
    /**
     * The entity's hashed keys
     *
     * @generated from protobuf field: bytes hashed_keys = 1
     */
    hashedKeys: Uint8Array;
    /**
     * Models of the entity
     *
     * @generated from protobuf field: repeated types.Struct models = 2
     */
    models: Struct[];
}
/**
 * @generated MessageType for protobuf message types.Entity
 */
declare const Entity: Entity$Type;
declare class Event$Type extends MessageType<Event> {
    constructor();
    create(value?: PartialMessage<Event>): Event;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Event): Event;
    internalBinaryWrite(message: Event, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Event
 */
interface Event {
    /**
     * The event's keys
     *
     * @generated from protobuf field: repeated bytes keys = 1
     */
    keys: Uint8Array[];
    /**
     * Data of the event
     *
     * @generated from protobuf field: repeated bytes data = 2
     */
    data: Uint8Array[];
    /**
     * event's transaction hash
     *
     * @generated from protobuf field: bytes transaction_hash = 3
     */
    transactionHash: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.Event
 */
declare const Event: Event$Type;
declare class Query$Type extends MessageType<Query> {
    constructor();
    create(value?: PartialMessage<Query>): Query;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Query): Query;
    internalBinaryWrite(message: Query, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Query
 */
interface Query {
    /**
     * @generated from protobuf field: types.Clause clause = 1
     */
    clause?: Clause;
    /**
     * @generated from protobuf field: bool no_hashed_keys = 2
     */
    noHashedKeys: boolean;
    /**
     * @generated from protobuf field: repeated string models = 3
     */
    models: string[];
    /**
     * @generated from protobuf field: types.Pagination pagination = 4
     */
    pagination?: Pagination;
    /**
     * @generated from protobuf field: bool historical = 5
     */
    historical: boolean;
}
/**
 * @generated MessageType for protobuf message types.Query
 */
declare const Query: Query$Type;
declare class EventQuery$Type extends MessageType<EventQuery> {
    constructor();
    create(value?: PartialMessage<EventQuery>): EventQuery;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EventQuery): EventQuery;
    internalBinaryWrite(message: EventQuery, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.EventQuery
 */
interface EventQuery {
    /**
     * @generated from protobuf field: types.KeysClause keys = 1
     */
    keys?: KeysClause;
    /**
     * @generated from protobuf field: types.Pagination pagination = 2
     */
    pagination?: Pagination;
}
/**
 * @generated MessageType for protobuf message types.EventQuery
 */
declare const EventQuery: EventQuery$Type;
declare class Clause$Type extends MessageType<Clause> {
    constructor();
    create(value?: PartialMessage<Clause>): Clause;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Clause): Clause;
    internalBinaryWrite(message: Clause, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Clause
 */
interface Clause {
    /**
     * @generated from protobuf oneof: clause_type
     */
    clauseType: {
        oneofKind: "hashedKeys";
        /**
         * @generated from protobuf field: types.HashedKeysClause hashed_keys = 1
         */
        hashedKeys: HashedKeysClause;
    } | {
        oneofKind: "keys";
        /**
         * @generated from protobuf field: types.KeysClause keys = 2
         */
        keys: KeysClause;
    } | {
        oneofKind: "member";
        /**
         * @generated from protobuf field: types.MemberClause member = 3
         */
        member: MemberClause;
    } | {
        oneofKind: "composite";
        /**
         * @generated from protobuf field: types.CompositeClause composite = 4
         */
        composite: CompositeClause;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated MessageType for protobuf message types.Clause
 */
declare const Clause: Clause$Type;
declare class KeysClause$Type extends MessageType<KeysClause> {
    constructor();
    create(value?: PartialMessage<KeysClause>): KeysClause;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeysClause): KeysClause;
    internalBinaryWrite(message: KeysClause, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.KeysClause
 */
interface KeysClause {
    /**
     * @generated from protobuf field: repeated bytes keys = 2
     */
    keys: Uint8Array[];
    /**
     * @generated from protobuf field: types.PatternMatching pattern_matching = 3
     */
    patternMatching: PatternMatching;
    /**
     * @generated from protobuf field: repeated string models = 4
     */
    models: string[];
}
/**
 * @generated MessageType for protobuf message types.KeysClause
 */
declare const KeysClause: KeysClause$Type;
declare class HashedKeysClause$Type extends MessageType<HashedKeysClause> {
    constructor();
    create(value?: PartialMessage<HashedKeysClause>): HashedKeysClause;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HashedKeysClause): HashedKeysClause;
    internalBinaryWrite(message: HashedKeysClause, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.HashedKeysClause
 */
interface HashedKeysClause {
    /**
     * @generated from protobuf field: repeated bytes hashed_keys = 1
     */
    hashedKeys: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message types.HashedKeysClause
 */
declare const HashedKeysClause: HashedKeysClause$Type;
declare class MemberValue$Type extends MessageType<MemberValue> {
    constructor();
    create(value?: PartialMessage<MemberValue>): MemberValue;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MemberValue): MemberValue;
    internalBinaryWrite(message: MemberValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.MemberValue
 */
interface MemberValue {
    /**
     * @generated from protobuf oneof: value_type
     */
    valueType: {
        oneofKind: "primitive";
        /**
         * @generated from protobuf field: types.Primitive primitive = 1
         */
        primitive: Primitive;
    } | {
        oneofKind: "string";
        /**
         * @generated from protobuf field: string string = 2
         */
        string: string;
    } | {
        oneofKind: "list";
        /**
         * @generated from protobuf field: types.MemberValueList list = 3
         */
        list: MemberValueList;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated MessageType for protobuf message types.MemberValue
 */
declare const MemberValue: MemberValue$Type;
declare class MemberValueList$Type extends MessageType<MemberValueList> {
    constructor();
    create(value?: PartialMessage<MemberValueList>): MemberValueList;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MemberValueList): MemberValueList;
    internalBinaryWrite(message: MemberValueList, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.MemberValueList
 */
interface MemberValueList {
    /**
     * @generated from protobuf field: repeated types.MemberValue values = 1
     */
    values: MemberValue[];
}
/**
 * @generated MessageType for protobuf message types.MemberValueList
 */
declare const MemberValueList: MemberValueList$Type;
declare class MemberClause$Type extends MessageType<MemberClause> {
    constructor();
    create(value?: PartialMessage<MemberClause>): MemberClause;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MemberClause): MemberClause;
    internalBinaryWrite(message: MemberClause, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.MemberClause
 */
interface MemberClause {
    /**
     * @generated from protobuf field: string model = 2
     */
    model: string;
    /**
     * @generated from protobuf field: string member = 3
     */
    member: string;
    /**
     * @generated from protobuf field: types.ComparisonOperator operator = 4
     */
    operator: ComparisonOperator;
    /**
     * @generated from protobuf field: types.MemberValue value = 5
     */
    value?: MemberValue;
}
/**
 * @generated MessageType for protobuf message types.MemberClause
 */
declare const MemberClause: MemberClause$Type;
declare class CompositeClause$Type extends MessageType<CompositeClause> {
    constructor();
    create(value?: PartialMessage<CompositeClause>): CompositeClause;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CompositeClause): CompositeClause;
    internalBinaryWrite(message: CompositeClause, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.CompositeClause
 */
interface CompositeClause {
    /**
     * @generated from protobuf field: types.LogicalOperator operator = 3
     */
    operator: LogicalOperator;
    /**
     * @generated from protobuf field: repeated types.Clause clauses = 4
     */
    clauses: Clause[];
}
/**
 * @generated MessageType for protobuf message types.CompositeClause
 */
declare const CompositeClause: CompositeClause$Type;
declare class Token$Type extends MessageType<Token> {
    constructor();
    create(value?: PartialMessage<Token>): Token;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Token): Token;
    internalBinaryWrite(message: Token, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Token
 */
interface Token {
    /**
     * @generated from protobuf field: optional bytes token_id = 1
     */
    tokenId?: Uint8Array;
    /**
     * @generated from protobuf field: bytes contract_address = 2
     */
    contractAddress: Uint8Array;
    /**
     * @generated from protobuf field: string name = 3
     */
    name: string;
    /**
     * @generated from protobuf field: string symbol = 4
     */
    symbol: string;
    /**
     * @generated from protobuf field: uint32 decimals = 5
     */
    decimals: number;
    /**
     * @generated from protobuf field: bytes metadata = 6
     */
    metadata: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.Token
 */
declare const Token: Token$Type;
declare class TokenCollection$Type extends MessageType<TokenCollection> {
    constructor();
    create(value?: PartialMessage<TokenCollection>): TokenCollection;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenCollection): TokenCollection;
    internalBinaryWrite(message: TokenCollection, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.TokenCollection
 */
interface TokenCollection {
    /**
     * @generated from protobuf field: bytes contract_address = 2
     */
    contractAddress: Uint8Array;
    /**
     * @generated from protobuf field: string name = 3
     */
    name: string;
    /**
     * @generated from protobuf field: string symbol = 4
     */
    symbol: string;
    /**
     * @generated from protobuf field: uint32 decimals = 5
     */
    decimals: number;
    /**
     * @generated from protobuf field: uint32 count = 6
     */
    count: number;
    /**
     * @generated from protobuf field: bytes metadata = 7
     */
    metadata: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.TokenCollection
 */
declare const TokenCollection: TokenCollection$Type;
declare class TokenBalance$Type extends MessageType<TokenBalance> {
    constructor();
    create(value?: PartialMessage<TokenBalance>): TokenBalance;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenBalance): TokenBalance;
    internalBinaryWrite(message: TokenBalance, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.TokenBalance
 */
interface TokenBalance {
    /**
     * @generated from protobuf field: bytes balance = 1
     */
    balance: Uint8Array;
    /**
     * @generated from protobuf field: bytes account_address = 2
     */
    accountAddress: Uint8Array;
    /**
     * @generated from protobuf field: bytes contract_address = 3
     */
    contractAddress: Uint8Array;
    /**
     * @generated from protobuf field: optional bytes token_id = 4
     */
    tokenId?: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.TokenBalance
 */
declare const TokenBalance: TokenBalance$Type;
declare class OrderBy$Type extends MessageType<OrderBy> {
    constructor();
    create(value?: PartialMessage<OrderBy>): OrderBy;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OrderBy): OrderBy;
    internalBinaryWrite(message: OrderBy, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.OrderBy
 */
interface OrderBy {
    /**
     * @generated from protobuf field: string field = 1
     */
    field: string;
    /**
     * @generated from protobuf field: types.OrderDirection direction = 2
     */
    direction: OrderDirection;
}
/**
 * @generated MessageType for protobuf message types.OrderBy
 */
declare const OrderBy: OrderBy$Type;
declare class Controller$Type extends MessageType<Controller> {
    constructor();
    create(value?: PartialMessage<Controller>): Controller;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Controller): Controller;
    internalBinaryWrite(message: Controller, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Controller
 */
interface Controller {
    /**
     * @generated from protobuf field: bytes address = 1
     */
    address: Uint8Array;
    /**
     * @generated from protobuf field: string username = 2
     */
    username: string;
    /**
     * @generated from protobuf field: uint64 deployed_at_timestamp = 3
     */
    deployedAtTimestamp: bigint;
}
/**
 * @generated MessageType for protobuf message types.Controller
 */
declare const Controller: Controller$Type;
declare class Pagination$Type extends MessageType<Pagination> {
    constructor();
    create(value?: PartialMessage<Pagination>): Pagination;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Pagination): Pagination;
    internalBinaryWrite(message: Pagination, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Pagination
 */
interface Pagination {
    /**
     * @generated from protobuf field: string cursor = 1
     */
    cursor: string;
    /**
     * @generated from protobuf field: uint32 limit = 2
     */
    limit: number;
    /**
     * @generated from protobuf field: types.PaginationDirection direction = 3
     */
    direction: PaginationDirection;
    /**
     * @generated from protobuf field: repeated types.OrderBy order_by = 4
     */
    orderBy: OrderBy[];
}
/**
 * @generated MessageType for protobuf message types.Pagination
 */
declare const Pagination: Pagination$Type;
declare class ControllerQuery$Type extends MessageType<ControllerQuery> {
    constructor();
    create(value?: PartialMessage<ControllerQuery>): ControllerQuery;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerQuery): ControllerQuery;
    internalBinaryWrite(message: ControllerQuery, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.ControllerQuery
 */
interface ControllerQuery {
    /**
     * The list of contract addresses to retrieve controllers for
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 1
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of usernames to retrieve controllers for
     *
     * @generated from protobuf field: repeated string usernames = 2
     */
    usernames: string[];
    /**
     * Pagination
     *
     * @generated from protobuf field: types.Pagination pagination = 3
     */
    pagination?: Pagination;
}
/**
 * @generated MessageType for protobuf message types.ControllerQuery
 */
declare const ControllerQuery: ControllerQuery$Type;
declare class TokenQuery$Type extends MessageType<TokenQuery> {
    constructor();
    create(value?: PartialMessage<TokenQuery>): TokenQuery;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenQuery): TokenQuery;
    internalBinaryWrite(message: TokenQuery, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve tokens
 *
 * @generated from protobuf message types.TokenQuery
 */
interface TokenQuery {
    /**
     * The list of contract addresses to retrieve tokens for
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 1
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of token IDs to retrieve tokens for
     *
     * @generated from protobuf field: repeated bytes token_ids = 2
     */
    tokenIds: Uint8Array[];
    /**
     * Pagination
     *
     * @generated from protobuf field: types.Pagination pagination = 3
     */
    pagination?: Pagination;
}
/**
 * @generated MessageType for protobuf message types.TokenQuery
 */
declare const TokenQuery: TokenQuery$Type;
declare class TokenBalanceQuery$Type extends MessageType<TokenBalanceQuery> {
    constructor();
    create(value?: PartialMessage<TokenBalanceQuery>): TokenBalanceQuery;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenBalanceQuery): TokenBalanceQuery;
    internalBinaryWrite(message: TokenBalanceQuery, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve token balances
 *
 * @generated from protobuf message types.TokenBalanceQuery
 */
interface TokenBalanceQuery {
    /**
     * The account addresses to retrieve balances for
     *
     * @generated from protobuf field: repeated bytes account_addresses = 1
     */
    accountAddresses: Uint8Array[];
    /**
     * The list of token contract addresses to retrieve balances for
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 2
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of token IDs to retrieve balances for
     *
     * @generated from protobuf field: repeated bytes token_ids = 3
     */
    tokenIds: Uint8Array[];
    /**
     * Pagination
     *
     * @generated from protobuf field: types.Pagination pagination = 4
     */
    pagination?: Pagination;
}
/**
 * @generated MessageType for protobuf message types.TokenBalanceQuery
 */
declare const TokenBalanceQuery: TokenBalanceQuery$Type;
declare class TransactionCall$Type extends MessageType<TransactionCall> {
    constructor();
    create(value?: PartialMessage<TransactionCall>): TransactionCall;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionCall): TransactionCall;
    internalBinaryWrite(message: TransactionCall, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.TransactionCall
 */
interface TransactionCall {
    /**
     * The contract address being called
     *
     * @generated from protobuf field: bytes contract_address = 1
     */
    contractAddress: Uint8Array;
    /**
     * The function name being called
     *
     * @generated from protobuf field: string entrypoint = 2
     */
    entrypoint: string;
    /**
     * The calldata for the function call
     *
     * @generated from protobuf field: repeated bytes calldata = 3
     */
    calldata: Uint8Array[];
    /**
     * The type of call (EXECUTE, EXECUTE_FROM_OUTSIDE)
     *
     * @generated from protobuf field: types.CallType call_type = 4
     */
    callType: CallType;
    /**
     * The address making the call
     *
     * @generated from protobuf field: bytes caller_address = 5
     */
    callerAddress: Uint8Array;
}
/**
 * @generated MessageType for protobuf message types.TransactionCall
 */
declare const TransactionCall: TransactionCall$Type;
declare class Transaction$Type extends MessageType<Transaction> {
    constructor();
    create(value?: PartialMessage<Transaction>): Transaction;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Transaction): Transaction;
    internalBinaryWrite(message: Transaction, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.Transaction
 */
interface Transaction {
    /**
     * The transaction hash
     *
     * @generated from protobuf field: bytes transaction_hash = 1
     */
    transactionHash: Uint8Array;
    /**
     * The sender address
     *
     * @generated from protobuf field: bytes sender_address = 2
     */
    senderAddress: Uint8Array;
    /**
     * The transaction calldata
     *
     * @generated from protobuf field: repeated bytes calldata = 3
     */
    calldata: Uint8Array[];
    /**
     * The maximum fee for the transaction
     *
     * @generated from protobuf field: bytes max_fee = 4
     */
    maxFee: Uint8Array;
    /**
     * The transaction signature
     *
     * @generated from protobuf field: repeated bytes signature = 5
     */
    signature: Uint8Array[];
    /**
     * The transaction nonce
     *
     * @generated from protobuf field: bytes nonce = 6
     */
    nonce: Uint8Array;
    /**
     * The block number the transaction was included in
     *
     * @generated from protobuf field: uint64 block_number = 7
     */
    blockNumber: bigint;
    /**
     * The transaction type (INVOKE, L1_HANDLER, etc.)
     *
     * @generated from protobuf field: string transaction_type = 8
     */
    transactionType: string;
    /**
     * The timestamp when the transaction was executed
     *
     * @generated from protobuf field: uint64 block_timestamp = 9
     */
    blockTimestamp: bigint;
    /**
     * The parsed calls within the transaction
     *
     * @generated from protobuf field: repeated types.TransactionCall calls = 10
     */
    calls: TransactionCall[];
    /**
     * The unique models associated with this transaction
     *
     * @generated from protobuf field: repeated bytes unique_models = 11
     */
    uniqueModels: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message types.Transaction
 */
declare const Transaction: Transaction$Type;
declare class TransactionFilter$Type extends MessageType<TransactionFilter> {
    constructor();
    create(value?: PartialMessage<TransactionFilter>): TransactionFilter;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionFilter): TransactionFilter;
    internalBinaryWrite(message: TransactionFilter, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.TransactionFilter
 */
interface TransactionFilter {
    /**
     * The list of transaction hashes to retrieve
     *
     * @generated from protobuf field: repeated bytes transaction_hashes = 1
     */
    transactionHashes: Uint8Array[];
    /**
     * The list of caller addresses to filter by
     *
     * @generated from protobuf field: repeated bytes caller_addresses = 2
     */
    callerAddresses: Uint8Array[];
    /**
     * The list of contract addresses to filter by (calls made to these contracts)
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 3
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of entrypoints to filter by
     *
     * @generated from protobuf field: repeated string entrypoints = 4
     */
    entrypoints: string[];
    /**
     * The list of model selectors to filter by
     *
     * @generated from protobuf field: repeated bytes model_selectors = 5
     */
    modelSelectors: Uint8Array[];
    /**
     * The block number range to filter by
     *
     * @generated from protobuf field: optional uint64 from_block = 6
     */
    fromBlock?: bigint;
    /**
     * @generated from protobuf field: optional uint64 to_block = 7
     */
    toBlock?: bigint;
}
/**
 * @generated MessageType for protobuf message types.TransactionFilter
 */
declare const TransactionFilter: TransactionFilter$Type;
declare class TransactionQuery$Type extends MessageType<TransactionQuery> {
    constructor();
    create(value?: PartialMessage<TransactionQuery>): TransactionQuery;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionQuery): TransactionQuery;
    internalBinaryWrite(message: TransactionQuery, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message types.TransactionQuery
 */
interface TransactionQuery {
    /**
     * The filter to apply to the query
     *
     * @generated from protobuf field: types.TransactionFilter filter = 1
     */
    filter?: TransactionFilter;
    /**
     * Pagination
     *
     * @generated from protobuf field: types.Pagination pagination = 2
     */
    pagination?: Pagination;
}
/**
 * @generated MessageType for protobuf message types.TransactionQuery
 */
declare const TransactionQuery: TransactionQuery$Type;

declare class SubscribeTransactionsRequest$Type extends MessageType<SubscribeTransactionsRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeTransactionsRequest>): SubscribeTransactionsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTransactionsRequest): SubscribeTransactionsRequest;
    internalBinaryWrite(message: SubscribeTransactionsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeTransactionsRequest
 */
interface SubscribeTransactionsRequest {
    /**
     * @generated from protobuf field: types.TransactionFilter filter = 1
     */
    filter?: TransactionFilter;
}
/**
 * @generated MessageType for protobuf message world.SubscribeTransactionsRequest
 */
declare const SubscribeTransactionsRequest: SubscribeTransactionsRequest$Type;
declare class SubscribeTransactionsResponse$Type extends MessageType<SubscribeTransactionsResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeTransactionsResponse>): SubscribeTransactionsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTransactionsResponse): SubscribeTransactionsResponse;
    internalBinaryWrite(message: SubscribeTransactionsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeTransactionsResponse
 */
interface SubscribeTransactionsResponse {
    /**
     * @generated from protobuf field: types.Transaction transaction = 1
     */
    transaction?: Transaction;
}
/**
 * @generated MessageType for protobuf message world.SubscribeTransactionsResponse
 */
declare const SubscribeTransactionsResponse: SubscribeTransactionsResponse$Type;
declare class RetrieveControllersRequest$Type extends MessageType<RetrieveControllersRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveControllersRequest>): RetrieveControllersRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveControllersRequest): RetrieveControllersRequest;
    internalBinaryWrite(message: RetrieveControllersRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveControllersRequest
 */
interface RetrieveControllersRequest {
    /**
     * @generated from protobuf field: types.ControllerQuery query = 1
     */
    query?: ControllerQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveControllersRequest
 */
declare const RetrieveControllersRequest: RetrieveControllersRequest$Type;
declare class RetrieveControllersResponse$Type extends MessageType<RetrieveControllersResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveControllersResponse>): RetrieveControllersResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveControllersResponse): RetrieveControllersResponse;
    internalBinaryWrite(message: RetrieveControllersResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveControllersResponse
 */
interface RetrieveControllersResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.Controller controllers = 2
     */
    controllers: Controller[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveControllersResponse
 */
declare const RetrieveControllersResponse: RetrieveControllersResponse$Type;
declare class UpdateTokenBalancesSubscriptionRequest$Type extends MessageType<UpdateTokenBalancesSubscriptionRequest> {
    constructor();
    create(value?: PartialMessage<UpdateTokenBalancesSubscriptionRequest>): UpdateTokenBalancesSubscriptionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateTokenBalancesSubscriptionRequest): UpdateTokenBalancesSubscriptionRequest;
    internalBinaryWrite(message: UpdateTokenBalancesSubscriptionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to update a token balance subscription
 *
 * @generated from protobuf message world.UpdateTokenBalancesSubscriptionRequest
 */
interface UpdateTokenBalancesSubscriptionRequest {
    /**
     * The subscription ID
     *
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * The list of contract addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 2
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of account addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes account_addresses = 3
     */
    accountAddresses: Uint8Array[];
    /**
     * The list of token IDs to subscribe to
     *
     * @generated from protobuf field: repeated bytes token_ids = 4
     */
    tokenIds: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message world.UpdateTokenBalancesSubscriptionRequest
 */
declare const UpdateTokenBalancesSubscriptionRequest: UpdateTokenBalancesSubscriptionRequest$Type;
declare class SubscribeTokenBalancesResponse$Type extends MessageType<SubscribeTokenBalancesResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeTokenBalancesResponse>): SubscribeTokenBalancesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTokenBalancesResponse): SubscribeTokenBalancesResponse;
    internalBinaryWrite(message: SubscribeTokenBalancesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing token balances
 *
 * @generated from protobuf message world.SubscribeTokenBalancesResponse
 */
interface SubscribeTokenBalancesResponse {
    /**
     * The subscription ID
     *
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * The token balance
     *
     * @generated from protobuf field: types.TokenBalance balance = 2
     */
    balance?: TokenBalance;
}
/**
 * @generated MessageType for protobuf message world.SubscribeTokenBalancesResponse
 */
declare const SubscribeTokenBalancesResponse: SubscribeTokenBalancesResponse$Type;
declare class RetrieveTokensRequest$Type extends MessageType<RetrieveTokensRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveTokensRequest>): RetrieveTokensRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokensRequest): RetrieveTokensRequest;
    internalBinaryWrite(message: RetrieveTokensRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve tokens
 *
 * @generated from protobuf message world.RetrieveTokensRequest
 */
interface RetrieveTokensRequest {
    /**
     * @generated from protobuf field: types.TokenQuery query = 1
     */
    query?: TokenQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokensRequest
 */
declare const RetrieveTokensRequest: RetrieveTokensRequest$Type;
declare class SubscribeTokensRequest$Type extends MessageType<SubscribeTokensRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeTokensRequest>): SubscribeTokensRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTokensRequest): SubscribeTokensRequest;
    internalBinaryWrite(message: SubscribeTokensRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to subscribe to token updates
 *
 * @generated from protobuf message world.SubscribeTokensRequest
 */
interface SubscribeTokensRequest {
    /**
     * The list of contract addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 1
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of token IDs to subscribe to
     *
     * @generated from protobuf field: repeated bytes token_ids = 2
     */
    tokenIds: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message world.SubscribeTokensRequest
 */
declare const SubscribeTokensRequest: SubscribeTokensRequest$Type;
declare class RetrieveTokensResponse$Type extends MessageType<RetrieveTokensResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveTokensResponse>): RetrieveTokensResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokensResponse): RetrieveTokensResponse;
    internalBinaryWrite(message: RetrieveTokensResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing tokens
 *
 * @generated from protobuf message world.RetrieveTokensResponse
 */
interface RetrieveTokensResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.Token tokens = 2
     */
    tokens: Token[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokensResponse
 */
declare const RetrieveTokensResponse: RetrieveTokensResponse$Type;
declare class SubscribeTokensResponse$Type extends MessageType<SubscribeTokensResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeTokensResponse>): SubscribeTokensResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTokensResponse): SubscribeTokensResponse;
    internalBinaryWrite(message: SubscribeTokensResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing token updates
 *
 * @generated from protobuf message world.SubscribeTokensResponse
 */
interface SubscribeTokensResponse {
    /**
     * The subscription ID
     *
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * The token
     *
     * @generated from protobuf field: types.Token token = 2
     */
    token?: Token;
}
/**
 * @generated MessageType for protobuf message world.SubscribeTokensResponse
 */
declare const SubscribeTokensResponse: SubscribeTokensResponse$Type;
declare class UpdateTokenSubscriptionRequest$Type extends MessageType<UpdateTokenSubscriptionRequest> {
    constructor();
    create(value?: PartialMessage<UpdateTokenSubscriptionRequest>): UpdateTokenSubscriptionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateTokenSubscriptionRequest): UpdateTokenSubscriptionRequest;
    internalBinaryWrite(message: UpdateTokenSubscriptionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to update a token subscription
 *
 * @generated from protobuf message world.UpdateTokenSubscriptionRequest
 */
interface UpdateTokenSubscriptionRequest {
    /**
     * The subscription ID
     *
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * The list of contract addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 2
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of token IDs to subscribe to
     *
     * @generated from protobuf field: repeated bytes token_ids = 3
     */
    tokenIds: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message world.UpdateTokenSubscriptionRequest
 */
declare const UpdateTokenSubscriptionRequest: UpdateTokenSubscriptionRequest$Type;
declare class RetrieveTokenBalancesRequest$Type extends MessageType<RetrieveTokenBalancesRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveTokenBalancesRequest>): RetrieveTokenBalancesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokenBalancesRequest): RetrieveTokenBalancesRequest;
    internalBinaryWrite(message: RetrieveTokenBalancesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve token balances
 *
 * @generated from protobuf message world.RetrieveTokenBalancesRequest
 */
interface RetrieveTokenBalancesRequest {
    /**
     * @generated from protobuf field: types.TokenBalanceQuery query = 1
     */
    query?: TokenBalanceQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokenBalancesRequest
 */
declare const RetrieveTokenBalancesRequest: RetrieveTokenBalancesRequest$Type;
declare class SubscribeTokenBalancesRequest$Type extends MessageType<SubscribeTokenBalancesRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeTokenBalancesRequest>): SubscribeTokenBalancesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeTokenBalancesRequest): SubscribeTokenBalancesRequest;
    internalBinaryWrite(message: SubscribeTokenBalancesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to subscribe to token balance updates
 *
 * @generated from protobuf message world.SubscribeTokenBalancesRequest
 */
interface SubscribeTokenBalancesRequest {
    /**
     * The account addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes account_addresses = 1
     */
    accountAddresses: Uint8Array[];
    /**
     * The list of token contract addresses to subscribe to
     *
     * @generated from protobuf field: repeated bytes contract_addresses = 2
     */
    contractAddresses: Uint8Array[];
    /**
     * The list of token IDs to subscribe to
     *
     * @generated from protobuf field: repeated bytes token_ids = 3
     */
    tokenIds: Uint8Array[];
}
/**
 * @generated MessageType for protobuf message world.SubscribeTokenBalancesRequest
 */
declare const SubscribeTokenBalancesRequest: SubscribeTokenBalancesRequest$Type;
declare class RetrieveTokenBalancesResponse$Type extends MessageType<RetrieveTokenBalancesResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveTokenBalancesResponse>): RetrieveTokenBalancesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokenBalancesResponse): RetrieveTokenBalancesResponse;
    internalBinaryWrite(message: RetrieveTokenBalancesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing token balances
 *
 * @generated from protobuf message world.RetrieveTokenBalancesResponse
 */
interface RetrieveTokenBalancesResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.TokenBalance balances = 2
     */
    balances: TokenBalance[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokenBalancesResponse
 */
declare const RetrieveTokenBalancesResponse: RetrieveTokenBalancesResponse$Type;
declare class RetrieveTransactionsRequest$Type extends MessageType<RetrieveTransactionsRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveTransactionsRequest>): RetrieveTransactionsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTransactionsRequest): RetrieveTransactionsRequest;
    internalBinaryWrite(message: RetrieveTransactionsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve transactions
 *
 * @generated from protobuf message world.RetrieveTransactionsRequest
 */
interface RetrieveTransactionsRequest {
    /**
     * @generated from protobuf field: types.TransactionQuery query = 1
     */
    query?: TransactionQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveTransactionsRequest
 */
declare const RetrieveTransactionsRequest: RetrieveTransactionsRequest$Type;
declare class RetrieveTransactionsResponse$Type extends MessageType<RetrieveTransactionsResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveTransactionsResponse>): RetrieveTransactionsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTransactionsResponse): RetrieveTransactionsResponse;
    internalBinaryWrite(message: RetrieveTransactionsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing transactions
 *
 * @generated from protobuf message world.RetrieveTransactionsResponse
 */
interface RetrieveTransactionsResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.Transaction transactions = 2
     */
    transactions: Transaction[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveTransactionsResponse
 */
declare const RetrieveTransactionsResponse: RetrieveTransactionsResponse$Type;
declare class RetrieveTokenCollectionsRequest$Type extends MessageType<RetrieveTokenCollectionsRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveTokenCollectionsRequest>): RetrieveTokenCollectionsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokenCollectionsRequest): RetrieveTokenCollectionsRequest;
    internalBinaryWrite(message: RetrieveTokenCollectionsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve token collections
 *
 * @generated from protobuf message world.RetrieveTokenCollectionsRequest
 */
interface RetrieveTokenCollectionsRequest {
    /**
     * @generated from protobuf field: types.TokenBalanceQuery query = 1
     */
    query?: TokenBalanceQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokenCollectionsRequest
 */
declare const RetrieveTokenCollectionsRequest: RetrieveTokenCollectionsRequest$Type;
declare class RetrieveTokenCollectionsResponse$Type extends MessageType<RetrieveTokenCollectionsResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveTokenCollectionsResponse>): RetrieveTokenCollectionsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveTokenCollectionsResponse): RetrieveTokenCollectionsResponse;
    internalBinaryWrite(message: RetrieveTokenCollectionsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing token balances
 *
 * @generated from protobuf message world.RetrieveTokenCollectionsResponse
 */
interface RetrieveTokenCollectionsResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.TokenCollection tokens = 2
     */
    tokens: TokenCollection[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveTokenCollectionsResponse
 */
declare const RetrieveTokenCollectionsResponse: RetrieveTokenCollectionsResponse$Type;
declare class SubscribeIndexerRequest$Type extends MessageType<SubscribeIndexerRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeIndexerRequest>): SubscribeIndexerRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeIndexerRequest): SubscribeIndexerRequest;
    internalBinaryWrite(message: SubscribeIndexerRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to subscribe to indexer updates.
 *
 * @generated from protobuf message world.SubscribeIndexerRequest
 */
interface SubscribeIndexerRequest {
    /**
     * @generated from protobuf field: bytes contract_address = 1
     */
    contractAddress: Uint8Array;
}
/**
 * @generated MessageType for protobuf message world.SubscribeIndexerRequest
 */
declare const SubscribeIndexerRequest: SubscribeIndexerRequest$Type;
declare class SubscribeIndexerResponse$Type extends MessageType<SubscribeIndexerResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeIndexerResponse>): SubscribeIndexerResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeIndexerResponse): SubscribeIndexerResponse;
    internalBinaryWrite(message: SubscribeIndexerResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A response containing indexer updates.
 *
 * @generated from protobuf message world.SubscribeIndexerResponse
 */
interface SubscribeIndexerResponse {
    /**
     * @generated from protobuf field: int64 head = 1
     */
    head: bigint;
    /**
     * @generated from protobuf field: int64 tps = 2
     */
    tps: bigint;
    /**
     * @generated from protobuf field: int64 last_block_timestamp = 3
     */
    lastBlockTimestamp: bigint;
    /**
     * @generated from protobuf field: bytes contract_address = 4
     */
    contractAddress: Uint8Array;
}
/**
 * @generated MessageType for protobuf message world.SubscribeIndexerResponse
 */
declare const SubscribeIndexerResponse: SubscribeIndexerResponse$Type;
declare class WorldMetadataRequest$Type extends MessageType<WorldMetadataRequest> {
    constructor();
    create(value?: PartialMessage<WorldMetadataRequest>): WorldMetadataRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WorldMetadataRequest): WorldMetadataRequest;
    internalBinaryWrite(message: WorldMetadataRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A request to retrieve metadata for a specific world ID.
 *
 * @generated from protobuf message world.WorldMetadataRequest
 */
interface WorldMetadataRequest {
}
/**
 * @generated MessageType for protobuf message world.WorldMetadataRequest
 */
declare const WorldMetadataRequest: WorldMetadataRequest$Type;
declare class WorldMetadataResponse$Type extends MessageType<WorldMetadataResponse> {
    constructor();
    create(value?: PartialMessage<WorldMetadataResponse>): WorldMetadataResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WorldMetadataResponse): WorldMetadataResponse;
    internalBinaryWrite(message: WorldMetadataResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * The metadata response contains addresses and class hashes for the world.
 *
 * @generated from protobuf message world.WorldMetadataResponse
 */
interface WorldMetadataResponse {
    /**
     * @generated from protobuf field: types.World world = 1
     */
    world?: World$1;
}
/**
 * @generated MessageType for protobuf message world.WorldMetadataResponse
 */
declare const WorldMetadataResponse: WorldMetadataResponse$Type;
declare class SubscribeEntitiesRequest$Type extends MessageType<SubscribeEntitiesRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeEntitiesRequest>): SubscribeEntitiesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeEntitiesRequest): SubscribeEntitiesRequest;
    internalBinaryWrite(message: SubscribeEntitiesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeEntitiesRequest
 */
interface SubscribeEntitiesRequest {
    /**
     * @generated from protobuf field: types.Clause clause = 1
     */
    clause?: Clause;
}
/**
 * @generated MessageType for protobuf message world.SubscribeEntitiesRequest
 */
declare const SubscribeEntitiesRequest: SubscribeEntitiesRequest$Type;
declare class SubscribeEventMessagesRequest$Type extends MessageType<SubscribeEventMessagesRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeEventMessagesRequest>): SubscribeEventMessagesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeEventMessagesRequest): SubscribeEventMessagesRequest;
    internalBinaryWrite(message: SubscribeEventMessagesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeEventMessagesRequest
 */
interface SubscribeEventMessagesRequest {
    /**
     * @generated from protobuf field: types.Clause clause = 1
     */
    clause?: Clause;
}
/**
 * @generated MessageType for protobuf message world.SubscribeEventMessagesRequest
 */
declare const SubscribeEventMessagesRequest: SubscribeEventMessagesRequest$Type;
declare class UpdateEntitiesSubscriptionRequest$Type extends MessageType<UpdateEntitiesSubscriptionRequest> {
    constructor();
    create(value?: PartialMessage<UpdateEntitiesSubscriptionRequest>): UpdateEntitiesSubscriptionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateEntitiesSubscriptionRequest): UpdateEntitiesSubscriptionRequest;
    internalBinaryWrite(message: UpdateEntitiesSubscriptionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.UpdateEntitiesSubscriptionRequest
 */
interface UpdateEntitiesSubscriptionRequest {
    /**
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * @generated from protobuf field: types.Clause clause = 2
     */
    clause?: Clause;
}
/**
 * @generated MessageType for protobuf message world.UpdateEntitiesSubscriptionRequest
 */
declare const UpdateEntitiesSubscriptionRequest: UpdateEntitiesSubscriptionRequest$Type;
declare class UpdateEventMessagesSubscriptionRequest$Type extends MessageType<UpdateEventMessagesSubscriptionRequest> {
    constructor();
    create(value?: PartialMessage<UpdateEventMessagesSubscriptionRequest>): UpdateEventMessagesSubscriptionRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateEventMessagesSubscriptionRequest): UpdateEventMessagesSubscriptionRequest;
    internalBinaryWrite(message: UpdateEventMessagesSubscriptionRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.UpdateEventMessagesSubscriptionRequest
 */
interface UpdateEventMessagesSubscriptionRequest {
    /**
     * @generated from protobuf field: uint64 subscription_id = 1
     */
    subscriptionId: bigint;
    /**
     * @generated from protobuf field: types.Clause clause = 2
     */
    clause?: Clause;
}
/**
 * @generated MessageType for protobuf message world.UpdateEventMessagesSubscriptionRequest
 */
declare const UpdateEventMessagesSubscriptionRequest: UpdateEventMessagesSubscriptionRequest$Type;
declare class SubscribeEntityResponse$Type extends MessageType<SubscribeEntityResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeEntityResponse>): SubscribeEntityResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeEntityResponse): SubscribeEntityResponse;
    internalBinaryWrite(message: SubscribeEntityResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeEntityResponse
 */
interface SubscribeEntityResponse {
    /**
     * @generated from protobuf field: types.Entity entity = 1
     */
    entity?: Entity;
    /**
     * @generated from protobuf field: uint64 subscription_id = 2
     */
    subscriptionId: bigint;
}
/**
 * @generated MessageType for protobuf message world.SubscribeEntityResponse
 */
declare const SubscribeEntityResponse: SubscribeEntityResponse$Type;
declare class RetrieveEntitiesRequest$Type extends MessageType<RetrieveEntitiesRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveEntitiesRequest>): RetrieveEntitiesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveEntitiesRequest): RetrieveEntitiesRequest;
    internalBinaryWrite(message: RetrieveEntitiesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveEntitiesRequest
 */
interface RetrieveEntitiesRequest {
    /**
     * The entities to retrieve
     *
     * @generated from protobuf field: types.Query query = 1
     */
    query?: Query;
}
/**
 * @generated MessageType for protobuf message world.RetrieveEntitiesRequest
 */
declare const RetrieveEntitiesRequest: RetrieveEntitiesRequest$Type;
declare class RetrieveEventMessagesRequest$Type extends MessageType<RetrieveEventMessagesRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveEventMessagesRequest>): RetrieveEventMessagesRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveEventMessagesRequest): RetrieveEventMessagesRequest;
    internalBinaryWrite(message: RetrieveEventMessagesRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveEventMessagesRequest
 */
interface RetrieveEventMessagesRequest {
    /**
     * The event messages to retrieve
     *
     * @generated from protobuf field: types.Query query = 1
     */
    query?: Query;
}
/**
 * @generated MessageType for protobuf message world.RetrieveEventMessagesRequest
 */
declare const RetrieveEventMessagesRequest: RetrieveEventMessagesRequest$Type;
declare class RetrieveEntitiesResponse$Type extends MessageType<RetrieveEntitiesResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveEntitiesResponse>): RetrieveEntitiesResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveEntitiesResponse): RetrieveEntitiesResponse;
    internalBinaryWrite(message: RetrieveEntitiesResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveEntitiesResponse
 */
interface RetrieveEntitiesResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.Entity entities = 2
     */
    entities: Entity[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveEntitiesResponse
 */
declare const RetrieveEntitiesResponse: RetrieveEntitiesResponse$Type;
declare class RetrieveEventsRequest$Type extends MessageType<RetrieveEventsRequest> {
    constructor();
    create(value?: PartialMessage<RetrieveEventsRequest>): RetrieveEventsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveEventsRequest): RetrieveEventsRequest;
    internalBinaryWrite(message: RetrieveEventsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveEventsRequest
 */
interface RetrieveEventsRequest {
    /**
     * The events to retrieve
     *
     * @generated from protobuf field: types.EventQuery query = 1
     */
    query?: EventQuery;
}
/**
 * @generated MessageType for protobuf message world.RetrieveEventsRequest
 */
declare const RetrieveEventsRequest: RetrieveEventsRequest$Type;
declare class RetrieveEventsResponse$Type extends MessageType<RetrieveEventsResponse> {
    constructor();
    create(value?: PartialMessage<RetrieveEventsResponse>): RetrieveEventsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetrieveEventsResponse): RetrieveEventsResponse;
    internalBinaryWrite(message: RetrieveEventsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.RetrieveEventsResponse
 */
interface RetrieveEventsResponse {
    /**
     * @generated from protobuf field: string next_cursor = 1
     */
    nextCursor: string;
    /**
     * @generated from protobuf field: repeated types.Event events = 2
     */
    events: Event[];
}
/**
 * @generated MessageType for protobuf message world.RetrieveEventsResponse
 */
declare const RetrieveEventsResponse: RetrieveEventsResponse$Type;
declare class SubscribeEventsRequest$Type extends MessageType<SubscribeEventsRequest> {
    constructor();
    create(value?: PartialMessage<SubscribeEventsRequest>): SubscribeEventsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeEventsRequest): SubscribeEventsRequest;
    internalBinaryWrite(message: SubscribeEventsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeEventsRequest
 */
interface SubscribeEventsRequest {
    /**
     * @generated from protobuf field: repeated types.KeysClause keys = 1
     */
    keys: KeysClause[];
}
/**
 * @generated MessageType for protobuf message world.SubscribeEventsRequest
 */
declare const SubscribeEventsRequest: SubscribeEventsRequest$Type;
declare class SubscribeEventsResponse$Type extends MessageType<SubscribeEventsResponse> {
    constructor();
    create(value?: PartialMessage<SubscribeEventsResponse>): SubscribeEventsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubscribeEventsResponse): SubscribeEventsResponse;
    internalBinaryWrite(message: SubscribeEventsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.SubscribeEventsResponse
 */
interface SubscribeEventsResponse {
    /**
     * @generated from protobuf field: types.Event event = 1
     */
    event?: Event;
}
/**
 * @generated MessageType for protobuf message world.SubscribeEventsResponse
 */
declare const SubscribeEventsResponse: SubscribeEventsResponse$Type;
declare class PublishMessageRequest$Type extends MessageType<PublishMessageRequest> {
    constructor();
    create(value?: PartialMessage<PublishMessageRequest>): PublishMessageRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PublishMessageRequest): PublishMessageRequest;
    internalBinaryWrite(message: PublishMessageRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.PublishMessageRequest
 */
interface PublishMessageRequest {
    /**
     * @generated from protobuf field: repeated bytes signature = 1
     */
    signature: Uint8Array[];
    /**
     * @generated from protobuf field: string message = 2
     */
    message: string;
}
/**
 * @generated MessageType for protobuf message world.PublishMessageRequest
 */
declare const PublishMessageRequest: PublishMessageRequest$Type;
declare class PublishMessageResponse$Type extends MessageType<PublishMessageResponse> {
    constructor();
    create(value?: PartialMessage<PublishMessageResponse>): PublishMessageResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PublishMessageResponse): PublishMessageResponse;
    internalBinaryWrite(message: PublishMessageResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.PublishMessageResponse
 */
interface PublishMessageResponse {
    /**
     * @generated from protobuf field: bytes entity_id = 1
     */
    entityId: Uint8Array;
}
/**
 * @generated MessageType for protobuf message world.PublishMessageResponse
 */
declare const PublishMessageResponse: PublishMessageResponse$Type;
declare class PublishMessageBatchRequest$Type extends MessageType<PublishMessageBatchRequest> {
    constructor();
    create(value?: PartialMessage<PublishMessageBatchRequest>): PublishMessageBatchRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PublishMessageBatchRequest): PublishMessageBatchRequest;
    internalBinaryWrite(message: PublishMessageBatchRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.PublishMessageBatchRequest
 */
interface PublishMessageBatchRequest {
    /**
     * @generated from protobuf field: repeated world.PublishMessageRequest messages = 1
     */
    messages: PublishMessageRequest[];
}
/**
 * @generated MessageType for protobuf message world.PublishMessageBatchRequest
 */
declare const PublishMessageBatchRequest: PublishMessageBatchRequest$Type;
declare class PublishMessageBatchResponse$Type extends MessageType<PublishMessageBatchResponse> {
    constructor();
    create(value?: PartialMessage<PublishMessageBatchResponse>): PublishMessageBatchResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PublishMessageBatchResponse): PublishMessageBatchResponse;
    internalBinaryWrite(message: PublishMessageBatchResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated from protobuf message world.PublishMessageBatchResponse
 */
interface PublishMessageBatchResponse {
    /**
     * @generated from protobuf field: repeated world.PublishMessageResponse responses = 1
     */
    responses: PublishMessageResponse[];
}
/**
 * @generated MessageType for protobuf message world.PublishMessageBatchResponse
 */
declare const PublishMessageBatchResponse: PublishMessageBatchResponse$Type;
/**
 * @generated ServiceType for protobuf service world.World
 */
declare const World: ServiceType;

declare class Empty$Type extends MessageType<Empty> {
    constructor();
    create(value?: PartialMessage<Empty>): Empty;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Empty): Empty;
    internalBinaryWrite(message: Empty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * A generic empty message that you can re-use to avoid defining duplicated
 * empty messages in your APIs. A typical example is to use it as the request
 * or the response type of an API method. For instance:
 *
 *     service Foo {
 *       rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty);
 *     }
 *
 *
 * @generated from protobuf message google.protobuf.Empty
 */
interface Empty {
}
/**
 * @generated MessageType for protobuf message google.protobuf.Empty
 */
declare const Empty: Empty$Type;

/**
 * The World service provides information about the world.
 *
 * @generated from protobuf service world.World
 */
interface IWorldClient {
    /**
     * Subscribes to updates about the indexer. Like the head block number, tps, etc.
     *
     * @generated from protobuf rpc: SubscribeIndexer
     */
    subscribeIndexer(input: SubscribeIndexerRequest, options?: RpcOptions): ServerStreamingCall<SubscribeIndexerRequest, SubscribeIndexerResponse>;
    /**
     * Retrieves metadata about the World including all the registered components and systems.
     *
     * @generated from protobuf rpc: WorldMetadata
     */
    worldMetadata(input: WorldMetadataRequest, options?: RpcOptions): UnaryCall<WorldMetadataRequest, WorldMetadataResponse>;
    /**
     * Subscribe to entity updates.
     *
     * @generated from protobuf rpc: SubscribeEntities
     */
    subscribeEntities(input: SubscribeEntitiesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEntitiesRequest, SubscribeEntityResponse>;
    /**
     * Update entity subscription
     *
     * @generated from protobuf rpc: UpdateEntitiesSubscription
     */
    updateEntitiesSubscription(input: UpdateEntitiesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateEntitiesSubscriptionRequest, Empty>;
    /**
     * Retrieve entities
     *
     * @generated from protobuf rpc: RetrieveEntities
     */
    retrieveEntities(input: RetrieveEntitiesRequest, options?: RpcOptions): UnaryCall<RetrieveEntitiesRequest, RetrieveEntitiesResponse>;
    /**
     * Subscribe to entity updates.
     *
     * @generated from protobuf rpc: SubscribeEventMessages
     */
    subscribeEventMessages(input: SubscribeEventMessagesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEventMessagesRequest, SubscribeEntityResponse>;
    /**
     * Update entity subscription
     *
     * @generated from protobuf rpc: UpdateEventMessagesSubscription
     */
    updateEventMessagesSubscription(input: UpdateEventMessagesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateEventMessagesSubscriptionRequest, Empty>;
    /**
     * Subscribe to token balance updates.
     *
     * @generated from protobuf rpc: SubscribeTokenBalances
     */
    subscribeTokenBalances(input: SubscribeTokenBalancesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTokenBalancesRequest, SubscribeTokenBalancesResponse>;
    /**
     * Update token balance subscription
     *
     * @generated from protobuf rpc: UpdateTokenBalancesSubscription
     */
    updateTokenBalancesSubscription(input: UpdateTokenBalancesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateTokenBalancesSubscriptionRequest, Empty>;
    /**
     * Subscribe to token updates.
     *
     * @generated from protobuf rpc: SubscribeTokens
     */
    subscribeTokens(input: SubscribeTokensRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTokensRequest, SubscribeTokensResponse>;
    /**
     * Update token subscription
     *
     * @generated from protobuf rpc: UpdateTokensSubscription
     */
    updateTokensSubscription(input: UpdateTokenSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateTokenSubscriptionRequest, Empty>;
    /**
     * Retrieve entities
     *
     * @generated from protobuf rpc: RetrieveEventMessages
     */
    retrieveEventMessages(input: RetrieveEventMessagesRequest, options?: RpcOptions): UnaryCall<RetrieveEventMessagesRequest, RetrieveEntitiesResponse>;
    /**
     * Retrieve events
     *
     * @generated from protobuf rpc: RetrieveEvents
     */
    retrieveEvents(input: RetrieveEventsRequest, options?: RpcOptions): UnaryCall<RetrieveEventsRequest, RetrieveEventsResponse>;
    /**
     * Subscribe to events
     *
     * @generated from protobuf rpc: SubscribeEvents
     */
    subscribeEvents(input: SubscribeEventsRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEventsRequest, SubscribeEventsResponse>;
    /**
     * Retrieve tokens
     *
     * @generated from protobuf rpc: RetrieveTokens
     */
    retrieveTokens(input: RetrieveTokensRequest, options?: RpcOptions): UnaryCall<RetrieveTokensRequest, RetrieveTokensResponse>;
    /**
     * Retrieve token balances
     *
     * @generated from protobuf rpc: RetrieveTokenBalances
     */
    retrieveTokenBalances(input: RetrieveTokenBalancesRequest, options?: RpcOptions): UnaryCall<RetrieveTokenBalancesRequest, RetrieveTokenBalancesResponse>;
    /**
     * Retrieve transactions
     *
     * @generated from protobuf rpc: RetrieveTransactions
     */
    retrieveTransactions(input: RetrieveTransactionsRequest, options?: RpcOptions): UnaryCall<RetrieveTransactionsRequest, RetrieveTransactionsResponse>;
    /**
     * Subscribe to transactions
     *
     * @generated from protobuf rpc: SubscribeTransactions
     */
    subscribeTransactions(input: SubscribeTransactionsRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTransactionsRequest, SubscribeTransactionsResponse>;
    /**
     * Retrieve controllers
     *
     * @generated from protobuf rpc: RetrieveControllers
     */
    retrieveControllers(input: RetrieveControllersRequest, options?: RpcOptions): UnaryCall<RetrieveControllersRequest, RetrieveControllersResponse>;
    /**
     * Retrieve tokens collections
     *
     * @generated from protobuf rpc: RetrieveTokenCollections
     */
    retrieveTokenCollections(input: RetrieveTokenCollectionsRequest, options?: RpcOptions): UnaryCall<RetrieveTokenCollectionsRequest, RetrieveTokenCollectionsResponse>;
    /**
     * Publish a torii offchain message
     *
     * @generated from protobuf rpc: PublishMessage
     */
    publishMessage(input: PublishMessageRequest, options?: RpcOptions): UnaryCall<PublishMessageRequest, PublishMessageResponse>;
    /**
     * Publish a set of torii offchain messages
     *
     * @generated from protobuf rpc: PublishMessageBatch
     */
    publishMessageBatch(input: PublishMessageBatchRequest, options?: RpcOptions): UnaryCall<PublishMessageBatchRequest, PublishMessageBatchResponse>;
}
/**
 * The World service provides information about the world.
 *
 * @generated from protobuf service world.World
 */
declare class WorldClient implements IWorldClient, ServiceInfo {
    private readonly _transport;
    typeName: string;
    methods: _protobuf_ts_runtime_rpc.MethodInfo<any, any>[];
    options: {
        [extensionName: string]: _protobuf_ts_runtime.JsonValue;
    };
    constructor(_transport: RpcTransport);
    /**
     * Subscribes to updates about the indexer. Like the head block number, tps, etc.
     *
     * @generated from protobuf rpc: SubscribeIndexer
     */
    subscribeIndexer(input: SubscribeIndexerRequest, options?: RpcOptions): ServerStreamingCall<SubscribeIndexerRequest, SubscribeIndexerResponse>;
    /**
     * Retrieves metadata about the World including all the registered components and systems.
     *
     * @generated from protobuf rpc: WorldMetadata
     */
    worldMetadata(input: WorldMetadataRequest, options?: RpcOptions): UnaryCall<WorldMetadataRequest, WorldMetadataResponse>;
    /**
     * Subscribe to entity updates.
     *
     * @generated from protobuf rpc: SubscribeEntities
     */
    subscribeEntities(input: SubscribeEntitiesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEntitiesRequest, SubscribeEntityResponse>;
    /**
     * Update entity subscription
     *
     * @generated from protobuf rpc: UpdateEntitiesSubscription
     */
    updateEntitiesSubscription(input: UpdateEntitiesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateEntitiesSubscriptionRequest, Empty>;
    /**
     * Retrieve entities
     *
     * @generated from protobuf rpc: RetrieveEntities
     */
    retrieveEntities(input: RetrieveEntitiesRequest, options?: RpcOptions): UnaryCall<RetrieveEntitiesRequest, RetrieveEntitiesResponse>;
    /**
     * Subscribe to entity updates.
     *
     * @generated from protobuf rpc: SubscribeEventMessages
     */
    subscribeEventMessages(input: SubscribeEventMessagesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEventMessagesRequest, SubscribeEntityResponse>;
    /**
     * Update entity subscription
     *
     * @generated from protobuf rpc: UpdateEventMessagesSubscription
     */
    updateEventMessagesSubscription(input: UpdateEventMessagesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateEventMessagesSubscriptionRequest, Empty>;
    /**
     * Subscribe to token balance updates.
     *
     * @generated from protobuf rpc: SubscribeTokenBalances
     */
    subscribeTokenBalances(input: SubscribeTokenBalancesRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTokenBalancesRequest, SubscribeTokenBalancesResponse>;
    /**
     * Update token balance subscription
     *
     * @generated from protobuf rpc: UpdateTokenBalancesSubscription
     */
    updateTokenBalancesSubscription(input: UpdateTokenBalancesSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateTokenBalancesSubscriptionRequest, Empty>;
    /**
     * Subscribe to token updates.
     *
     * @generated from protobuf rpc: SubscribeTokens
     */
    subscribeTokens(input: SubscribeTokensRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTokensRequest, SubscribeTokensResponse>;
    /**
     * Update token subscription
     *
     * @generated from protobuf rpc: UpdateTokensSubscription
     */
    updateTokensSubscription(input: UpdateTokenSubscriptionRequest, options?: RpcOptions): UnaryCall<UpdateTokenSubscriptionRequest, Empty>;
    /**
     * Retrieve entities
     *
     * @generated from protobuf rpc: RetrieveEventMessages
     */
    retrieveEventMessages(input: RetrieveEventMessagesRequest, options?: RpcOptions): UnaryCall<RetrieveEventMessagesRequest, RetrieveEntitiesResponse>;
    /**
     * Retrieve events
     *
     * @generated from protobuf rpc: RetrieveEvents
     */
    retrieveEvents(input: RetrieveEventsRequest, options?: RpcOptions): UnaryCall<RetrieveEventsRequest, RetrieveEventsResponse>;
    /**
     * Subscribe to events
     *
     * @generated from protobuf rpc: SubscribeEvents
     */
    subscribeEvents(input: SubscribeEventsRequest, options?: RpcOptions): ServerStreamingCall<SubscribeEventsRequest, SubscribeEventsResponse>;
    /**
     * Retrieve tokens
     *
     * @generated from protobuf rpc: RetrieveTokens
     */
    retrieveTokens(input: RetrieveTokensRequest, options?: RpcOptions): UnaryCall<RetrieveTokensRequest, RetrieveTokensResponse>;
    /**
     * Retrieve token balances
     *
     * @generated from protobuf rpc: RetrieveTokenBalances
     */
    retrieveTokenBalances(input: RetrieveTokenBalancesRequest, options?: RpcOptions): UnaryCall<RetrieveTokenBalancesRequest, RetrieveTokenBalancesResponse>;
    /**
     * Retrieve transactions
     *
     * @generated from protobuf rpc: RetrieveTransactions
     */
    retrieveTransactions(input: RetrieveTransactionsRequest, options?: RpcOptions): UnaryCall<RetrieveTransactionsRequest, RetrieveTransactionsResponse>;
    /**
     * Subscribe to transactions
     *
     * @generated from protobuf rpc: SubscribeTransactions
     */
    subscribeTransactions(input: SubscribeTransactionsRequest, options?: RpcOptions): ServerStreamingCall<SubscribeTransactionsRequest, SubscribeTransactionsResponse>;
    /**
     * Retrieve controllers
     *
     * @generated from protobuf rpc: RetrieveControllers
     */
    retrieveControllers(input: RetrieveControllersRequest, options?: RpcOptions): UnaryCall<RetrieveControllersRequest, RetrieveControllersResponse>;
    /**
     * Retrieve tokens collections
     *
     * @generated from protobuf rpc: RetrieveTokenCollections
     */
    retrieveTokenCollections(input: RetrieveTokenCollectionsRequest, options?: RpcOptions): UnaryCall<RetrieveTokenCollectionsRequest, RetrieveTokenCollectionsResponse>;
    /**
     * Publish a torii offchain message
     *
     * @generated from protobuf rpc: PublishMessage
     */
    publishMessage(input: PublishMessageRequest, options?: RpcOptions): UnaryCall<PublishMessageRequest, PublishMessageResponse>;
    /**
     * Publish a set of torii offchain messages
     *
     * @generated from protobuf rpc: PublishMessageBatch
     */
    publishMessageBatch(input: PublishMessageBatchRequest, options?: RpcOptions): UnaryCall<PublishMessageBatchRequest, PublishMessageBatchResponse>;
}

interface DojoGrpcClientConfig {
    url: string;
    options?: RpcOptions;
}
declare class DojoGrpcClient {
    private transport;
    worldClient: WorldClient;
    constructor(config: DojoGrpcClientConfig);
    destroy(): void;
}
declare function createDojoGrpcClient(config: DojoGrpcClientConfig): DojoGrpcClient;

export { Array$, CallType, Clause, ComparisonOperator, CompositeClause, Controller, ControllerQuery, DojoGrpcClient, type DojoGrpcClientConfig, Entity, Enum, EnumOption, Event, EventQuery, HashedKeysClause, KeysClause, LogicalOperator, Member, MemberClause, MemberValue, MemberValueList, Model, OrderBy, OrderDirection, Pagination, PaginationDirection, PatternMatching, Primitive, PublishMessageBatchRequest, PublishMessageBatchResponse, PublishMessageRequest, PublishMessageResponse, Query, RetrieveControllersRequest, RetrieveControllersResponse, RetrieveEntitiesRequest, RetrieveEntitiesResponse, RetrieveEventMessagesRequest, RetrieveEventsRequest, RetrieveEventsResponse, RetrieveTokenBalancesRequest, RetrieveTokenBalancesResponse, RetrieveTokenCollectionsRequest, RetrieveTokenCollectionsResponse, RetrieveTokensRequest, RetrieveTokensResponse, RetrieveTransactionsRequest, RetrieveTransactionsResponse, Struct, SubscribeEntitiesRequest, SubscribeEntityResponse, SubscribeEventMessagesRequest, SubscribeEventsRequest, SubscribeEventsResponse, SubscribeIndexerRequest, SubscribeIndexerResponse, SubscribeTokenBalancesRequest, SubscribeTokenBalancesResponse, SubscribeTokensRequest, SubscribeTokensResponse, SubscribeTransactionsRequest, SubscribeTransactionsResponse, Token, TokenBalance, TokenBalanceQuery, TokenCollection, TokenQuery, Transaction, TransactionCall, TransactionFilter, TransactionQuery, Ty, UpdateEntitiesSubscriptionRequest, UpdateEventMessagesSubscriptionRequest, UpdateTokenBalancesSubscriptionRequest, UpdateTokenSubscriptionRequest, WorldClient, World$1 as WorldMessage, WorldMetadataRequest, WorldMetadataResponse, World as WorldService, createDojoGrpcClient };
