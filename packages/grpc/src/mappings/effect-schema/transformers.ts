import { Schema } from "effect";
import type * as GrpcTypes from "../../generated/world";
import type * as ToriiTypes from "@dojoengine/torii-wasm";
import {
    TransactionSchema,
    TransactionsResponseSchema,
    ControllerSchema,
    ControllersResponseSchema,
    TokenSchema,
    TokensResponseSchema,
    TokenBalanceSchema,
    TokenBalancesResponseSchema,
    TokenCollectionSchema,
    TokenCollectionsResponseSchema,
} from "./entity-schemas";
import { EntitySchema, EntitiesResponseSchema } from "./model-schemas";
import { BufferToHex } from "./base-schemas";

export function transformTransaction(
    tx: GrpcTypes.Transaction
): ToriiTypes.Transaction {
    return Schema.decodeSync(TransactionSchema)(tx);
}

export function transformTransactionsResponse(
    response: GrpcTypes.RetrieveTransactionsResponse
): ToriiTypes.Transactions {
    return Schema.decodeSync(TransactionsResponseSchema)(response);
}

export function transformController(
    controller: GrpcTypes.Controller
): ToriiTypes.Controller {
    return Schema.decodeSync(ControllerSchema)(controller);
}

export function transformControllersResponse(
    response: GrpcTypes.RetrieveControllersResponse
): ToriiTypes.Controllers {
    return Schema.decodeSync(ControllersResponseSchema)(response);
}

export function transformToken(token: GrpcTypes.Token): ToriiTypes.Token {
    return Schema.decodeSync(TokenSchema)(token);
}

export function transformTokensResponse(
    response: GrpcTypes.RetrieveTokensResponse
): ToriiTypes.Tokens {
    return Schema.decodeSync(TokensResponseSchema)(response);
}

export function transformTokenBalance(
    balance: GrpcTypes.TokenBalance
): ToriiTypes.TokenBalance {
    return Schema.decodeSync(TokenBalanceSchema)(balance);
}

export function transformTokenBalancesResponse(
    response: GrpcTypes.RetrieveTokenBalancesResponse
): ToriiTypes.TokenBalances {
    return Schema.decodeSync(TokenBalancesResponseSchema)(response);
}

export function transformTokenCollection(
    collection: GrpcTypes.TokenCollection
): ToriiTypes.TokenCollection {
    return Schema.decodeSync(TokenCollectionSchema)(collection);
}

export function transformTokenCollectionsResponse(
    response: GrpcTypes.RetrieveTokenCollectionsResponse
): ToriiTypes.TokenCollections {
    return Schema.decodeSync(TokenCollectionsResponseSchema)(response);
}

export function transformEntity(entity: GrpcTypes.Entity): ToriiTypes.Entity {
    return Schema.decodeSync(EntitySchema)(entity);
}

export function transformEntitiesResponse(
    response: GrpcTypes.RetrieveEntitiesResponse
): ToriiTypes.Entities {
    return Schema.decodeSync(EntitiesResponseSchema)(response);
}

export function transformIndexerUpdate(
    update: GrpcTypes.SubscribeIndexerResponse
): ToriiTypes.IndexerUpdate {
    return {
        head: Number(update.head),
        tps: Number(update.tps),
        last_block_timestamp: Number(update.last_block_timestamp),
        contract_address: Schema.decodeSync(BufferToHex)(
            update.contract_address
        ),
    };
}

export function transformMessage(
    message: ToriiTypes.Message
): GrpcTypes.PublishMessageRequest {
    return {
        message: message.message,
        signature: message.signature.map((sig) =>
            Schema.encodeSync(BufferToHex)(sig)
        ),
    };
}
