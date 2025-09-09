import { ToriiGrpcClient } from "@dojoengine/grpc";
import type { GrpcClientInterface } from "./createSDK.js";

export interface InitGrpcOptions {
    toriiUrl?: string;
    worldAddress: string;
}

export function initGrpc(options: InitGrpcOptions): GrpcClientInterface {
    return new ToriiGrpcClient({
        toriiUrl: options.toriiUrl ?? "http://localhost:8080",
        worldAddress: options.worldAddress,
    });
}
