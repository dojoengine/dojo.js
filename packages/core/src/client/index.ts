import { DojoProvider } from "../provider";
import * as torii from "@dojoengine/torii-client";

interface DojoClientConfig {
    manifest: any;
    rpcUrl: string;
    toriiUrl: string;
}

export async function dojoClient<T extends DojoProvider, U>(
    { manifest, rpcUrl, toriiUrl }: DojoClientConfig,
    setupWorld: (provider: T) => Promise<U>
) {
    const toriiClient = await torii.createClient([], {
        rpcUrl,
        toriiUrl,
        worldAddress: manifest.world.address,
    });

    return {
        toriiClient,
        client: await setupWorld(new DojoProvider(manifest, rpcUrl) as T),
    };
}
