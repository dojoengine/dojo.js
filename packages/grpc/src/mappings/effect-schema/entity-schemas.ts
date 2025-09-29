import { Schema } from "effect";
import type * as GrpcTypes from "../../generated/types";
import type * as ToriiTypes from "@dojoengine/torii-wasm";
import {
    BufferToHex,
    OptionalBufferToHex,
    BufferArrayToHexArray,
    BigIntToNumber,
    OptionalString,
    JsonMetadata,
} from "./base-schemas";

const CallTypeSchema = Schema.transform(
    Schema.Enums({
        EXECUTE: 0,
        EXECUTE_FROM_OUTSIDE: 1,
    }),
    Schema.Literal("Execute", "ExecuteFromOutside"),
    {
        decode: (grpcCallType) => {
            switch (grpcCallType) {
                case 0:
                    return "Execute";
                case 1:
                    return "ExecuteFromOutside";
                default:
                    return "Execute";
            }
        },
        encode: (toriiCallType) => {
            switch (toriiCallType) {
                case "Execute":
                    return 0;
                case "ExecuteFromOutside":
                    return 1;
                default:
                    return 0;
            }
        },
    }
);

export const TransactionCallSchema = Schema.transform(
    Schema.Struct({
        contract_address: Schema.Uint8ArrayFromSelf,
        entrypoint: Schema.String,
        calldata: Schema.Array(Schema.Uint8ArrayFromSelf),
        call_type: Schema.Enums({
            EXECUTE: 0,
            EXECUTE_FROM_OUTSIDE: 1,
        }),
        caller_address: Schema.Uint8ArrayFromSelf,
    }),
    Schema.Struct({
        contract_address: BufferToHex,
        entrypoint: Schema.String,
        calldata: BufferArrayToHexArray,
        call_type: CallTypeSchema,
        caller_address: BufferToHex,
    }),
    {
        decode: (grpc) => ({
            contract_address: grpc.contract_address,
            entrypoint: grpc.entrypoint,
            calldata: grpc.calldata,
            call_type: grpc.call_type,
            caller_address: grpc.caller_address,
        }),
        encode: (torii) => ({
            contract_address: torii.contract_address,
            entrypoint: torii.entrypoint,
            calldata: torii.calldata,
            call_type: torii.call_type,
            caller_address: torii.caller_address,
        }),
    }
);

export const TransactionSchema = Schema.transform(
    Schema.Struct({
        transaction_hash: Schema.Uint8ArrayFromSelf,
        sender_address: Schema.Uint8ArrayFromSelf,
        calldata: Schema.Array(Schema.Uint8ArrayFromSelf),
        max_fee: Schema.Uint8ArrayFromSelf,
        signature: Schema.Array(Schema.Uint8ArrayFromSelf),
        nonce: Schema.Uint8ArrayFromSelf,
        block_number: Schema.BigIntFromSelf,
        block_timestamp: Schema.BigIntFromSelf,
        transaction_type: Schema.String,
        calls: Schema.Array(TransactionCallSchema),
        unique_models: Schema.Array(Schema.Uint8ArrayFromSelf),
    }),
    Schema.Struct({
        transaction_hash: BufferToHex,
        sender_address: BufferToHex,
        calldata: BufferArrayToHexArray,
        max_fee: BufferToHex,
        signature: BufferArrayToHexArray,
        nonce: BufferToHex,
        block_number: BigIntToNumber,
        block_timestamp: BigIntToNumber,
        transaction_type: Schema.String,
        calls: Schema.Array(TransactionCallSchema),
        unique_models: BufferArrayToHexArray,
    }),
    {
        decode: (grpc) => ({
            transaction_hash: grpc.transaction_hash,
            sender_address: grpc.sender_address,
            calldata: grpc.calldata,
            max_fee: grpc.max_fee,
            signature: grpc.signature,
            nonce: grpc.nonce,
            block_number: grpc.block_number,
            block_timestamp: grpc.block_timestamp,
            transaction_type: grpc.transaction_type,
            calls: grpc.calls,
            unique_models: grpc.unique_models,
        }),
        encode: (torii) => ({
            transaction_hash: torii.transaction_hash,
            sender_address: torii.sender_address,
            calldata: torii.calldata,
            max_fee: torii.max_fee,
            signature: torii.signature,
            nonce: torii.nonce,
            block_number: BigInt(torii.block_number),
            block_timestamp: BigInt(torii.block_timestamp),
            transaction_type: torii.transaction_type,
            calls: torii.calls,
            unique_models: torii.unique_models,
        }),
    }
);

export const ControllerSchema = Schema.transform(
    Schema.Struct({
        address: Schema.Uint8ArrayFromSelf,
        username: Schema.String,
        deployed_at_timestamp: Schema.BigIntFromSelf,
    }),
    Schema.Struct({
        address: BufferToHex,
        username: Schema.String,
        deployed_at_timestamp: BigIntToNumber,
    }),
    {
        decode: (grpc) => ({
            address: grpc.address,
            username: grpc.username,
            deployed_at_timestamp: grpc.deployed_at_timestamp,
        }),
        encode: (torii) => ({
            address: torii.address,
            username: torii.username,
            deployed_at_timestamp: BigInt(torii.deployed_at_timestamp),
        }),
    }
);

