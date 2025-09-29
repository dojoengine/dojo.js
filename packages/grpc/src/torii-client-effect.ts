import type { ClientConfig } from "@dojoengine/torii-wasm";

import {
    ToriiGrpcClient,
    type ToriiGrpcClientConfig,
    Subscription,
} from "./torii-client";

export { Subscription } from "./torii-client";

export class ToriiGrpcClientEffect extends ToriiGrpcClient {
    constructor(
        config: ClientConfig &
            Partial<Omit<ToriiGrpcClientConfig, keyof ClientConfig>>
    ) {
        super({ ...config, useEffectSchema: true });
    }
}
