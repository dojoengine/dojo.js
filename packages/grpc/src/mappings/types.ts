import type {
    Entity as ToriiEntity,
    Entities as ToriiEntities,
    Token as ToriiToken,
    Tokens as ToriiTokens,
    TokenBalance as ToriiTokenBalance,
    TokenBalances as ToriiTokenBalances,
    TokenContract as ToriiTokenContract,
    TokenContracts as ToriiTokenContracts,
    TokenTransfer as ToriiTokenTransfer,
    TokenTransfers as ToriiTokenTransfers,
    Controller as ToriiController,
    Controllers as ToriiControllers,
    Transaction as ToriiTransaction,
    Transactions as ToriiTransactions,
    TransactionCall as ToriiTransactionCall,
    CallType as ToriiCallType,
    Model as ToriiModel,
    Ty,
    Message as ToriiMessage,
} from "@dojoengine/torii-wasm";

import type {
    Entity as GrpcEntity,
    Token as GrpcToken,
    TokenBalance as GrpcTokenBalance,
    TokenContract as GrpcTokenContract,
    TokenTransfer as GrpcTokenTransfer,
    Controller as GrpcController,
    Transaction as GrpcTransaction,
    TransactionCall as GrpcTransactionCall,
    Event as GrpcEvent,
    Contract as GrpcContract,
    AggregationEntry as GrpcAggregationEntry,
    Activity as GrpcActivity,
    SqlQueryResponse as GrpcSqlQueryResponse,
    SqlValue as GrpcSqlValue,
    Achievement as GrpcAchievement,
    AchievementTask as GrpcAchievementTask,
    PlayerAchievementEntry as GrpcPlayerAchievementEntry,
    PlayerAchievementStats as GrpcPlayerAchievementStats,
    PlayerAchievementProgress as GrpcPlayerAchievementProgress,
    TaskProgress as GrpcTaskProgress,
    AchievementProgression as GrpcAchievementProgression,
} from "../generated/types";

import { CallType as GrpcCallType } from "../generated/types";
import type {
    AggregationEntryView,
    AggregationsPage,
    ActivityEntry,
    ActivitiesPage,
    SqlQueryScalar,
    SqlQueryResponse as ClientSqlQueryResponse,
    PlayerAchievementEntryView,
    AchievementsPage,
    PlayerAchievementsPage,
    AchievementProgressionView,
    AchievementData,
    PlayerAchievementStatsData,
    PlayerAchievementProgressData,
    PlayerAchievementEntryData,
    AchievementTaskData,
    TaskProgressData,
} from "../types";
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
    RetrieveTokenContractsResponse,
    RetrieveTokenTransfersResponse,
    RetrieveControllersResponse,
    RetrieveTransactionsResponse,
    PublishMessageRequest,
    RetrieveEventsResponse,
    RetrieveContractsResponse,
    WorldsResponse,
    RetrieveAggregationsResponse,
    RetrieveActivitiesResponse,
    RetrieveAchievementsResponse,
    RetrievePlayerAchievementsResponse,
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

function toOptionalNumber(
    value: bigint | number | undefined
): number | undefined {
    return value === undefined ? undefined : Number(value);
}

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

function parseTimestampToSeconds(value: string): number {
    if (!value) {
        return 0;
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
        return numeric;
    }

    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
        return Math.floor(parsed / 1000);
    }

    return 0;
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
        total_supply: token.total_supply
            ? bufferToHex(token.total_supply)
            : undefined,
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

export function mapTokenContract(
    collection: GrpcTokenContract
): ToriiTokenContract & {
    contract_type: ContractType;
    traits: unknown;
} {
    return {
        contract_address: bufferToHex(collection.contract_address),
        name: collection.name,
        symbol: collection.symbol,
        decimals: collection.decimals,
        total_supply: collection.total_supply
            ? bufferToHex(collection.total_supply)
            : undefined,
        metadata: parseJsonMetadata(collection.metadata),
        traits: JSON.parse(collection.traits),
        token_metadata: parseJsonMetadata(collection.token_metadata),
        contract_type: collection.contract_type,
    };
}

