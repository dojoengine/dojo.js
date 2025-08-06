import type {
    Entity as ToriiEntity,
    Entities as ToriiEntities,
    Token as ToriiToken,
    Tokens as ToriiTokens,
    TokenBalance as ToriiTokenBalance,
    TokenBalances as ToriiTokenBalances,
    TokenCollection as ToriiTokenCollection,
    TokenCollections as ToriiTokenCollections,
    Controller as ToriiController,
    Controllers as ToriiControllers,
    Transaction as ToriiTransaction,
    Transactions as ToriiTransactions,
    TransactionCall as ToriiTransactionCall,
    CallType as ToriiCallType,
    Model as ToriiModel,
    Ty,
    IndexerUpdate as ToriiIndexerUpdate,
    Message as ToriiMessage,
} from "@dojoengine/torii-wasm";

import type {
    Entity as GrpcEntity,
    Token as GrpcToken,
    TokenBalance as GrpcTokenBalance,
    TokenCollection as GrpcTokenCollection,
    Controller as GrpcController,
    Transaction as GrpcTransaction,
    TransactionCall as GrpcTransactionCall,
} from "../generated/types";

import { CallType as GrpcCallType } from "../generated/types";
import type {
    Ty as GrpcTy,
    Primitive as GrpcPrimitive,
    Struct as GrpcStruct,
    Enum as GrpcEnum,
    Array$ as GrpcArray,
    Member as GrpcMember,
} from "../generated/schema";

import type {
    RetrieveEntitiesResponse,
    RetrieveTokensResponse,
    RetrieveTokenBalancesResponse,
    RetrieveTokenCollectionsResponse,
    RetrieveControllersResponse,
    RetrieveTransactionsResponse,
    SubscribeIndexerResponse,
    PublishMessageRequest,
} from "../generated/world";

let textDecoder: TextDecoder | undefined = undefined;

function bufferToHex(buffer: Uint8Array): string {
    return (
        "0x" +
        Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
    );
}

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

export function mapCallType(callType: GrpcCallType): ToriiCallType {
    switch (callType) {
        case GrpcCallType.EXECUTE:
            return "Execute";
        case GrpcCallType.EXECUTE_FROM_OUTSIDE:
            return "ExecuteFromOutside";
        default:
            return "Execute";
    }
}

export function mapTransactionCall(
    call: GrpcTransactionCall
): ToriiTransactionCall {
    return {
        contract_address: bufferToHex(call.contract_address),
        entrypoint: call.entrypoint,
        calldata: call.calldata.map(bufferToHex),
        call_type: mapCallType(call.call_type),
        caller_address: bufferToHex(call.caller_address),
    };
}

export function mapTransaction(tx: GrpcTransaction): ToriiTransaction {
    return {
        transaction_hash: bufferToHex(tx.transaction_hash),
        sender_address: bufferToHex(tx.sender_address),
        calldata: tx.calldata.map(bufferToHex),
        max_fee: bufferToHex(tx.max_fee),
        signature: tx.signature.map(bufferToHex),
        nonce: bufferToHex(tx.nonce),
        block_number: Number(tx.block_number),
        transaction_type: tx.transaction_type,
        block_timestamp: Number(tx.block_timestamp),
        calls: tx.calls.map(mapTransactionCall),
        unique_models: tx.unique_models.map(bufferToHex),
    };
}

