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
        publish: async (topic: string, message: Uint8Array) =>
            await client.publishMessage(topic, message),
        subscribe: async (topic: string) => await client.subscribeTopic(topic),
        unsubscribe: async (topic: string) =>
            await client.unsubscribeTopic(topic),
        onMessage: async (callback: Callback) =>
            await client.onMessage(callback),
    };
}