export function mapTokenContractsResponse(
    response: RetrieveTokenContractsResponse
): ToriiTokenContracts {
    return {
        items: response.token_contracts.map(mapTokenContract),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapTokenTransfer(
    transfer: GrpcTokenTransfer
): ToriiTokenTransfer {
    return {
        id: transfer.id,
        contract_address: bufferToHex(transfer.contract_address),
        from_address: bufferToHex(transfer.from_address),
        to_address: bufferToHex(transfer.to_address),
        amount: bufferToHex(transfer.amount),
        token_id: transfer.token_id
            ? bufferToHex(transfer.token_id)
            : undefined,
        executed_at: Number(transfer.executed_at),
        event_id: transfer.event_id || undefined,
    };
}

export function mapTokenTransfersResponse(
    response: RetrieveTokenTransfersResponse
): ToriiTokenTransfers {
    return {
        items: response.transfers.map(mapTokenTransfer),
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
        created_at: Number(entity.created_at),
        updated_at: Number(entity.updated_at),
        executed_at: Number(entity.executed_at),
        world_address: bufferToHex(entity.world_address),
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

export function mapEvent(event: GrpcEvent): any {
    return {
        keys: event.keys.map(bufferToHex),
        data: event.data.map(bufferToHex),
        transaction_hash: bufferToHex(event.transaction_hash),
    };
}

export function mapEventsResponse(response: RetrieveEventsResponse): any {
    return {
        items: response.events.map(mapEvent),
        next_cursor: response.next_cursor || undefined,
    };
}

export function mapContract(contract: GrpcContract): any {
    return {
        contract_address: bufferToHex(contract.contract_address),
        contract_type: contract.contract_type,
        head: contract.head ? Number(contract.head) : undefined,
        tps: contract.tps ? Number(contract.tps) : undefined,
        last_block_timestamp: contract.last_block_timestamp
            ? Number(contract.last_block_timestamp)
            : undefined,
        last_pending_block_tx: contract.last_pending_block_tx
            ? bufferToHex(contract.last_pending_block_tx)
            : undefined,
        updated_at: Number(contract.updated_at),
        created_at: Number(contract.created_at),
    };
}

export function mapContractsResponse(response: RetrieveContractsResponse): any {
    return {
        items: response.contracts.map(mapContract),
    };
}

function mapWorldModel(model: any) {
    return {
        selector: bufferToHex(model.selector),
        namespace: model.namespace,
        name: model.name,
        packed_size: model.packed_size,
        unpacked_size: model.unpacked_size,
        class_hash: bufferToHex(model.class_hash),
        layout: bufferToHex(model.layout),
        schema: bufferToHex(model.schema),
        contract_address: bufferToHex(model.contract_address),
        use_legacy_store: model.use_legacy_store,
        world_address: bufferToHex(model.world_address),
    };
}

function mapWorld(world: any) {
    return {
        world_address: world.world_address,
        models: world.models.map(mapWorldModel),
    };
}

export function mapWorldMetadataResponse(
    response: WorldsResponse,
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

    return mapWorld(world);
}

export function mapWorldsResponse(response: WorldsResponse): any[] {
    if (!response.worlds) {
        return [];
    }
    return response.worlds.map(mapWorld);
}

export function mapAggregationEntry(
    entry: GrpcAggregationEntry
): AggregationEntryView {
    return {
        id: entry.id,
        aggregatorId: entry.aggregator_id,
        entityId: entry.entity_id,
        value: bufferToHex(entry.value),
        displayValue: entry.display_value,
        position: Number(entry.position),
        modelId: entry.model_id,
        createdAt: parseTimestampToSeconds(entry.created_at),
        updatedAt: parseTimestampToSeconds(entry.updated_at),
    };
}

export function mapAggregationsResponse(
    response: RetrieveAggregationsResponse
): AggregationsPage {
    const nextCursor = response.next_cursor || undefined;
    return {
        items: response.entries.map(mapAggregationEntry),
        nextCursor,
        next_cursor: nextCursor,
    };
}

export function mapActivity(activity: GrpcActivity): ActivityEntry {
    return {
        id: activity.id,
        worldAddress: bufferToHex(activity.world_address),
        namespace: activity.namespace,
        callerAddress: bufferToHex(activity.caller_address),
        sessionStart: Number(activity.session_start),
        sessionEnd: Number(activity.session_end),
        actionCount: activity.action_count,
        actions: activity.actions,
        updatedAt: Number(activity.updated_at),
    };
}

export function mapActivitiesResponse(
    response: RetrieveActivitiesResponse
): ActivitiesPage {
    const nextCursor = response.next_cursor || undefined;
    return {
        items: response.activities.map(mapActivity),
        nextCursor,
        next_cursor: nextCursor,
    };
}

function mapAchievementTask(task: GrpcAchievementTask): AchievementTaskData {
    return {
        task_id: task.task_id,
        description: task.description,
        total: task.total,
        total_completions: task.total_completions,
        completion_rate: task.completion_rate,
        created_at: Number(task.created_at),
    };
}

function mapTaskProgress(task: GrpcTaskProgress): TaskProgressData {
    return {
        task_id: task.task_id,
        count: task.count,
        completed: task.completed,
    };
}

function mapPlayerAchievementStats(
    stats: GrpcPlayerAchievementStats
): PlayerAchievementStatsData {
    return {
        total_points: stats.total_points,
        completed_achievements: stats.completed_achievements,
        total_achievements: stats.total_achievements,
        completion_percentage: stats.completion_percentage,
        last_achievement_at: toOptionalNumber(stats.last_achievement_at),
        created_at: Number(stats.created_at),
        updated_at: Number(stats.updated_at),
    };
}

function mapAchievement(achievement?: GrpcAchievement): AchievementData {
    if (!achievement) {
        return {
            id: "",
            world_address: "0x0",
            namespace: "",
            entity_id: "",
            hidden: false,
            index: 0,
            points: 0,
            start: "",
            end: "",
            group: "",
            icon: "",
            title: "",
            description: "",
            tasks: [],
            data: "",
            total_completions: 0,
            completion_rate: 0,
            created_at: 0,
            updated_at: 0,
        };
    }

    return {
        id: achievement.id,
        world_address: bufferToHex(achievement.world_address),
        namespace: achievement.namespace,
        entity_id: achievement.entity_id,
        hidden: achievement.hidden,
        index: achievement.index,
        points: achievement.points,
        start: achievement.start,
        end: achievement.end,
        group: achievement.group,
        icon: achievement.icon,
        title: achievement.title,
        description: achievement.description,
        tasks: achievement.tasks.map(mapAchievementTask),
        data: achievement.data ?? "",
        total_completions: achievement.total_completions,
        completion_rate: achievement.completion_rate,
        created_at: Number(achievement.created_at),
        updated_at: Number(achievement.updated_at),
    };
}

function mapPlayerAchievementProgress(
    progress: GrpcPlayerAchievementProgress
): PlayerAchievementProgressData {
    return {
        achievement: mapAchievement(progress.achievement),
        task_progress: progress.taskProgress.map(mapTaskProgress),
        completed: progress.completed,
        progress_percentage: progress.progress_percentage,
    };
}

function mapPlayerAchievementEntry(
    entry: GrpcPlayerAchievementEntry
): PlayerAchievementEntryData {
    const stats = entry.stats
        ? mapPlayerAchievementStats(entry.stats)
        : {
              total_points: 0,
              completed_achievements: 0,
              total_achievements: 0,
              completion_percentage: 0,
              last_achievement_at: undefined,
              created_at: 0,
              updated_at: 0,
          };

    return {
        player_address: bufferToHex(entry.player_address),
        stats,
        achievements: entry.achievements.map(mapPlayerAchievementProgress),
    };
}

export function mapAchievementsResponse(
    response: RetrieveAchievementsResponse
): AchievementsPage {
    const nextCursor = response.next_cursor || undefined;
    return {
        items: response.achievements.map(mapAchievement),
        nextCursor,
        next_cursor: nextCursor,
    };
}

export function mapPlayerAchievementsResponse(
    response: RetrievePlayerAchievementsResponse
): PlayerAchievementsPage {
    const nextCursor = response.next_cursor || undefined;
    return {
        items: response.players.map(mapPlayerAchievementEntry),
        nextCursor,
        next_cursor: nextCursor,
    };
}

export function mapAchievementProgression(
    progression?: GrpcAchievementProgression
): AchievementProgressionView {
    if (!progression) {
        return {
            id: "",
            achievementId: "",
            taskId: "",
            worldAddress: "0x0",
            namespace: "",
            playerId: "0x0",
            count: 0,
            completed: false,
            completedAt: undefined,
            createdAt: 0,
            updatedAt: 0,
        };
    }

    return {
        id: progression.id,
        achievementId: progression.achievement_id,
        taskId: progression.task_id,
        worldAddress: bufferToHex(progression.world_address),
        namespace: progression.namespace,
        playerId: bufferToHex(progression.player_id),
        count: progression.count,
        completed: progression.completed,
        completedAt: toOptionalNumber(progression.completed_at),
        createdAt: Number(progression.created_at),
        updatedAt: Number(progression.updated_at),
    };
}

function mapSqlValue(value: GrpcSqlValue): SqlQueryScalar {
    if (!value.value_type || value.value_type.oneofKind === undefined) {
        return null;
    }

    switch (value.value_type.oneofKind) {
        case "text":
            return value.value_type.text;
        case "integer":
            return value.value_type.integer;
        case "real":
            return value.value_type.real;
        case "blob":
            return bufferToHex(value.value_type.blob);
        case "null":
            return null;
        default:
            return null;
    }
}

export function mapSqlQueryResponse(
    response: GrpcSqlQueryResponse
): ClientSqlQueryResponse {
    return response.rows.map((row) => {
        const mapped: Record<string, SqlQueryScalar> = {};
        for (const [column, value] of Object.entries(row.fields)) {
            mapped[column] = mapSqlValue(value);
        }
        return mapped;
    });
}
