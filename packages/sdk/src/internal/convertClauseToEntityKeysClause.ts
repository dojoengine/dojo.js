import type { EntityKeysClause, Clause } from "@dojoengine/torii-wasm/types";
import type { SchemaType, ToriiResponse } from "../internal/types";

export function intoEntityKeysClause<T extends SchemaType>(
    clause: Clause | undefined,
    initialData: ToriiResponse<T, false> = []
): EntityKeysClause[] {
    // We want to send over placeholder but this case is very unlikely to happen
    if (!clause) {
        return [];
    }

    // if we have keys clause, we can move forward to query those keys directly
    if (Object.hasOwn(clause, "Keys")) {
        return [clause as unknown as EntityKeysClause];
    }

    // if we have initial wih query.dont_include_hash_keys = false
    // we can move forward to query those hashed keys directly
    if (initialData && initialData.length > 0) {
        return [{ HashedKeys: initialData.map((e) => e.entityId) }];
    }

    // We want to avoid those kind of weird cases where we are guessing what data should be retrieved
    if (
        (Object.hasOwn(clause, "Member") ||
            Object.hasOwn(clause, "Composite")) &&
        initialData.length === 0
    ) {
        throw new Error(
            "You cannot use CompositeClause | MemberClause to subscribe to entity updates, include initial data with hashed keys"
        );
    }

    return [];
}
