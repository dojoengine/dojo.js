import { Atom } from "@effect-atom/atom-react";
import { makeToriiLayer } from "../services/torii";
// import manifest from "../../../../../../worlds/dojo-starter/manifest_dev.json" with {
//     type: "json",
// };
import manifest from "../../manifest_sepolia.json" with { type: "json" };

export const toriiRuntime = Atom.runtime(
    makeToriiLayer(
        { manifest, toriiUrl: "https://api.cartridge.gg/x/nums-bal/torii" },
        { autoReconnect: false, maxReconnectAttempts: 5 }
    )
);
