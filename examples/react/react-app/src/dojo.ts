import manifest from "./manifest.json";
import { DojoStarter } from "./dojo_starter";

export const dojo = new DojoStarter({
    manifest,
    toriiUrl: "http://localhost:8080",
    relayUrl: "",
});
