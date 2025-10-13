export * from "./client";
export * from "./torii-client";

// Re-export generated protobuf types
export * from "./generated/schema";

// Re-export types from types.proto (excluding the conflicting World)
export type {
    Model,
    Entity,
    Event,
    Query,
    EventQuery,
    Clause,
    KeysClause,
    HashedKeysClause,
    MemberValue,
    MemberValueList,
    MemberClause,
    CompositeClause,
    Token,
    TokenContract,
    TokenBalance,
    TokenTransfer,
    OrderBy,
    Controller,
    Pagination,
    ControllerQuery,
    TokenQuery,
    TokenBalanceQuery,
    TokenTransferQuery,
    TransactionCall,
    Transaction,
    TransactionFilter,
    TransactionQuery,
    Contract,
    ContractQuery,
    // World is intentionally excluded to avoid conflict
} from "./generated/types";

// Re-export enums from types
export {
    PatternMatching,
    LogicalOperator,
    ComparisonOperator,
    OrderDirection,
    CallType,
    PaginationDirection,
    ContractType,
} from "./generated/types";

// Re-export world proto types (excluding the World service)
export type {
    SubscribeTransactionsRequest,
    SubscribeTransactionsResponse,
    RetrieveControllersRequest,
    RetrieveControllersResponse,
    UpdateTokenBalancesSubscriptionRequest,
    UpdateTokenTransfersSubscriptionRequest,
    SubscribeTokenBalancesResponse,
    SubscribeTokenTransfersRequest,
    SubscribeTokenTransfersResponse,
    RetrieveTokensRequest,
    SubscribeTokensRequest,
    RetrieveTokensResponse,
    SubscribeTokensResponse,
    UpdateTokenSubscriptionRequest,
    RetrieveTokenBalancesRequest,
    SubscribeTokenBalancesRequest,
    RetrieveTokenBalancesResponse,
    RetrieveTransactionsRequest,
    RetrieveTransactionsResponse,
    RetrieveTokenContractsRequest,
    RetrieveTokenContractsResponse,
    RetrieveTokenTransfersRequest,
    RetrieveTokenTransfersResponse,
    RetrieveContractsRequest,
    RetrieveContractsResponse,
    SubscribeContractsRequest,
    SubscribeContractsResponse,
    WorldsRequest,
    WorldsResponse,
    SubscribeEntitiesRequest,
    UpdateEntitiesSubscriptionRequest,
    SubscribeEntityResponse,
    RetrieveEntitiesRequest,
    RetrieveEntitiesResponse,
    RetrieveEventsRequest,
    RetrieveEventsResponse,
    SubscribeEventsRequest,
    SubscribeEventsResponse,
    PublishMessageRequest,
    PublishMessageResponse,
    PublishMessageBatchRequest,
    PublishMessageBatchResponse,
    RetrieveAggregationsRequest,
    RetrieveAggregationsResponse,
    SubscribeAggregationsRequest,
    SubscribeAggregationsResponse,
    UpdateAggregationsSubscriptionRequest,
    UpdateAggregationsSubscriptionResponse,
    RetrieveActivitiesRequest,
    RetrieveActivitiesResponse,
    SubscribeActivitiesRequest,
    SubscribeActivitiesResponse,
    UpdateActivitiesSubscriptionRequest,
} from "./generated/world";

export type {
    AggregationQueryInput,
    AggregationsPage,
    AggregationEntryView,
    ActivityQueryInput,
    ActivitySubscriptionQuery,
    ActivitiesPage,
    ActivityEntry,
    SqlQueryResponse,
    SqlQueryRow,
    SqlQueryScalar,
    SqlIntegerValue,
    AchievementQueryInput,
    PlayerAchievementQueryInput,
    AchievementsPage,
    PlayerAchievementsPage,
    AchievementProgressionView,
    AchievementProgressionSubscriptionQuery,
} from "./types";

// Re-export World types with aliases to avoid conflicts
export { World as WorldMessage } from "./generated/types";
export { World as WorldService } from "./generated/world";

// Re-export gRPC-Web client
export { WorldClient } from "./generated/world.client";
