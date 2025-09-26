import type {
    ClientConfig,
    Entities,
    Controllers,
    ControllerQuery,
    TokenQuery,
    Tokens,
    TokenBalanceQuery,
    TokenBalances,
    TokenContracts,
    Query,
    Clause,
    Transactions,
    TransactionQuery,
    TransactionFilter,
    KeysClause,
    Message,
    WasmU256,
    Pagination,
    TokenContractQuery,
} from "@dojoengine/torii-wasm";

import type { KeysClause as GrpcKeysClause } from "./generated/types";

import {
    PatternMatching as GrpcPatternMatching,
    ContractType,
} from "./generated/types";

import {
    createRetrieveEntitiesRequest,
    createRetrieveEventMessagesRequest,
    createRetrieveTokensRequest,
    createRetrieveTokenBalancesRequest,
    createRetrieveTokenContractsRequest,
    createRetrieveControllersRequest,
    createRetrieveTransactionsRequest,
    createRetrieveEventsRequest,
    createRetrieveContractsRequest,
    mapTransactionFilter,
    mapClause,
} from "./mappings/query";

import {
    mapEntitiesResponse,
    mapControllersResponse,
    mapTokensResponse,
    mapTokenBalancesResponse,
    mapTokenContractsResponse,
    mapTransactionsResponse,
    mapIndexerUpdate,
    mapMessage,
    mapTransaction,
    mapEntity,
    mapToken,
    mapTokenBalance,
    mapEventsResponse,
    mapContractsResponse,
    mapWorldMetadataResponse,
    mapEvent,
    mapContract,
} from "./mappings/types";

import {
    transformEntitiesResponse,
    transformControllersResponse,
    transformTokensResponse,
    transformTokenBalancesResponse,
    transformTokenContractsResponse,
    transformTransactionsResponse,
    transformIndexerUpdate,
    transformMessage,
    transformTransaction,
    transformEntity,
    transformToken,
    transformTokenBalance,
    transformEventsResponse,
    transformContractsResponse,
    transformWorldMetadataResponse,
    transformEvent,
    transformContract,
} from "./mappings/effect-schema/transformers";

import { Schema } from "effect";
import { BufferToHex } from "./mappings/effect-schema/base-schemas";

import { DojoGrpcClient } from "./client";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type {
    SubscribeEntityResponse,
    SubscribeTransactionsResponse,
    SubscribeTokensResponse,
    SubscribeTokenBalancesResponse,
    SubscribeEventsResponse,
    SubscribeContractsResponse,
    PublishMessageBatchRequest,
} from "./generated/world";

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

function bufferToHex(buffer: Uint8Array): string {
    return (
        "0x" +
        Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
    );
}

interface ToriiSubscription {
    id: bigint;
    stream: ServerStreamingCall<object, object>;
    cancel: () => void;
}

type GrpcSubscription = {
    id: bigint;
    cancel: () => void;
    free: () => void;
};

export class Subscription {
    private _subscription: ToriiSubscription;

    constructor(subscription: ToriiSubscription) {
        this._subscription = subscription;
    }

    cancel() {
        this._subscription.cancel();
    }

    free() {
        this._subscription.cancel();
    }

    get id(): bigint {
        return this._subscription.id;
    }
}

interface StreamHandlerOptions<TReq extends object, TRes extends object> {
    createStream: () => ServerStreamingCall<TReq, TRes>;
    onMessage: (response: TRes) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
}

export interface ToriiGrpcClientConfig extends ClientConfig {
    useEffectSchema?: boolean;
}

