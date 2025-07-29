import type {
    ClientConfig,
    Entities,
    Controllers,
    ControllerQuery,
    TokenQuery,
    Tokens,
    TokenBalanceQuery,
    TokenBalances,
    TokenCollections,
    Query,
    Clause,
    Transactions,
    TransactionQuery,
    TransactionFilter,
    KeysClause,
    Message,
    WasmU256,
} from "@dojoengine/torii-wasm";

import type { KeysClause as GrpcKeysClause } from "./generated/types";

import { PatternMatching as GrpcPatternMatching } from "./generated/types";

import {
    createRetrieveEntitiesRequest,
    createRetrieveEventMessagesRequest,
    createRetrieveTokensRequest,
    createRetrieveTokenBalancesRequest,
    createRetrieveTokenCollectionsRequest,
    createRetrieveControllersRequest,
    createRetrieveTransactionsRequest,
    mapTransactionFilter,
    mapClause,
} from "./mappings/query";

import {
    mapEntitiesResponse,
    mapControllersResponse,
    mapTokensResponse,
    mapTokenBalancesResponse,
    mapTokenCollectionsResponse,
    mapTransactionsResponse,
    mapIndexerUpdate,
    mapMessage,
    mapTransaction,
    mapEntity,
    mapToken,
    mapTokenBalance,
} from "./mappings/types";

import { DojoGrpcClient } from "./client";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type {
    SubscribeEntityResponse,
    SubscribeTransactionsResponse,
    SubscribeTokensResponse,
    SubscribeTokenBalancesResponse,
    SubscribeEventsResponse,
    SubscribeIndexerResponse,
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

interface GrpcSubscription {
    id: number;
    stream: ServerStreamingCall<object, object>;
    cancel: () => void;
}

class Subscription {
    private _subscription: GrpcSubscription;

    constructor(subscription: GrpcSubscription) {
        this._subscription = subscription;
    }

    cancel() {
        this._subscription.cancel();
    }

    get id(): number {
        return this._subscription.id;
    }
}

interface StreamHandlerOptions<TReq extends object, TRes extends object> {
    createStream: () => ServerStreamingCall<TReq, TRes>;
    onMessage: (response: TRes) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
}

export class ToriiGrpcClient {
    private client: DojoGrpcClient;
    private nextSubscriptionId = 1;
    private subscriptions = new Map<number, GrpcSubscription>();

    constructor(config: ClientConfig) {
        this.client = new DojoGrpcClient({
            url: config.toriiUrl,
        });
    }

    private createStreamSubscription<TReq extends object, TRes extends object>(
        options: StreamHandlerOptions<TReq, TRes>
    ): Subscription {
        const subscriptionId = this.nextSubscriptionId++;
        const stream = options.createStream();

        const subscription: GrpcSubscription = {
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
        return mapControllersResponse(response);
    }

    async getTransactions(query: TransactionQuery): Promise<Transactions> {
        const request = createRetrieveTransactionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTransactions(request)
                .response;
        return mapTransactionsResponse(response);
    }

    async getTokens(query: TokenQuery): Promise<Tokens> {
        const request = createRetrieveTokensRequest(query);
        const response =
            await this.client.worldClient.retrieveTokens(request).response;
        return mapTokensResponse(response);
    }

    async getTokenBalances(query: TokenBalanceQuery): Promise<TokenBalances> {
        const request = createRetrieveTokenBalancesRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenBalances(request)
                .response;
        return mapTokenBalancesResponse(response);
    }

    async getTokenCollections(
        query: TokenBalanceQuery
    ): Promise<TokenCollections> {
        const request = createRetrieveTokenCollectionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenCollections(request)
                .response;
        return mapTokenCollectionsResponse(response);
    }

    async getEntities(query: Query): Promise<Entities> {
        const request = createRetrieveEntitiesRequest(query);
        const response =
            await this.client.worldClient.retrieveEntities(request).response;
        return mapEntitiesResponse(response);
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
        return mapEntitiesResponse(response);
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
                    callback(mapTransaction(response.transaction));
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
                    callback(mapToken(response.token));
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
                        mapEntity(response.entity),
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
                        mapEntity(response.entity),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateEventMessageSubscription(
        subscription: Subscription,
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
                    callback({
                        keys: response.event.keys.map(bufferToHex),
                        data: response.event.data.map(bufferToHex),
                        transaction_hash: bufferToHex(
                            response.event.transaction_hash
                        ),
                    });
                }
            },
        });
    }

    async onIndexerUpdated(
        contract_address: string | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeIndexer({
                    contract_address: contract_address
                        ? hexToBuffer(contract_address)
                        : new Uint8Array(),
                }),
            onMessage: (response: SubscribeIndexerResponse) => {
                callback(mapIndexerUpdate(response));
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
                        mapTokenBalance(response.balance),
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
        const request = mapMessage(message);
        const response =
            await this.client.worldClient.publishMessage(request).response;
        return bufferToHex(response.entity_id);
    }

    async publishMessageBatch(messages: Message[]): Promise<string[]> {
        const request: PublishMessageBatchRequest = {
            messages: messages.map(mapMessage),
        };
        const response =
            await this.client.worldClient.publishMessageBatch(request).response;
        return response.responses.map((r) => bufferToHex(r.entity_id));
    }

    private findSubscription(
        subscription: Subscription
    ): GrpcSubscription | undefined {
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
