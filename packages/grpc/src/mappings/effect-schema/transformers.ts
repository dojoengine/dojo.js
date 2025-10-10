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
    TokenContractSchema,
    TokenContractsResponseSchema,
    TokenTransferSchema,
    TokenTransfersResponseSchema,
} from "./entity-schemas";
import {
    EntitySchema,
    EntitiesResponseSchema,
    AggregationEntrySchema,
    AggregationsResponseSchema,
    ActivitySchema,
    ActivitiesResponseSchema,
} from "./model-schemas";
import { BufferToHex } from "./base-schemas";
import type {
    AggregationEntryView,
    AggregationsPage,
    ActivityEntry,
    ActivitiesPage,
} from "../../types";

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

export function transformTokenContract(
    collection: GrpcTypes.TokenContract
): ToriiTypes.TokenContract {
    return Schema.decodeSync(TokenContractSchema)(collection);
}

export function transformTokenContractsResponse(
    response: GrpcTypes.RetrieveTokenContractsResponse
): ToriiTypes.TokenContracts {
    return Schema.decodeSync(TokenContractsResponseSchema)(response);
}

export function transformTokenTransfer(
    transfer: GrpcTypes.TokenTransfer
): ToriiTypes.TokenTransfer {
    return Schema.decodeSync(TokenTransferSchema)(transfer);
}

export function transformTokenTransfersResponse(
    response: GrpcTypes.RetrieveTokenTransfersResponse
): ToriiTypes.TokenTransfers {
    return Schema.decodeSync(TokenTransfersResponseSchema)(response);
}

export function transformEntity(entity: GrpcTypes.Entity): ToriiTypes.Entity {
    return Schema.decodeSync(EntitySchema)(entity);
}

export function transformEntitiesResponse(
    response: GrpcTypes.RetrieveEntitiesResponse
): ToriiTypes.Entities {
    return Schema.decodeSync(EntitiesResponseSchema)(response);
}

export function transformAggregationEntry(
    entry: GrpcTypes.AggregationEntry
): AggregationEntryView {
    return Schema.decodeSync(AggregationEntrySchema)(entry);
}

export function transformAggregationsResponse(
    response: GrpcTypes.RetrieveAggregationsResponse
): AggregationsPage {
    return Schema.decodeSync(AggregationsResponseSchema)(response);
}

export function transformActivity(activity: GrpcTypes.Activity): ActivityEntry {
    return Schema.decodeSync(ActivitySchema)(activity);
}

export function transformActivitiesResponse(
    response: GrpcTypes.RetrieveActivitiesResponse
): ActivitiesPage {
    return Schema.decodeSync(ActivitiesResponseSchema)(response);
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

export function transformEvent(event: any): any {
    return {
        keys: event.keys.map((key: Uint8Array) =>
            Schema.decodeSync(BufferToHex)(key)
        ),
        data: event.data.map((d: Uint8Array) =>
            Schema.decodeSync(BufferToHex)(d)
        ),
        transaction_hash: Schema.decodeSync(BufferToHex)(
            event.transaction_hash
        ),
    };
}

export function transformEventsResponse(response: any): any {
    return {
        items: response.events.map(transformEvent),
        next_cursor: response.next_cursor || undefined,
    };
}

export function transformContract(contract: any): any {
    return {
        contract_address: Schema.decodeSync(BufferToHex)(
            contract.contract_address
        ),
        contract_type: contract.contract_type,
        head: contract.head ? Number(contract.head) : undefined,
        tps: contract.tps ? Number(contract.tps) : undefined,
        last_block_timestamp: contract.last_block_timestamp
            ? Number(contract.last_block_timestamp)
            : undefined,
        last_pending_block_tx: contract.last_pending_block_tx
            ? Schema.decodeSync(BufferToHex)(contract.last_pending_block_tx)
            : undefined,
        updated_at: Number(contract.updated_at),
        created_at: Number(contract.created_at),
    };
}

export function transformContractsResponse(response: any): any {
    return {
        items: response.contracts.map(transformContract),
    };
}

export function transformWorldMetadataResponse(
    response: GrpcTypes.WorldsResponse,
    preferredWorldAddress?: string
): any {
    if (!response.worlds || response.worlds.length === 0) {
        return null;
    }

    const normalizedPreferred = preferredWorldAddress
        ? preferredWorldAddress.toLowerCase()
        : undefined;

    const world =
        (normalizedPreferred
            ? response.worlds.find(
                  (candidate) =>
                      candidate.world_address.toLowerCase() ===
                      normalizedPreferred
              )
            : undefined) ?? response.worlds[0];

    return {
        world_address: world.world_address,
        models: world.models.map((model: any) => ({
            selector: Schema.decodeSync(BufferToHex)(model.selector),
            namespace: model.namespace,
            name: model.name,
            packed_size: model.packed_size,
            unpacked_size: model.unpacked_size,
            class_hash: Schema.decodeSync(BufferToHex)(model.class_hash),
            layout: Schema.decodeSync(BufferToHex)(model.layout),
            schema: Schema.decodeSync(BufferToHex)(model.schema),
            contract_address: Schema.decodeSync(BufferToHex)(
                model.contract_address
            ),
            use_legacy_store: model.use_legacy_store,
            world_address: Schema.decodeSync(BufferToHex)(model.world_address),
        })),
    };
}
