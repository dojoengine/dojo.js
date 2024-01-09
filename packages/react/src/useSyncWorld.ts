import { Component, Metadata, Schema } from "@dojoengine/recs";
import { useEffect } from "react";
import { Client } from "@dojoengine/torii-client";
import { getEntities } from "@dojoengine/state";

export function useSyncWorld<S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[]
) {
    useEffect(() => {
        getEntities(client, components);
    }, [client]);
}
