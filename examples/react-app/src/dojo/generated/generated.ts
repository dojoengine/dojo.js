import { Account } from "starknet";
import * as torii from "@dojoengine/torii-client";
import { DojoProvider } from "@dojoengine/core";
import { Direction } from "../../utils";

interface DojoClient {
    manifest: any;
    rpcUrl: string;
    toriiUrl: string;
}

export type CreateDojoClient = Awaited<ReturnType<typeof dojoClient>>;

export async function dojoClient(dojoClient: DojoClient) {
    const { rpcUrl, toriiUrl, manifest } = dojoClient;

    const toriiClient = await torii.createClient([], {
        rpcUrl,
        toriiUrl,
        worldAddress: manifest.world.address,
    });

    return {
        toriiClient,
        client: await setupWorld(new DojoProvider(manifest, rpcUrl)),
    };
}

export type SetupWorld = Awaited<ReturnType<typeof setupWorld>>;

export async function setupWorld(provider: DojoProvider) {
    const world_address = "0x0000000";

    function actions() {
        const contract_name = "actions";

        const spawn = async ({ account }: { account: Account }) => {
            try {
                return await provider.execute(account, contract_name, "spawn", [
                    world_address,
                ]);
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

        const move = async ({
            account,
            direction,
        }: {
            account: Account;
            direction: Direction;
        }) => {
            try {
                return await provider.execute(account, contract_name, "move", [
                    world_address,
                    direction,
                ]);
            } catch (error) {
                console.error("Error executing move:", error);
                throw error;
            }
        };
        return { spawn, move };
    }
    return {
        actions: actions(),
    };
}
