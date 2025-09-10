import type {
    Query as ToriiQuery,
    Clause as ToriiClause,
    Pagination as ToriiPagination,
    OrderBy as ToriiOrderBy,
    OrderDirection as ToriiOrderDirection,
    PaginationDirection as ToriiPaginationDirection,
    PatternMatching as ToriiPatternMatching,
    ComparisonOperator as ToriiComparisonOperator,
    LogicalOperator as ToriiLogicalOperator,
    ControllerQuery as ToriiControllerQuery,
    TokenQuery as ToriiTokenQuery,
    TokenBalanceQuery as ToriiTokenBalanceQuery,
    TransactionQuery as ToriiTransactionQuery,
    TransactionFilter as ToriiTransactionFilter,
    KeysClause as ToriiKeysClause,
} from "@dojoengine/torii-wasm";

import type {
    Query as GrpcQuery,
    Clause as GrpcClause,
    Pagination as GrpcPagination,
    OrderBy as GrpcOrderBy,
    KeysClause as GrpcKeysClause,
    HashedKeysClause as GrpcHashedKeysClause,
    MemberClause as GrpcMemberClause,
    CompositeClause as GrpcCompositeClause,
    MemberValue as GrpcMemberValue,
    ControllerQuery as GrpcControllerQuery,
    TokenQuery as GrpcTokenQuery,
    TokenBalanceQuery as GrpcTokenBalanceQuery,
    TransactionQuery as GrpcTransactionQuery,
    TransactionFilter as GrpcTransactionFilter,
    EventQuery as GrpcEventQuery,
    ContractQuery as GrpcContractQuery,
} from "../generated/types";

import {
    OrderDirection as GrpcOrderDirection,
    PaginationDirection as GrpcPaginationDirection,
    PatternMatching as GrpcPatternMatching,
    ComparisonOperator as GrpcComparisonOperator,
    LogicalOperator as GrpcLogicalOperator,
} from "../generated/types";

import type {
    RetrieveEntitiesRequest,
    RetrieveEventMessagesRequest,
    RetrieveTokensRequest,
    RetrieveTokenBalancesRequest,
    RetrieveTokenCollectionsRequest,
    RetrieveControllersRequest,
    RetrieveTransactionsRequest,
    RetrieveEventsRequest,
    RetrieveContractsRequest,
} from "../generated/world";

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

function mapOrderDirection(direction: ToriiOrderDirection): GrpcOrderDirection {
    switch (direction) {
        case "Asc":
            return GrpcOrderDirection.ASC;
        case "Desc":
            return GrpcOrderDirection.DESC;
        default:
            return GrpcOrderDirection.ASC;
    }
}

function mapPaginationDirection(
    direction: ToriiPaginationDirection
): GrpcPaginationDirection {
    switch (direction) {
        case "Forward":
            return GrpcPaginationDirection.FORWARD;
        case "Backward":
            return GrpcPaginationDirection.BACKWARD;
        default:
            return GrpcPaginationDirection.FORWARD;
    }
}

function mapOrderBy(orderBy: ToriiOrderBy): GrpcOrderBy {
    return {
        field: orderBy.field,
        direction: mapOrderDirection(orderBy.direction),
    };
}

function mapPagination(pagination: ToriiPagination): GrpcPagination {
    return {
        limit: pagination.limit || 0,
        cursor: pagination.cursor || "",
        direction: mapPaginationDirection(pagination.direction),
        order_by: pagination.order_by.map(mapOrderBy),
    };
}

function mapPatternMatching(
    pattern: ToriiPatternMatching
): GrpcPatternMatching {
    switch (pattern) {
        case "FixedLen":
            return GrpcPatternMatching.FixedLen;
        case "VariableLen":
            return GrpcPatternMatching.VariableLen;
        default:
            return GrpcPatternMatching.FixedLen;
    }
}

function mapComparisonOperator(
    op: ToriiComparisonOperator
): GrpcComparisonOperator {
    switch (op) {
        case "Eq":
            return GrpcComparisonOperator.EQ;
        case "Neq":
            return GrpcComparisonOperator.NEQ;
        case "Gt":
            return GrpcComparisonOperator.GT;
        case "Gte":
            return GrpcComparisonOperator.GTE;
        case "Lt":
            return GrpcComparisonOperator.LT;
        case "Lte":
            return GrpcComparisonOperator.LTE;
        case "In":
            return GrpcComparisonOperator.IN;
        case "NotIn":
            return GrpcComparisonOperator.NOT_IN;
        default:
            return GrpcComparisonOperator.EQ;
    }
}

function mapLogicalOperator(op: ToriiLogicalOperator): GrpcLogicalOperator {
    switch (op) {
        case "And":
            return GrpcLogicalOperator.AND;
        case "Or":
            return GrpcLogicalOperator.OR;
        default:
            return GrpcLogicalOperator.AND;
    }
}

function mapMemberValue(value: any): GrpcMemberValue {
    if (typeof value === "string") {
        return { value_type: { oneofKind: "string" as const, string: value } };
    } else if (Array.isArray(value)) {
        return {
            value_type: {
                oneofKind: "list" as const,
                list: { values: value.map(mapMemberValue) },
            },
        };
    } else if (value && typeof value === "object" && "Primitive" in value) {
        return {
            value_type: {
                oneofKind: "primitive" as const,
                primitive: value.Primitive,
            },
        };
    }
    // Fallback for primitive values
    return {
        value_type: { oneofKind: "string" as const, string: String(value) },
    };
}

