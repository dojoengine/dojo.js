import { Client } from "@dojoengine/torii-client";

type Callback = (
    propagationSource: string,
    source: string,
    messageId: string,
    topic: string,
    data: Uint8Array
) => void;

export function createRelayInterface(client: Client) {
    return {
        publish: client.publishMessage,
        subscribe: client.subscribeTopic,
        unsubscribe: client.unsubscribeTopic,
        onMessage: client.onMessage as (callback: Callback) => Promise<void>,
    };
}
