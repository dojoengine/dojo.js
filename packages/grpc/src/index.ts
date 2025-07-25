export * from "./client";

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
    TokenCollection,
    TokenBalance,
    OrderBy,
    Controller,
    Pagination,
    ControllerQuery,
    TokenQuery,
    TokenBalanceQuery,
    TransactionCall,
    Transaction,
    TransactionFilter,
    TransactionQuery,
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
} from "./generated/types";

// Re-export world proto types (excluding the World service)
export type {
    SubscribeTransactionsRequest,
    SubscribeTransactionsResponse,
    RetrieveControllersRequest,
    RetrieveControllersResponse,
    UpdateTokenBalancesSubscriptionRequest,
    SubscribeTokenBalancesResponse,
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
    RetrieveTokenCollectionsRequest,
    RetrieveTokenCollectionsResponse,
    SubscribeIndexerRequest,
    SubscribeIndexerResponse,
    WorldMetadataRequest,
    WorldMetadataResponse,
    SubscribeEntitiesRequest,
    SubscribeEventMessagesRequest,
    UpdateEntitiesSubscriptionRequest,
    UpdateEventMessagesSubscriptionRequest,
    SubscribeEntityResponse,
    RetrieveEntitiesRequest,
    RetrieveEventMessagesRequest,
    RetrieveEntitiesResponse,
    RetrieveEventsRequest,
    RetrieveEventsResponse,
    SubscribeEventsRequest,
    SubscribeEventsResponse,
    PublishMessageRequest,
    PublishMessageResponse,
    PublishMessageBatchRequest,
    PublishMessageBatchResponse,
} from "./generated/world";

// Re-export World types with aliases to avoid conflicts
export { World as WorldMessage } from "./generated/types";
export { World as WorldService } from "./generated/world";

// Re-export gRPC-Web client
export { WorldClient } from "./generated/world.client";