export class ToriiGrpcClient {
    private client: DojoGrpcClient;
    private nextSubscriptionId = 1n;
    private subscriptions = new Map<bigint, ToriiSubscription>();
    private useEffectSchema: boolean;
    private mappers: {
        entitiesResponse: (response: any) => any;
        controllersResponse: (response: any) => any;
        tokensResponse: (response: any) => any;
        tokenBalancesResponse: (response: any) => any;
        tokenContractsResponse: (response: any) => any;
        transactionsResponse: (response: any) => any;
        indexerUpdate: (response: any) => any;
        message: (message: any) => any;
        transaction: (tx: any) => any;
        entity: (entity: any) => any;
        token: (token: any) => any;
        tokenBalance: (balance: any) => any;
        eventsResponse: (response: any) => any;
        contractsResponse: (response: any) => any;
        worldMetadataResponse: (response: any) => any;
        event: (event: any) => any;
        contract: (contract: any) => any;
    };

    constructor(config: ToriiGrpcClientConfig) {
        this.client = new DojoGrpcClient({
            url: config.toriiUrl,
        });
        this.useEffectSchema = config.useEffectSchema ?? false;

        // Initialize mappers based on schema preference
        this.mappers = this.useEffectSchema
            ? {
                  entitiesResponse: transformEntitiesResponse,
                  controllersResponse: transformControllersResponse,
                  tokensResponse: transformTokensResponse,
                  tokenBalancesResponse: transformTokenBalancesResponse,
                  tokenContractsResponse: transformTokenContractsResponse,
                  transactionsResponse: transformTransactionsResponse,
                  indexerUpdate: transformIndexerUpdate,
                  message: transformMessage,
                  transaction: transformTransaction,
                  entity: transformEntity,
                  token: transformToken,
                  tokenBalance: transformTokenBalance,
                  eventsResponse: transformEventsResponse,
                  contractsResponse: transformContractsResponse,
                  worldMetadataResponse: transformWorldMetadataResponse,
                  event: transformEvent,
                  contract: transformContract,
              }
            : {
                  entitiesResponse: mapEntitiesResponse,
                  controllersResponse: mapControllersResponse,
                  tokensResponse: mapTokensResponse,
                  tokenBalancesResponse: mapTokenBalancesResponse,
                  tokenContractsResponse: mapTokenContractsResponse,
                  transactionsResponse: mapTransactionsResponse,
                  indexerUpdate: mapIndexerUpdate,
                  message: mapMessage,
                  transaction: mapTransaction,
                  entity: mapEntity,
                  token: mapToken,
                  tokenBalance: mapTokenBalance,
                  eventsResponse: mapEventsResponse,
                  contractsResponse: mapContractsResponse,
                  worldMetadataResponse: mapWorldMetadataResponse,
                  event: mapEvent,
                  contract: mapContract,
              };
    }

    private createStreamSubscription<TReq extends object, TRes extends object>(
        options: StreamHandlerOptions<TReq, TRes>
    ): Subscription {
        const subscriptionId = this.nextSubscriptionId++;
        const stream = options.createStream();

        const subscription: ToriiSubscription = {
            id: subscriptionId,
            stream: stream as ServerStreamingCall<object, object>,
            cancel: () => {
                // ServerStreamingCall doesn't have a cancel method, so we just clean up
                this.subscriptions.delete(subscriptionId);
            },
        };

        this.subscriptions.set(subscriptionId, subscription);

        // Set up stream event handlers
        stream.responses.onMessage(options.onMessage);

        if (options.onError) {
            stream.responses.onError(options.onError);
        } else {
            stream.responses.onError((error) => {
                console.error(
                    `Stream error (subscription ${subscriptionId}):`,
                    error
                );
            });
        }

        if (options.onComplete) {
            stream.responses.onComplete(options.onComplete);
        } else {
            stream.responses.onComplete(() => {
                this.subscriptions.delete(subscriptionId);
            });
        }

        return new Subscription(subscription);
    }

    async getControllers(query: ControllerQuery): Promise<Controllers> {
        const request = createRetrieveControllersRequest(query);
        const response =
            await this.client.worldClient.retrieveControllers(request).response;
        return this.mappers.controllersResponse(response);
    }

    async getTransactions(query: TransactionQuery): Promise<Transactions> {
        const request = createRetrieveTransactionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTransactions(request)
                .response;
        return this.mappers.transactionsResponse(response);
    }