export function mapClause(clause: ToriiClause): GrpcClause {
    if ("HashedKeys" in clause) {
        const hashedKeysClause: GrpcHashedKeysClause = {
            hashed_keys: clause.HashedKeys.map(hexToBuffer),
        };
        return {
            clause_type: {
                oneofKind: "hashed_keys" as const,
                hashed_keys: hashedKeysClause,
            },
        };
    } else if ("Keys" in clause) {
        const keysClause: GrpcKeysClause = {
            keys: clause.Keys.keys.map((k) =>
                k ? hexToBuffer(k) : new Uint8Array()
            ),
            pattern_matching: mapPatternMatching(clause.Keys.pattern_matching),
            models: clause.Keys.models,
        };
        return {
            clause_type: { oneofKind: "keys" as const, keys: keysClause },
        };
    } else if ("Member" in clause) {
        const memberClause: GrpcMemberClause = {
            model: clause.Member.model,
            member: clause.Member.member,
            operator: mapComparisonOperator(clause.Member.operator),
            value: mapMemberValue(clause.Member.value),
        };
        return {
            clause_type: { oneofKind: "member" as const, member: memberClause },
        };
    } else if ("Composite" in clause) {
        const compositeClause: GrpcCompositeClause = {
            operator: mapLogicalOperator(clause.Composite.operator),
            clauses: clause.Composite.clauses.map(mapClause),
        };
        return {
            clause_type: {
                oneofKind: "composite" as const,
                composite: compositeClause,
            },
        };
    }

    throw new Error("Unknown clause type");
}

export function mapQuery(query: ToriiQuery): GrpcQuery {
    return {
        pagination: mapPagination(query.pagination),
        clause: query.clause ? mapClause(query.clause) : undefined,
        no_hashed_keys: query.no_hashed_keys,
        models: query.models,
        historical: query.historical,
    };
}

export function mapControllerQuery(
    query: ToriiControllerQuery
): GrpcControllerQuery {
    return {
        contract_addresses: query.contract_addresses.map(hexToBuffer),
        usernames: query.usernames,
        pagination: mapPagination(query.pagination),
    };
}

export function mapTokenQuery(query: ToriiTokenQuery): GrpcTokenQuery {
    return {
        contract_addresses: query.contract_addresses.map(hexToBuffer),
        token_ids: query.token_ids.map(hexToBuffer),
        pagination: mapPagination(query.pagination),
    };
}

export function mapTokenBalanceQuery(
    query: ToriiTokenBalanceQuery
): GrpcTokenBalanceQuery {
    return {
        contract_addresses: query.contract_addresses.map(hexToBuffer),
        account_addresses: query.account_addresses.map(hexToBuffer),
        token_ids: query.token_ids.map(hexToBuffer),
        pagination: mapPagination(query.pagination),
    };
}

export function mapTransactionFilter(
    filter: ToriiTransactionFilter
): GrpcTransactionFilter {
    return {
        transaction_hashes: filter.transaction_hashes.map(hexToBuffer),
        caller_addresses: filter.caller_addresses.map(hexToBuffer),
        contract_addresses: filter.contract_addresses.map(hexToBuffer),
        entrypoints: filter.entrypoints,
        model_selectors: filter.model_selectors.map(hexToBuffer),
        from_block: filter.from_block ? BigInt(filter.from_block) : undefined,
        to_block: filter.to_block ? BigInt(filter.to_block) : undefined,
    };
}

export function mapTransactionQuery(
    query: ToriiTransactionQuery
): GrpcTransactionQuery {
    return {
        filter: query.filter ? mapTransactionFilter(query.filter) : undefined,
        pagination: mapPagination(query.pagination),
    };
}

export function createRetrieveEntitiesRequest(
    query: ToriiQuery
): RetrieveEntitiesRequest {
    return {
        query: mapQuery(query),
    };
}

export function createRetrieveEventMessagesRequest(
    query: ToriiQuery
): RetrieveEventMessagesRequest {
    return {
        query: mapQuery(query),
    };
}

export function createRetrieveTokensRequest(
    query: ToriiTokenQuery
): RetrieveTokensRequest {
    return {
        query: mapTokenQuery(query),
    };
}

export function createRetrieveTokenBalancesRequest(
    query: ToriiTokenBalanceQuery
): RetrieveTokenBalancesRequest {
    return {
        query: mapTokenBalanceQuery(query),
    };
}

export function createRetrieveTokenCollectionsRequest(
    query: ToriiTokenBalanceQuery
): RetrieveTokenCollectionsRequest {
    return {
        query: mapTokenBalanceQuery(query),
    };
}

export function createRetrieveControllersRequest(
    query: ToriiControllerQuery
): RetrieveControllersRequest {
    return {
        query: mapControllerQuery(query),
    };
}

export function createRetrieveTransactionsRequest(
    query: ToriiTransactionQuery
): RetrieveTransactionsRequest {
    return {
        query: mapTransactionQuery(query),
    };
}

export function createRetrieveEventsRequest(query: {
    keys?: ToriiKeysClause;
    pagination?: ToriiPagination;
}): RetrieveEventsRequest {
    return {
        query: {
            keys: query.keys
                ? {
                      keys: query.keys.keys.map((k) =>
                          k ? hexToBuffer(k) : new Uint8Array()
                      ),
                      pattern_matching:
                          query.keys.pattern_matching === "FixedLen"
                              ? GrpcPatternMatching.FixedLen
                              : GrpcPatternMatching.VariableLen,
                      models: query.keys.models || [],
                  }
                : undefined,
            pagination: query.pagination
                ? mapPagination(query.pagination)
                : undefined,
        },
    };
}

export function createRetrieveContractsRequest(query: {
    contract_addresses?: string[];
    contract_types?: any[];
}): RetrieveContractsRequest {
    return {
        query: {
            contract_addresses:
                query.contract_addresses?.map(hexToBuffer) || [],
            contract_types: query.contract_types || [],
        },
    };
}