export const TokenSchema = Schema.transform(
    Schema.Struct({
        contract_address: Schema.Uint8ArrayFromSelf,
        token_id: Schema.optional(Schema.Uint8ArrayFromSelf),
        name: Schema.String,
        symbol: Schema.String,
        decimals: Schema.Number,
        metadata: Schema.Uint8ArrayFromSelf,
    }),
    Schema.Struct({
        contract_address: BufferToHex,
        token_id: OptionalBufferToHex,
        name: Schema.String,
        symbol: Schema.String,
        decimals: Schema.Number,
        metadata: JsonMetadata,
    }),
    {
        decode: (grpc) => ({
            contract_address: grpc.contract_address,
            token_id: grpc.token_id,
            name: grpc.name,
            symbol: grpc.symbol,
            decimals: grpc.decimals,
            metadata: grpc.metadata,
        }),
        encode: (torii) => ({
            contract_address: torii.contract_address,
            token_id: torii.token_id,
            name: torii.name,
            symbol: torii.symbol,
            decimals: torii.decimals,
            metadata: torii.metadata,
        }),
    }
);

export const TokenBalanceSchema = Schema.transform(
    Schema.Struct({
        balance: Schema.Uint8ArrayFromSelf,
        account_address: Schema.Uint8ArrayFromSelf,
        contract_address: Schema.Uint8ArrayFromSelf,
        token_id: Schema.optional(Schema.Uint8ArrayFromSelf),
    }),
    Schema.Struct({
        balance: BufferToHex,
        account_address: BufferToHex,
        contract_address: BufferToHex,
        token_id: OptionalBufferToHex,
    }),
    {
        decode: (grpc) => ({
            balance: grpc.balance,
            account_address: grpc.account_address,
            contract_address: grpc.contract_address,
            token_id: grpc.token_id,
        }),
        encode: (torii) => ({
            balance: torii.balance,
            account_address: torii.account_address,
            contract_address: torii.contract_address,
            token_id: torii.token_id,
        }),
    }
);

export const TokenContractSchema = Schema.transform(
    Schema.Struct({
        contract_address: Schema.Uint8ArrayFromSelf,
        name: Schema.String,
        symbol: Schema.String,
        decimals: Schema.Number,
        count: Schema.BigIntFromSelf,
        metadata: Schema.Uint8ArrayFromSelf,
    }),
    Schema.Struct({
        contract_address: BufferToHex,
        name: Schema.String,
        symbol: Schema.String,
        decimals: Schema.Number,
        count: Schema.Number,
        metadata: JsonMetadata,
    }),
    {
        decode: (grpc) => ({
            contract_address: grpc.contract_address,
            name: grpc.name,
            symbol: grpc.symbol,
            decimals: grpc.decimals,
            count: grpc.count,
            metadata: grpc.metadata,
        }),
        encode: (torii) => ({
            contract_address: torii.contract_address,
            name: torii.name,
            symbol: torii.symbol,
            decimals: torii.decimals,
            count: BigInt(torii.count),
            metadata: torii.metadata,
        }),
    }
);

export const TokenTransferSchema = Schema.transform(
    Schema.Struct({
        id: Schema.String,
        contract_address: Schema.Uint8ArrayFromSelf,
        from_address: Schema.Uint8ArrayFromSelf,
        to_address: Schema.Uint8ArrayFromSelf,
        amount: Schema.Uint8ArrayFromSelf,
        token_id: Schema.optional(Schema.Uint8ArrayFromSelf),
        executed_at: Schema.BigIntFromSelf,
        event_id: Schema.optional(Schema.String),
    }),
    Schema.Struct({
        id: Schema.String,
        contract_address: BufferToHex,
        from_address: BufferToHex,
        to_address: BufferToHex,
        amount: BufferToHex,
        token_id: OptionalBufferToHex,
        executed_at: BigIntToNumber,
        event_id: OptionalString,
    }),
    {
        decode: (grpc) => ({
            id: grpc.id,
            contract_address: grpc.contract_address,
            from_address: grpc.from_address,
            to_address: grpc.to_address,
            amount: grpc.amount,
            token_id: grpc.token_id,
            executed_at: grpc.executed_at,
            event_id: grpc.event_id,
        }),
        encode: (torii) => ({
            id: torii.id,
            contract_address: torii.contract_address,
            from_address: torii.from_address,
            to_address: torii.to_address,
            amount: torii.amount,
            token_id: torii.token_id,
            executed_at: BigInt(torii.executed_at),
            event_id: torii.event_id,
        }),
    }
);

export const TransactionsResponseSchema = Schema.transform(
    Schema.Struct({
        transactions: Schema.Array(TransactionSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(TransactionSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.transactions,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            transactions: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);

export const ControllersResponseSchema = Schema.transform(
    Schema.Struct({
        controllers: Schema.Array(ControllerSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(ControllerSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.controllers,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            controllers: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);

export const TokensResponseSchema = Schema.transform(
    Schema.Struct({
        tokens: Schema.Array(TokenSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(TokenSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.tokens,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            tokens: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);

export const TokenBalancesResponseSchema = Schema.transform(
    Schema.Struct({
        balances: Schema.Array(TokenBalanceSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(TokenBalanceSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.balances,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            balances: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);

export const TokenTransfersResponseSchema = Schema.transform(
    Schema.Struct({
        transfers: Schema.Array(TokenTransferSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(TokenTransferSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.transfers,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            transfers: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);

export const TokenContractsResponseSchema = Schema.transform(
    Schema.Struct({
        tokens: Schema.Array(TokenContractSchema),
        next_cursor: OptionalString,
    }),
    Schema.Struct({
        items: Schema.Array(TokenContractSchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.tokens,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            tokens: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);
