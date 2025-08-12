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
    transformEntitiesResponse,
    transformControllersResponse,
    transformTokensResponse,
    transformTokenBalancesResponse,
    transformTokenCollectionsResponse,
    transformTransactionsResponse,
    transformIndexerUpdate,
    transformMessage,
    transformTransaction,
    transformEntity,
    transformToken,
    transformTokenBalance,
} from "./mappings/effect-schema/transformers";

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

import { Schema } from "effect";
import { BufferToHex } from "./mappings/effect-schema/base-schemas";

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
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

export class ToriiGrpcClientEffect {
    private client: DojoGrpcClient;
    private nextSubscriptionId = 1n;
    private subscriptions = new Map<bigint, ToriiSubscription>();

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

        const subscription: ToriiSubscription = {
            id: subscriptionId,
            stream: stream as ServerStreamingCall<object, object>,
            cancel: () => {
                this.subscriptions.delete(subscriptionId);
            },
        };

        this.subscriptions.set(subscriptionId, subscription);

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
        return transformControllersResponse(response);
    }

    async getTransactions(query: TransactionQuery): Promise<Transactions> {
        const request = createRetrieveTransactionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTransactions(request)
                .response;
        return transformTransactionsResponse(response);
    }

    async getTokens(query: TokenQuery): Promise<Tokens> {
        const request = createRetrieveTokensRequest(query);
        const response =
            await this.client.worldClient.retrieveTokens(request).response;
        return transformTokensResponse(response);
    }

    async getTokenBalances(query: TokenBalanceQuery): Promise<TokenBalances> {
        const request = createRetrieveTokenBalancesRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenBalances(request)
                .response;
        return transformTokenBalancesResponse(response);
    }

    async getTokenCollections(
        query: TokenBalanceQuery
    ): Promise<TokenCollections> {
        const request = createRetrieveTokenCollectionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenCollections(request)
                .response;
        return transformTokenCollectionsResponse(response);
    }

    async getEntities(query: Query): Promise<Entities> {
        const request = createRetrieveEntitiesRequest(query);
        const response =
            await this.client.worldClient.retrieveEntities(request).response;
        return transformEntitiesResponse(response);
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
        return transformEntitiesResponse(response);
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
                    callback(transformTransaction(response.transaction));
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
                    callback(transformToken(response.token));
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
                        transformEntity(response.entity),
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
                        transformEntity(response.entity),
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
                        keys: response.event.keys.map((k) =>
                            Schema.decodeSync(BufferToHex)(k)
                        ),
                        data: response.event.data.map((d) =>
                            Schema.decodeSync(BufferToHex)(d)
                        ),
                        transaction_hash: Schema.decodeSync(BufferToHex)(
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
                callback(transformIndexerUpdate(response));
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
                        transformTokenBalance(response.balance),
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
        const request = transformMessage(message);
        const response =
            await this.client.worldClient.publishMessage(request).response;
        return Schema.decodeSync(BufferToHex)(response.entity_id);
    }

    async publishMessageBatch(messages: Message[]): Promise<string[]> {
        const request: PublishMessageBatchRequest = {
            messages: messages.map(transformMessage),
        };
        const response =
            await this.client.worldClient.publishMessageBatch(request).response;
        return response.responses.map((r) =>
            Schema.decodeSync(BufferToHex)(r.entity_id)
        );
    }

    private findSubscription(
        subscription: GrpcSubscription
    ): ToriiSubscription | undefined {
        return this.subscriptions.get(subscription.id);
    }

    destroy() {
        for (const [_, subscription] of this.subscriptions) {
            subscription.cancel();
        }
        this.subscriptions.clear();
        this.client.destroy();
    }
}
