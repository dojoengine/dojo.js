import { Schema, Effect } from "effect";
import { ConfigError } from "./errors";
import { addAddressPadding } from "starknet";

export const ToriiClientConfigSchema = Schema.Struct({
    toriiUrl: Schema.String.pipe(Schema.pattern(/^https?:\/\/.+/)),
    worldAddress: Schema.String,
    autoReconnect: Schema.propertySignature(Schema.Boolean).pipe(
        Schema.withConstructorDefault(() => true)
    ),
    maxReconnectAttempts: Schema.propertySignature(
        Schema.Number.pipe(Schema.int(), Schema.positive())
    ).pipe(Schema.withConstructorDefault(() => 5)),
    reconnectDelay: Schema.propertySignature(
        Schema.Number.pipe(Schema.int(), Schema.positive())
    ).pipe(Schema.withConstructorDefault(() => 1000)),
});

export type ToriiClientConfig = Schema.Schema.Type<
    typeof ToriiClientConfigSchema
>;

export const validateConfig = (
    config: unknown
): Effect.Effect<ToriiClientConfig, ConfigError, never> =>
    Effect.gen(function* () {
        const decoded = yield* Effect.try({
            try: () => Schema.decodeUnknownSync(ToriiClientConfigSchema)(config),
            catch: (error) =>
                new ConfigError({
                    message: `Configuration validation failed: ${error}`,
                }),
        });

        const paddedAddress = addAddressPadding(decoded.worldAddress);
        if (!paddedAddress || paddedAddress.length !== 66) {
            return yield* Effect.fail(
                new ConfigError({
                    message: "Invalid world address format",
                    field: "worldAddress",
                })
            );
        }

        return {
            ...decoded,
            worldAddress: paddedAddress,
        };
    });
