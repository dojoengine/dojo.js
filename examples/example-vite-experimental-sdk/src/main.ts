import "./style.css";
import { init } from "@dojoengine/sdk/experimental";
import { dojoConfig } from "../dojoConfig.ts";
import { ThemeManager } from "./theme-manager";
import { UpdateManager } from "./update-manager";
import { ClauseBuilder, ToriiQueryBuilder } from "@dojoengine/sdk";

async function main() {
    const um = new UpdateManager();
    new ThemeManager();

    const sdk = await init({
        client: {
            toriiUrl: dojoConfig.toriiUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    });
    const entities = await sdk.getEntities(
        new ToriiQueryBuilder()
            .withClause(new ClauseBuilder().keys([], [undefined]).build())
            .addOrderBy("remaining", "Asc")
            .build()
    );
    console.log("entities", entities);

    const events = await sdk.getEvents(
        new ToriiQueryBuilder()
            .withClause(new ClauseBuilder().keys([], [undefined]).build())
            .build()
    );
    console.log("events", events);

    const [initialEntities, freeSubscription] = await sdk.subscribeEntities(
        new ToriiQueryBuilder()
            .withClause(new ClauseBuilder().keys([], [undefined]).build())
            .addOrderBy("remaining", "Asc")
            .includeHashedKeys()
            .build(),
        ({ data, error }) => {
            if (data) {
                console.log(data);
            }
            if (error) {
                console.log(error);
            }
        }
    );
    console.log(initialEntities, freeSubscription);

    um.displayUpdate("fetch", initialEntities);
}

main().catch(console.error);
