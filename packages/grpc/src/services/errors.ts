import { Data } from "effect";

export class ToriiNetworkError extends Data.TaggedError("ToriiNetworkError")<{
    readonly message: string;
    readonly url: string;
    readonly cause?: unknown;
    readonly retryable: boolean;
}> {}

export class ToriiValidationError extends Data.TaggedError(
    "ToriiValidationError"
)<{
    readonly message: string;
    readonly field: string;
    readonly value?: unknown;
    readonly expected?: string;
}> {}

export class ToriiSubscriptionError extends Data.TaggedError(
    "ToriiSubscriptionError"
)<{
    readonly message: string;
    readonly subscriptionId?: bigint;
    readonly operation: "create" | "update" | "cancel";
    readonly cause?: unknown;
}> {}

export class ToriiConfigError extends Data.TaggedError("ToriiConfigError")<{
    readonly message: string;
    readonly field: string;
    readonly expected: string;
}> {}

export class ToriiGrpcError extends Data.TaggedError("ToriiGrpcError")<{
    readonly message: string;
    readonly code?: string;
    readonly method: string;
    readonly details?: unknown;
}> {}

export class ToriiTimeoutError extends Data.TaggedError("ToriiTimeoutError")<{
    readonly message: string;
    readonly operation: string;
    readonly timeoutMs: number;
}> {}

export class ToriiTransformError extends Data.TaggedError(
    "ToriiTransformError"
)<{
    readonly message: string;
    readonly transformer: string;
    readonly cause?: unknown;
}> {}

export type ToriiError =
    | ToriiNetworkError
    | ToriiValidationError
    | ToriiSubscriptionError
    | ToriiConfigError
    | ToriiGrpcError
    | ToriiTimeoutError
    | ToriiTransformError;

// Legacy exports for backward compatibility
export type NetworkError = ToriiNetworkError;
export type ValidationError = ToriiValidationError;
export type SubscriptionError = ToriiSubscriptionError;
export type ConfigError = ToriiConfigError;
export type GrpcError = ToriiGrpcError;
