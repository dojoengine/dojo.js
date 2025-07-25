import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { WorldClient } from "./generated/world.client";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";

export interface DojoGrpcClientConfig {
    url: string;
    options?: RpcOptions;
}

export class DojoGrpcClient {
    private transport: GrpcWebFetchTransport;
    public worldClient: WorldClient;

    constructor(config: DojoGrpcClientConfig) {
        this.transport = new GrpcWebFetchTransport({
            baseUrl: config.url,
            format: "binary",
        });

        this.worldClient = new WorldClient(this.transport);
    }

    destroy() {
        // Clean up any resources if needed
    }
}

export function createDojoGrpcClient(
    config: DojoGrpcClientConfig
): DojoGrpcClient {
    return new DojoGrpcClient(config);
}