    async getTokens(query: TokenQuery): Promise<Tokens> {
        const request = createRetrieveTokensRequest(query);
        const response =
            await this.client.worldClient.retrieveTokens(request).response;
        return this.mappers.tokensResponse(response);
    }

    async getTokenBalances(query: TokenBalanceQuery): Promise<TokenBalances> {
        const request = createRetrieveTokenBalancesRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenBalances(request)
                .response;
        return this.mappers.tokenBalancesResponse(response);
    }

    async getTokenContracts(
        query: TokenContractQuery
    ): Promise<TokenContracts> {
        const request = createRetrieveTokenContractsRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenContracts(request)
                .response;
        return this.mappers.tokenContractsResponse(response);
    }

    async getEntities(query: Query): Promise<Entities> {
        const request = createRetrieveEntitiesRequest(query);
        const response =
            await this.client.worldClient.retrieveEntities(request).response;
        return this.mappers.entitiesResponse(response);
    }

    async getAllEntities(
        limit: number,
        cursor?: string | null
    ): Promise<Entities> {
        const query: Query = {
            pagination: {
                limit,
                cursor: cursor || undefined,
                direction: "Forward",
                order_by: [],
            },
            clause: undefined,
            no_hashed_keys: true,
            models: [],
            historical: false,
        };
        return this.getEntities(query);
    }

    async getEventMessages(query: Query): Promise<Entities> {
        const request = createRetrieveEventMessagesRequest(query);
        const response =
            await this.client.worldClient.retrieveEventMessages(request)
                .response;
        return this.mappers.entitiesResponse(response);
    }

