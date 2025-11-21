import { Effect } from "effect";
import * as Errors from "./errors";

export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return (
            msg.includes("network") ||
            msg.includes("fetch") ||
            msg.includes("body stream") ||
            msg.includes("connection") ||
            msg.includes("econnrefused") ||
            msg.includes("enotfound")
        );
    }
    return false;
};

export const isTimeoutError = (error: unknown): boolean => {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return msg.includes("timeout") || msg.includes("timed out");
    }
    return false;
};

export const mapGrpcError =
    (method: string, url: string = "unknown") =>
    (error: unknown): Errors.ToriiError => {
        if (error instanceof Error) {
            if (isNetworkError(error)) {
                return new Errors.ToriiNetworkError({
                    message: error.message,
                    url,
                    cause: error,
                    retryable: true,
                });
            }

            if (isTimeoutError(error)) {
                return new Errors.ToriiTimeoutError({
                    message: error.message,
                    operation: method,
                    timeoutMs: 30000,
                });
            }

            return new Errors.ToriiGrpcError({
                message: error.message,
                method,
                details: error,
            });
        }

        return new Errors.ToriiGrpcError({
            message: String(error),
            method,
        });
    };

export const mapTransformError =
    (transformer: string) =>
    (error: unknown): Errors.ToriiTransformError => {
        return new Errors.ToriiTransformError({
            message:
                error instanceof Error ? error.message : String(error),
            transformer,
            cause: error,
        });
    };

export const mapSubscriptionError =
    (operation: Errors.ToriiSubscriptionError["operation"], subscriptionId?: bigint) =>
    (error: unknown): Errors.ToriiSubscriptionError => {
        return new Errors.ToriiSubscriptionError({
            message:
                error instanceof Error ? error.message : String(error),
            subscriptionId,
            operation,
            cause: error,
        });
    };

export const wrapInEffect =
    <A>(fn: () => A, errorMapper: (error: unknown) => Errors.ToriiError): Effect.Effect<A, Errors.ToriiError> =>
        Effect.try({
            try: fn,
            catch: errorMapper,
        });

export const mapErrorWithRetry = <E extends Errors.ToriiError>(
    effect: Effect.Effect<any, E>,
    method: string
): Effect.Effect<any, E> =>
    effect.pipe(
        Effect.mapError((error) => {
            if (
                error instanceof Errors.ToriiNetworkError &&
                error.retryable
            ) {
                return error;
            }
            return error;
        })
    );