export function mapTransactionsResponse(
    response: RetrieveTransactionsResponse
): ToriiTransactions {
    return {
        items: response.transactions.map(mapTransaction),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapController(controller: GrpcController): ToriiController {
    return {
        address: bufferToHex(controller.address),
        username: controller.username,
        deployed_at_timestamp: Number(controller.deployed_at_timestamp),
    };
}

export function mapControllersResponse(
    response: RetrieveControllersResponse
): ToriiControllers {
    return {
        items: response.controllers.map(mapController),
        next_cursor: response.next_cursor || undefined,
    };
}

export function uint8ArrayToString(input: Uint8Array): string {
    if (textDecoder) {
        return textDecoder.decode(input);
    }
    textDecoder = new TextDecoder();
    return textDecoder.decode(input);
}

export function parseJsonMetadata(input: Uint8Array): any {
    try {
        return JSON.parse(uint8ArrayToString(input));
    } catch (_err) {
        return uint8ArrayToString(input);
    }
}

export function mapToken(token: GrpcToken): ToriiToken {
    return {
        contract_address: bufferToHex(token.contract_address),
        token_id: token.token_id ? bufferToHex(token.token_id) : undefined,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        metadata: parseJsonMetadata(token.metadata),
    };
}

export function mapTokensResponse(
    response: RetrieveTokensResponse
): ToriiTokens {
    return {
        items: response.tokens.map(mapToken),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapTokenBalance(balance: GrpcTokenBalance): ToriiTokenBalance {
    return {
        balance: bufferToHex(balance.balance),
        account_address: bufferToHex(balance.account_address),
        contract_address: bufferToHex(balance.contract_address),
        token_id: balance.token_id ? bufferToHex(balance.token_id) : undefined,
    };
}

export function mapTokenBalancesResponse(
    response: RetrieveTokenBalancesResponse
): ToriiTokenBalances {
    return {
        items: response.balances.map(mapTokenBalance),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapTokenCollection(
    collection: GrpcTokenCollection
): ToriiTokenCollection {
    return {
        contract_address: bufferToHex(collection.contract_address),
        name: collection.name,
        symbol: collection.symbol,
        decimals: collection.decimals,
        count: collection.count,
        metadata: parseJsonMetadata(collection.metadata),
    };
}

export function mapTokenCollectionsResponse(
    response: RetrieveTokenCollectionsResponse
): ToriiTokenCollections {
    return {
        items: response.tokens.map(mapTokenCollection),
        next_cursor: response.next_cursor || undefined,
    };
}

function mapPrimitive(primitive: GrpcPrimitive): any {
    if (!primitive.primitive_type) return null;

    switch (primitive.primitive_type.oneofKind) {
        case "i8":
            return primitive.primitive_type.i8;
        case "i16":
            return primitive.primitive_type.i16;
        case "i32":
            return primitive.primitive_type.i32;
        case "i64":
            return Number(primitive.primitive_type.i64);
        case "i128":
            return bufferToHex(primitive.primitive_type.i128);
        case "u8":
            return primitive.primitive_type.u8;
        case "u16":
            return primitive.primitive_type.u16;
        case "u32":
            return primitive.primitive_type.u32;
        case "u64":
            return Number(primitive.primitive_type.u64);
        case "u128":
            return bufferToHex(primitive.primitive_type.u128);
        case "u256":
            return bufferToHex(primitive.primitive_type.u256);
        case "bool":
            return primitive.primitive_type.bool;
        case "felt252":
            return bufferToHex(primitive.primitive_type.felt252);
        case "class_hash":
            return bufferToHex(primitive.primitive_type.class_hash);
        case "contract_address":
            return bufferToHex(primitive.primitive_type.contract_address);
        case "eth_address":
            return bufferToHex(primitive.primitive_type.eth_address);
        default:
            return null;
    }
}

function getPrimitiveTypeName(primitive: GrpcPrimitive): string {
    if (!primitive.primitive_type) return "";
    return primitive.primitive_type.oneofKind || "";
}

function mapTy(ty: GrpcTy, isKey: boolean = false): Ty {
    if (!ty.ty_type) {
        return {
            type: "primitive",
            type_name: "",
            value: null,
            key: isKey,
        };
    }

    switch (ty.ty_type.oneofKind) {
        case "primitive": {
            return {
                type: "primitive",
                type_name: getPrimitiveTypeName(ty.ty_type.primitive),
                value: mapPrimitive(ty.ty_type.primitive),
                key: isKey,
            };
        }
        case "struct": {
            const struct = ty.ty_type.struct;
            const structValue: Record<string, Ty> = {};

            for (const member of struct.children) {
                if (member.ty) {
                    structValue[member.name] = mapTy(member.ty, member.key);
                }
            }

            return {
                type: "struct",
                type_name: struct.name,
                value: structValue,
                key: isKey,
            };
        }
        case "enum": {
            const enumType = ty.ty_type.enum;
            const selectedOption = enumType.options[enumType.option];

            return {
                type: "enum",
                type_name: enumType.name,
                value:
                    selectedOption && selectedOption.ty
                        ? {
                              option: selectedOption.name,
                              value: mapTy(selectedOption.ty),
                          }
                        : null,
                key: isKey,
            };
        }
        case "array": {
            const array = ty.ty_type.array;
            return {
                type: "array",
                type_name: "array",
                value: array.children.map((child) => mapTy(child)),
                key: isKey,
            };
        }
        case "tuple": {
            const tuple = ty.ty_type.tuple;
            return {
                type: "tuple",
                type_name: "tuple",
                value: tuple.children.map((child) => mapTy(child)),
                key: isKey,
            };
        }
        case "bytearray": {
            return {
                type: "bytearray",
                type_name: "bytearray",
                value: ty.ty_type.bytearray,
                key: isKey,
            };
        }
        default:
            return {
                type: "primitive",
                type_name: "",
                value: null,
                key: isKey,
            };
    }
}

function mapModel(model: GrpcMember[]): ToriiModel {
    const mappedModel: ToriiModel = {};
    if (model && Array.isArray(model)) {
        for (const member of model) {
            if (member.ty) {
                mappedModel[member.name] = mapTy(member.ty, member.key);
            }
        }
    }
    return mappedModel;
}

export function mapEntity(entity: GrpcEntity): ToriiEntity {
    const models: Record<string, ToriiModel> = {};
    for (const model of entity.models) {
        models[model.name] = mapModel(model.children);
    }

    return {
        hashed_keys: bufferToHex(entity.hashed_keys),
        models,
    };
}

export function mapEntitiesResponse(
    response: RetrieveEntitiesResponse
): ToriiEntities {
    return {
        items: response.entities.map(mapEntity),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapIndexerUpdate(
    update: SubscribeIndexerResponse
): ToriiIndexerUpdate {
    return {
        head: Number(update.head),
        tps: Number(update.tps),
        last_block_timestamp: Number(update.last_block_timestamp),
        contract_address: bufferToHex(update.contract_address),
    };
}

export function mapMessage(message: ToriiMessage): PublishMessageRequest {
    return {
        message: message.message,
        signature: message.signature.map(hexToBuffer),
    };
}

export function mapCallTypeToGrpc(callType: ToriiCallType): GrpcCallType {
    switch (callType) {
        case "Execute":
            return GrpcCallType.EXECUTE;
        case "ExecuteFromOutside":
            return GrpcCallType.EXECUTE_FROM_OUTSIDE;
        default:
            return GrpcCallType.EXECUTE;
    }
}