    async onTransaction(
        filter: TransactionFilter | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTransactions({
                    filter: filter ? mapTransactionFilter(filter) : undefined,
                }),
            onMessage: (response: SubscribeTransactionsResponse) => {
                if (response.transaction) {
                    callback(this.mappers.transaction(response.transaction));
                }
            },
        });
    }

    async onTokenUpdated(
        contract_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTokens({
                    contract_addresses:
                        contract_addresses?.map(hexToBuffer) || [],
                    token_ids: token_ids?.map(hexToBuffer) || [],
                }),
            onMessage: (response: SubscribeTokensResponse) => {
                if (response.token) {
                    callback(this.mappers.token(response.token));
                }
            },
        });
    }

    async onEntityUpdated(
        clause: Clause | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEntities({
                    clause: clause ? mapClause(clause) : undefined,
                }),
            onMessage: (response: SubscribeEntityResponse) => {
                if (response.entity) {
                    callback(
                        this.mappers.entity(response.entity),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateEntitySubscription(
        subscription: Subscription,
        clause?: Clause | null
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateEntitiesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            clause: clause ? mapClause(clause) : undefined,
        }).response;
    }

    async onEventMessageUpdated(
        clause: Clause | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEventMessages({
                    clause: clause ? mapClause(clause) : undefined,
                }),
            onMessage: (response: SubscribeEntityResponse) => {
                if (response.entity) {
                    callback(
                        this.mappers.entity(response.entity),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateEventMessageSubscription(
        subscription: GrpcSubscription,
        clause?: Clause | null
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateEventMessagesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            clause: clause ? mapClause(clause) : undefined,
        }).response;
    }

    async onStarknetEvent(
        clauses: KeysClause[],
        callback: Function
    ): Promise<Subscription> {
        // Map KeysClause[] to a single clause
        const grpcClauses: GrpcKeysClause[] = clauses.map((clause) => ({
            keys: clause.keys.map((k) =>
                k ? hexToBuffer(k) : new Uint8Array()
            ),
            pattern_matching:
                clause.pattern_matching === "FixedLen"
                    ? GrpcPatternMatching.FixedLen
                    : GrpcPatternMatching.VariableLen,
            models: clause.models,
        }));

        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEvents({
                    keys: grpcClauses,
                }),
            onMessage: (response: SubscribeEventsResponse) => {
                if (response.event) {
                    const hexConverter = this.useEffectSchema
                        ? (buffer: Uint8Array) =>
                              Schema.decodeSync(BufferToHex)(buffer)
                        : bufferToHex;

                    callback({
                        keys: response.event.keys.map(hexConverter),
                        data: response.event.data.map(hexConverter),
                        transaction_hash: hexConverter(
                            response.event.transaction_hash
                        ),
                    });
                }
            },
        });
    }

    async onTokenBalanceUpdated(
        contract_addresses: string[] | null | undefined,
        account_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTokenBalances({
                    contract_addresses:
                        contract_addresses?.map(hexToBuffer) || [],
                    account_addresses:
                        account_addresses?.map(hexToBuffer) || [],
                    token_ids: token_ids?.map(hexToBuffer) || [],
                }),
            onMessage: (response: SubscribeTokenBalancesResponse) => {
                if (response.balance) {
                    callback(
                        this.mappers.tokenBalance(response.balance),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateTokenBalanceSubscription(
        subscription: Subscription,
        contract_addresses: string[],
        account_addresses: string[],
        token_ids: WasmU256[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateTokenBalancesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            contract_addresses: contract_addresses.map(hexToBuffer),
            account_addresses: account_addresses.map(hexToBuffer),
            token_ids: token_ids.map(hexToBuffer),
        }).response;
    }

    async publishMessage(message: Message): Promise<string> {
        const request = this.mappers.message(message);
        const response =
            await this.client.worldClient.publishMessage(request).response;
        return this.useEffectSchema
            ? Schema.decodeSync(BufferToHex)(response.entity_id)
            : bufferToHex(response.entity_id);
    }

    async publishMessageBatch(messages: Message[]): Promise<string[]> {
        const request: PublishMessageBatchRequest = {
            messages: messages.map(this.mappers.message),
        };
        const response =
            await this.client.worldClient.publishMessageBatch(request).response;
        const hexConverter = this.useEffectSchema
            ? (buffer: Uint8Array) => Schema.decodeSync(BufferToHex)(buffer)
            : bufferToHex;
        return response.responses.map((r) => hexConverter(r.entity_id));
    }

    async getWorldMetadata(): Promise<any> {
        const response = await this.client.worldClient.worldMetadata({})
            .response;
        return this.mappers.worldMetadataResponse(response);
    }

    async getEvents(query: {
        keys?: KeysClause;
        pagination?: Pagination;
    }): Promise<any> {
        const request = createRetrieveEventsRequest(query);
        const response =
            await this.client.worldClient.retrieveEvents(request).response;
        return this.mappers.eventsResponse(response);
    }

    async getContracts(query?: {
        contract_addresses?: string[];
        contract_types?: ContractType[];
    }): Promise<any> {
        const request = createRetrieveContractsRequest(query || {});
        const response =
            await this.client.worldClient.retrieveContracts(request).response;
        return this.mappers.contractsResponse(response);
    }

    async updateTokensSubscription(
        subscription: Subscription,
        contractAddresses?: string[],
        tokenIds?: WasmU256[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateTokensSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            contract_addresses: contractAddresses?.map(hexToBuffer) || [],
            token_ids: tokenIds?.map(hexToBuffer) || [],
        }).response;
    }

    async onContractsUpdated(
        query: {
            contract_addresses?: string[];
            contract_types?: ContractType[];
        },
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeContracts({
                    query: {
                        contract_addresses:
                            query.contract_addresses?.map(hexToBuffer) || [],
                        contract_types: query.contract_types || [],
                    },
                }),
            onMessage: (response: SubscribeContractsResponse) => {
                if (response.contract) {
                    callback(this.mappers.contract(response.contract));
                }
            },
        });
    }

    private findSubscription(
        subscription: GrpcSubscription
    ): ToriiSubscription | undefined {
        return this.subscriptions.get(subscription.id);
    }

    destroy() {
        // Cancel all active subscriptions
        for (const [_, subscription] of this.subscriptions) {
            subscription.cancel();
        }
        this.subscriptions.clear();

        // Destroy the underlying client
        this.client.destroy();
    }
}
