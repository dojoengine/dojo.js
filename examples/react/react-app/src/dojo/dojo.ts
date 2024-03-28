import { LOCAL_KATANA } from "@dojoengine/core";
import { Dojo_Starter } from "./dojo_starter";
import manifest from "./manifest.json";

export const dojo_starter = new Dojo_Starter({
    toriiUrl: "http://localhost:8080",
    relayUrl: "/ip4/127.0.0.1/tcp/9090",
    manifest,
});
